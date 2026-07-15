import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, Request, UploadFile, Form, File, BackgroundTasks

load_dotenv(override=True)

from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
STATIC_DIR = BASE_DIR / "static"

class ContactRequest(BaseModel):
    firstName: str
    lastName: str
    email: str

app = FastAPI(title="SAKU Global Tech Labs")

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

@app.post("/api/send-confirmation")
async def send_confirmation(
    background_tasks: BackgroundTasks,
    pdf: UploadFile = File(...),
    full_name: str = Form("Unknown"),
    appNumber: str = Form("Unknown"),
    applicant_email: str = Form(""),
    programme: str = Form(""),
):
    """Accept the generated PDF and dispatch confirmation emails to admin and applicant."""
    pdf_content = await pdf.read()
    background_tasks.add_task(
        send_email_background,
        pdf_content, pdf.filename, full_name, appNumber, applicant_email, programme
    )
    return {"status": "success", "message": "Email sending initiated"}

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
