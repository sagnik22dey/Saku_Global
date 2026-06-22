import re
import glob

new_content = """            <div class="dropdown-content">
              <a href="/saku/ai-training">AI Training & Workforce Development</a>
              <a href="/saku/semiconductor">Semiconductor Manufacturing Education & Training</a>
              <a href="/saku/quantum">Quantum Communication Technology Programme</a>
              <a href="/saku/career-readiness">Career Readiness & Employability Solutions</a>
              <a href="/saku/industry-academia">Industry-Academia Engagement</a>
              <a href="/saku/higher-ed">Higher Education Consultancy</a>
            </div>"""

files = glob.glob('public/saku_pages/**/*.html', recursive=True)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    updated_content = re.sub(
        r'<div class="dropdown-content">.*?</div>',
        new_content,
        content,
        flags=re.DOTALL
    )
    
    if updated_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        print(f"Updated {f}")
