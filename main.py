from pathlib import Path
from pydantic import BaseModel
from fastapi import FastAPI, Request
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

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

ROUTES = {
    "/": "index.html",
    "/about": "about.html",
    "/courses": "courses.html",
    "/course": "course.html",
    "/course-ml-dl": "course-ml-dl.html",
    "/course-gen-ai": "course-gen-ai.html",
    "/course-mlops": "course-mlops.html",
    "/course-ai-ethics": "course-ai-ethics.html",
    "/course-capstone": "course-capstone.html",
    "/internships": "internships.html",
    "/internship": "internship.html",
    "/internship-ai-research": "internship-ai-research.html",
    "/internship-semiconductor": "internship-semiconductor.html",
    "/internship-cloud": "internship-cloud.html",
    "/internship-embedded": "internship-embedded.html",
    "/internship-ai-product": "internship-ai-product.html",
    "/internship-research": "internship-research.html",
    "/internship-swe": "internships.html",
    "/internship-data": "internships.html",
    "/contact": "contact.html",
    "/what-we-offer": "what-we-offer.html",
    "/why-choose": "why-choose.html",
    "/ai-training": "ai-training.html",
    "/career-readiness": "career-readiness.html",
    "/higher-education": "higher-education.html",
    "/industry-academia": "industry-academia.html",
    "/semiconductor": "semiconductor.html",
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
    target = PUBLIC_DIR / "404.html"
    if target.exists():
        return FileResponse(target, status_code=404)
    return HTMLResponse("<h1>404 \u2014 Page Not Found</h1>", status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
