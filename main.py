import os
import smtplib
from email.message import EmailMessage
import secrets
import json
import csv
import io
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, Request, UploadFile, Form, File, BackgroundTasks, Depends, HTTPException, status, Response
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

load_dotenv(override=True)

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
STATIC_DIR = BASE_DIR / "static"

class ContactRequest(BaseModel):
    firstName: str
    lastName: str
    email: str

app = FastAPI(title="SAKU Global Tech Labs")

SESSION_TOKEN = secrets.token_hex(32)

def verify_admin_api(request: Request):
    token = request.cookies.get("admin_session")
    if not token or not secrets.compare_digest(token, SESSION_TOKEN):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return True

def verify_admin_html(request: Request):
    token = request.cookies.get("admin_session")
    if not token or not secrets.compare_digest(token, SESSION_TOKEN):
        raise HTTPException(status_code=status.HTTP_307_TEMPORARY_REDIRECT, headers={"Location": "/admin-login"})
    return True

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/admin-login")
def admin_login(creds: LoginRequest, response: Response):
    correct_username = secrets.compare_digest(creds.username, os.getenv("ADMIN_USERNAME", "admin"))
    correct_password = secrets.compare_digest(creds.password, os.getenv("ADMIN_PASSWORD", "password"))
    if correct_username and correct_password:
        response.set_cookie(key="admin_session", value=SESSION_TOKEN, httponly=True, max_age=86400)
        return {"status": "success"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/admin-login", response_class=HTMLResponse)
def login_page():
    return FileResponse(PUBLIC_DIR / "saku_pages" / "login.html")

@app.post("/api/contact")
async def handle_contact_submission(data: ContactRequest):
    """Handle the contact form submission API."""
    return {"status": "success"}


def _build_email(subject: str, from_addr: str, to_addr: str, body: str, pdf_content: bytes, filename: str) -> EmailMessage:
    """Build an EmailMessage with a PDF attachment."""
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg.set_content(body)
    msg.add_attachment(pdf_content, maintype='application', subtype='pdf', filename=filename)
    return msg


def send_email_background(pdf_content: bytes, filename: str, applicant_name: str, app_number: str, applicant_email: str = "", programme: str = ""):
    """Send confirmation PDF to the SAKU team inbox via Brevo SMTP."""
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)
    to_email = os.getenv("TO_EMAIL", "")

    if not smtp_user or not smtp_password:
        print(f"[EMAIL MOCK] No SMTP credentials. Would email {to_email} for {applicant_name} ({app_number}).")
        return

    subject = f"New Application: {app_number} — {applicant_name}"
    body = (
        f"Hello SAKU Team,\n\n"
        f"A new application has been submitted.\n"
        f"Applicant: {applicant_name}\n"
        f"Email: {applicant_email}\n"
        f"Programme: {programme}\n"
        f"Application Number: {app_number}\n\n"
        f"Please find the attached PDF confirmation.\n\nBest,\nSAKU System"
    )

    try:
        msg = _build_email(subject, smtp_from, to_email, body, pdf_content, filename)
        smtp_host = os.getenv("SMTP_HOST", "smtp-relay.brevo.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        print(f"[EMAIL OK] Sent to {to_email} ({app_number})")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")

COURSE_CODES = {
    "master_in_ai_creation": "MAIC",
    "data_science_foundations": "DSFD",
    "practical_machine_learning": "PMLN",
    "full_stack_development": "FSDA",
    "deep_learning_cv": "DLCV",
    "advanced_ai_nlp_llms": "ANLP",
    "rl_responsible_ai": "RLRA",
    "master_ai_application_engineering": "MAAE",
    "applied_ai_engineering": "AAIE",
    "ai_essentials_doctors": "AIED",
    "ai_fundamentals_doctors": "AIFD",
    "ai_excellence_doctors": "AIXD"
}

