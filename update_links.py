import os
import re
from pathlib import Path

PUBLIC_DIR = Path("a:/FreeLancing/Saku_Global/public")
MASTER_AI_FILE = PUBLIC_DIR / "saku_pages" / "masterai.html"

# 1. Update all Apply Now links
apply_now_pattern = re.compile(r'<a\s+([^>]*)>Apply Now</a>', re.IGNORECASE)

for root, _, files in os.walk(PUBLIC_DIR):
    for file in files:
        if file.endswith(".html"):
            filepath = Path(root) / file
            content = filepath.read_text(encoding="utf-8")
            
            def replace_href(match):
                attrs = match.group(1)
                # Remove existing href completely
                attrs = re.sub(r'\bhref\s*=\s*"[^"]*"', '', attrs)
                # Add new href
                attrs = f'href="/application-form" {attrs}'.strip()
                # Clean up multiple spaces
                attrs = re.sub(r'\s+', ' ', attrs)
                return f'<a {attrs}>Apply Now</a>'
            
            new_content = apply_now_pattern.sub(replace_href, content)
            if new_content != content:
                filepath.write_text(new_content, encoding="utf-8")
                print(f"Updated Apply Now buttons in {filepath.name}")

# 2. Make masterai.html cards clickable
if MASTER_AI_FILE.exists():
    content = MASTER_AI_FILE.read_text(encoding="utf-8")
    
    course_routes = {
        "Master in AI Creation": "/saku/master-ai/track-a/master-in-ai-creation",
        "Data Science Foundations with Python": "/saku/master-ai/track-a/data-science-foundations",
        "Practical Machine Learning": "/saku/master-ai/track-a/practical-machine-learning",
        "Full Stack Development with AI": "/saku/master-ai/track-b/full-stack-dev-ai",
        "Deep Learning and Computer Vision": "/saku/master-ai/track-b/deep-learning-cv",
        "Advanced AI with NLP, LLMs, RL &amp; Ethics": "/saku/master-ai/track-b/advanced-ai-nlp-llms-rl",
        "Reinforcement Learning and Responsible AI": "/saku/master-ai/track-b/rl-and-responsible-ai",
        "Master of AI Application Engineering": "/saku/master-ai/track-b/master-ai-app-engineering",
        "Applied AI Engineering Programme": "/saku/master-ai/track-c/applied-ai-engineering",
        "AI Essentials for Doctors": "/saku/master-ai/track-d/ai-essentials-doctors",
        "AI Fundamentals for Doctors": "/saku/master-ai/track-d/ai-fundamentals-doctors",
        "AI Excellence for Doctors": "/saku/master-ai/track-d/ai-excellence-doctors",
    }
    
    # We want to replace `<div class="course-card">` with `<a href="..." class="course-card" style="text-decoration: none; color: inherit;">`
    # and the corresponding closing `</div>` with `</a>`.
    
    # Since the structure is:
    # <div class="course-card">
    # <div class="course-main">
    # <h4 class="course-title">TITLE</h4>
    # ...
    # </div>
    # <div class="course-price-wrap">...</div>
    # </div>
    
    import re
    # We can split by `<div class="course-card">`
    parts = content.split('<div class="course-card">')
    new_content = parts[0]
    
    for part in parts[1:]:
        # Extract title to find the route
        title_match = re.search(r'<h4 class="course-title">\s*(.*?)\s*</h4>', part, re.DOTALL)
        if title_match:
            title = title_match.group(1).strip()
            # Handle HTML entities in python string literal
            title = title.replace('&amp;', '&')
            
            route = None
            for key in course_routes:
                if key.replace('&amp;', '&') == title:
                    route = course_routes[key]
                    break
            
            if route:
                new_content += f'<a href="{route}" class="course-card" style="text-decoration: none; color: inherit;">'
                # Find the matching closing div for course-card
                # We know the card ends with `</div>\n</div>` right before the next card or track action.
                # A safer way is to replace the LAST `</div>` in this part with `</a>`
                # Let's split from right by </div>
                sub_parts = part.rsplit('</div>', 1)
                if len(sub_parts) == 2:
                    new_content += sub_parts[0] + '</a>' + sub_parts[1]
                else:
                    new_content += part
            else:
                new_content += '<div class="course-card">' + part
        else:
            new_content += '<div class="course-card">' + part
            
    if new_content != content:
        MASTER_AI_FILE.write_text(new_content, encoding="utf-8")
        print("Updated course cards in masterai.html")
    else:
        print("No changes needed in masterai.html")
