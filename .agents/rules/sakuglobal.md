---
trigger: always_on
---

We are ready to build the next page for our Saku Global FastAPI-based web application.

Here are the details for the page we are implementing:

- **Page Name:** [e.g., About Us / Courses Catalog / Individual Course Detail]
- **Target Filename:** [e.g., about.html / courses.html / course.html]
- **Figma CSS Reference File:** @[Figma-css/about.css] <!-- Replace this with the specific CSS file name -->
- **Page Layout Details:** [Describe any specific layout sections or interactive features on this page, or mention that they should match the figma design/screenshot you will attach]

Please adhere strictly to our established project architecture and coding guidelines:

### 1. Structure & Navigation Consistency

- Re-use the exact same Navbar (Header) and Footer structures and classes established in `public/index.html` and styled in `static/css/common.css`.
- Ensure all links in the header and footer navigate to their correct FastAPI routes.

### 2. Sizing, Spacing & Layout

- Use viewport units (`vw` and `vh`) for major spacing, section padding, margins, and key element dimensions so the design scales fluidly.
- Ensure the layout is fully responsive and optimized for both desktop (PC) and mobile screens. Convert absolute pixel coordinates from the Figma CSS to responsive flexbox/grid containers.

### 3. SVG & Logo Handling

- Do NOT embed raw `<svg>` tags or inline SVG code directly in the HTML.
- For new vector elements or icons, save them as separate `.svg` files in the `static/images/` directory and reference them via `<img>` tags.

### 4. Image Placeholders

- Do not use locally generated placeholder images.
- Use the Picsum API (e.g., `https://picsum.photos/800/600?random=seed_name`) directly for all page illustrations and photography slots.

### 5. Strict Coding Rules (Non-Negotiable)

- **Zero Comments:** Do NOT include any comments (no inline or block comments like `#`, `//`, or `/* */`) in the HTML, CSS, JS, or Python code. Only Python docstrings are permitted where necessary.
- **Windows Commands:** If you run any shell/terminal commands, use `;` instead of `&&` as the command separator.
- **Venv activation:** Activate the existing `venv` virtual environment before executing any Python/dependency actions.

Please verify the current project directory structure first, plan the step-by-step TODO list, and ask any clarifying questions before beginning implementation.