def save_application_record(data: dict):
    """Safely save application data into applications.json with timestamp."""
    if not isinstance(data, dict):
        return
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if "submitted_at" not in data or not data["submitted_at"]:
        data["submitted_at"] = now_str
    prog = data.get("programme", "")
    code = COURSE_CODES.get(prog, "GEN1")
    data["courseCode"] = code
    if "appNumber" not in data or not data["appNumber"]:
        ts_code = datetime.now().strftime("%Y%m%d")
        rand_code = secrets.token_hex(2).upper()
        data["appNumber"] = f"SAKU-{ts_code}-{code}-{rand_code}"
    apps_file = BASE_DIR / "applications.json"
    existing_apps = []
    if apps_file.exists():
        try:
            with open(apps_file, "r") as f:
                existing_apps = json.load(f)
        except Exception:
            existing_apps = []
    app_num = data.get("appNumber")
    updated = False
    if app_num:
        for idx, item in enumerate(existing_apps):
            if item.get("appNumber") == app_num:
                existing_apps[idx] = data
                updated = True
                break
    if not updated:
        existing_apps.append(data)
    try:
        with open(apps_file, "w") as f:
            json.dump(existing_apps, f, indent=2)
    except Exception as e:
        print(f"[SAVE ERROR] Failed to save application data: {e}")

@app.post("/api/submit-application")
async def submit_application(request: Request):
    """Save application submission data directly."""
    try:
        data = await request.json()
        save_application_record(data)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/send-confirmation")
async def send_confirmation(
    background_tasks: BackgroundTasks,
    pdf: UploadFile = File(...),
    full_name: str = Form("Unknown"),
    appNumber: str = Form("Unknown"),
    applicant_email: str = Form(""),
    programme: str = Form(""),
    allData: str = Form(None),
):
    """Accept the generated PDF and dispatch confirmation emails to admin and applicant."""
    if allData:
        try:
            parsed_data = json.loads(allData)
            save_application_record(parsed_data)
        except Exception as e:
            print(f"[SAVE ERROR] Failed to save application data: {e}")

    pdf_content = await pdf.read()
    background_tasks.add_task(
        send_email_background,
        pdf_content, pdf.filename, full_name, appNumber, applicant_email, programme
    )
    return {"status": "success", "message": "Email sending initiated"}

@app.get("/api/applications")
def get_applications(authorized: bool = Depends(verify_admin_api)):
    """Retrieve all application records."""
    apps_file = BASE_DIR / "applications.json"
    if apps_file.exists():
        with open(apps_file, "r") as f:
            try:
                data = json.load(f)
                return data
            except json.JSONDecodeError:
                return []
    return []

@app.get("/api/applications/export-csv")
def export_applications_csv(authorized: bool = Depends(verify_admin_api)):
    """Export all student application submissions as a CSV file."""
    apps_file = BASE_DIR / "applications.json"
    existing_apps = []
    if apps_file.exists():
        try:
            with open(apps_file, "r") as f:
                existing_apps = json.load(f)
        except Exception:
            existing_apps = []
    
    headers = [
        "Application Number", "Submitted At", "Full Name", "Email", "Phone",
        "Date of Birth", "Gender", "Country", "State", "City",
        "Applying As", "Highest Qualification", "School / College",
        "Field of Study", "Graduation Year", "Programme",
        "Prior Experience", "Device Access", "Preferred Start",
        "Confirm Details", "Agree Contact", "Receive Updates"
    ]
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)
    
    for app in reversed(existing_apps):
        writer.writerow([
            app.get("appNumber", ""),
            app.get("submitted_at", ""),
            app.get("full_name", ""),
            app.get("email", ""),
            app.get("phone", ""),
            app.get("dob", ""),
            app.get("gender", ""),
            app.get("countryDisplay", app.get("country", "")),
            app.get("state", ""),
            app.get("city", ""),
            app.get("applyDisplay", app.get("applying_as", "")),
            app.get("highestQualDisplay", app.get("highest_qualification", "")),
            app.get("school_college", ""),
            app.get("field_of_study", ""),
            app.get("graduation_year", ""),
            app.get("programmeDisplay", app.get("programme", "")),
            app.get("prior_experience", ""),
            app.get("device_access", ""),
            app.get("startDisplay", app.get("preferred_start", "")),
            app.get("confirm_details", ""),
            app.get("agree_contact", ""),
            app.get("receive_updates", "")
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Saku_Global_Student_Submissions.csv"}
    )


@app.get("/application-submissions", response_class=HTMLResponse)
def application_submissions_page(authorized: bool = Depends(verify_admin_html)):
    return FileResponse(PUBLIC_DIR / "saku_pages" / "application_submissions.html")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

ROUTES = {
    "/": "saku_pages/about_us.html",
    "/home": "pages/index.html",
    "/about": "pages/about.html",
    "/about_us": "saku_pages/about_us.html",
    "/courses-ai": "course-categories/courses-ai.html",
    "/courses-semiconductor": "course-categories/courses-semiconductor.html",
    "/courses-cloud": "course-categories/courses-cloud.html",
    "/courses-placement": "course-categories/courses-placement.html",
    "/courses-vlsi": "course-categories/courses-vlsi.html",
    "/course": "courses/ai/course.html",
    "/course-ml-dl": "courses/ai/course-ml-dl.html",
    "/course-gen-ai": "courses/ai/course-gen-ai.html",
    "/course-mlops": "courses/ai/course-mlops.html",
    "/course-ai-ethics": "courses/ai/course-ai-ethics.html",
    "/course-capstone": "courses/ai/course-capstone.html",
    "/course-vlsi-design": "courses/semiconductor/course-vlsi-design.html",
    "/course-cmos-fab": "courses/semiconductor/course-cmos-fab.html",
    "/course-eda-tools": "courses/semiconductor/course-eda-tools.html",
    "/course-embedded-c": "courses/semiconductor/course-embedded-c.html",
    "/course-soc-arch": "courses/semiconductor/course-soc-arch.html",
    "/course-cloud-core": "courses/cloud/course-cloud-core.html",
    "/course-kubernetes": "courses/cloud/course-kubernetes.html",
    "/course-devops": "courses/cloud/course-devops.html",
    "/course-cloud-sec": "courses/cloud/course-cloud-sec.html",
    "/course-finops": "courses/cloud/course-finops.html",
    "/course-dsa": "courses/placement/course-dsa.html",
    "/course-resume": "courses/placement/course-resume.html",
    "/course-aptitude": "courses/placement/course-aptitude.html",
    "/course-mock-interviews": "courses/placement/course-mock-interviews.html",
    "/course-negotiation": "courses/placement/course-negotiation.html",
    "/course-rtl": "courses/vlsi/course-rtl.html",
    "/course-synthesis": "courses/vlsi/course-synthesis.html",
    "/course-pd-dft": "courses/vlsi/course-pd-dft.html",
    "/course-uvm": "courses/vlsi/course-uvm.html",
    "/course-tapeout": "courses/vlsi/course-tapeout.html",
    "/internships": "pages/internships.html",
    "/internship": "pages/internship.html",
    "/internship-ai-research": "internships/internship-ai-research.html",
    "/internship-semiconductor": "internships/internship-semiconductor.html",
    "/internship-cloud": "internships/internship-cloud.html",
    "/internship-embedded": "internships/internship-embedded.html",
    "/internship-ai-product": "internships/internship-ai-product.html",
    "/internship-research": "internships/internship-research.html",
    "/internship-swe": "pages/internships.html",
    "/internship-data": "pages/internships.html",
    "/contact": "pages/contact.html",
    "/contact_us": "saku_pages/contact.html",
    "/leadership": "saku_pages/leadership.html",
    "/what-we-offer": "saku_pages/what_we_offer.html",
    "/why-choose": "saku_pages/why_choose.html",
    "/ai-training": "pages/ai-training.html",
    "/career-readiness": "pages/career-readiness.html",
    "/higher-education": "pages/higher-education.html",
    "/industry-academia": "pages/industry-academia.html",
    "/semiconductor": "pages/semiconductor.html",
    "/saku/ai-training": "saku_pages/courses/ai_training.html",
    "/saku/semiconductor": "saku_pages/courses/semiconductor.html",
    "/saku/career-readiness": "saku_pages/courses/career_readiness.html",
    "/saku/industry-academia": "saku_pages/courses/industry_academia.html",
    "/saku/higher-ed": "saku_pages/courses/higher_ed.html",
    "/saku/quantum": "saku_pages/courses/quantum.html",
    "/saku/master-ai": "saku_pages/masterai.html",
    "/saku/masterai": "saku_pages/masterai.html",
    "/saku/master-ai/track-a": "saku_pages/courses/master_ai_landing_pages/track_a.html",
    "/saku/master-ai/track-a/master-in-ai-creation": "saku_pages/essential_fundamental_ai/master_in_ai_creation.html",
    "/saku/master-ai/track-a/data-science-foundations": "saku_pages/essential_fundamental_ai/data_science_foundations.html",
    "/saku/master-ai/track-a/practical-machine-learning": "saku_pages/essential_fundamental_ai/practical_machine_learning.html",
    "/saku/master-ai/track-b": "saku_pages/courses/master_ai_landing_pages/track_b.html",
    "/saku/master-ai/track-b/full-stack-dev-ai": "saku_pages/advanced_applied_ai/full_stack_dev_ai.html",
    "/saku/master-ai/track-b/deep-learning-cv": "saku_pages/advanced_applied_ai/deep_learning_cv.html",
    "/saku/master-ai/track-b/advanced-ai-nlp-llms-rl": "saku_pages/advanced_applied_ai/advanced_ai_nlp_llms_rl.html",
    "/saku/master-ai/track-b/rl-and-responsible-ai": "saku_pages/advanced_applied_ai/rl_and_responsible_ai.html",
    "/saku/master-ai/track-b/master-ai-app-engineering": "saku_pages/advanced_applied_ai/master_ai_app_engineering.html",
    "/saku/master-ai/track-c": "saku_pages/courses/master_ai_landing_pages/track_c.html",
    "/saku/master-ai/track-c/applied-ai-engineering": "saku_pages/ai_engineering_flagship/applied_ai_engineering.html",
    "/saku/master-ai/track-d": "saku_pages/courses/master_ai_landing_pages/track_d.html",
    "/saku/master-ai/track-d/ai-essentials-doctors": "saku_pages/medical_healthcare_ai/ai_essentials_doctors.html",
    "/saku/master-ai/track-d/ai-fundamentals-doctors": "saku_pages/medical_healthcare_ai/ai_fundamentals_doctors.html",
    "/saku/master-ai/track-d/ai-excellence-doctors": "saku_pages/medical_healthcare_ai/ai_excellence_doctors.html",
    "/application-form": "saku_pages/application_form.html",
    "/application-received": "saku_pages/application_received.html",
}



def _serve(filename: str) -> FileResponse:
    """Return a public HTML file as a response."""
    return FileResponse(PUBLIC_DIR / filename)


for _path, _file in ROUTES.items():
    app.add_api_route(
        _path,
        (lambda f: lambda: _serve(f))(_file),
        response_class=HTMLResponse,
        include_in_schema=False,
    )


@app.exception_handler(404)
async def not_found(request: Request, exc):
    """Serve a friendly 404 page for unknown routes."""
    target = PUBLIC_DIR / "pages" / "404.html"
    if target.exists():
        return FileResponse(target, status_code=404)
    return HTMLResponse("<h1>404 \u2014 Page Not Found</h1>", status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
