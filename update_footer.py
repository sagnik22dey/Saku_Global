import os
import re

dir_path = r'a:\FreeLancing\Saku_Global\public\saku_pages'

new_footer_cols = """<div class="footer-col">
            <h4 class="footer-col-title">Programme</h4>
            <div class="footer-links">
              <a href="/saku/ai-training">AI Training &amp; Workforce Development</a>
              <a href="/saku/semiconductor">Semiconductor Manufacturing Education &amp; Training</a>
              <a href="/saku/quantum">Quantum Communication Technology Programme</a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Services</h4>
            <div class="footer-links">
              <a href="/saku/higher-ed">Higher Education Consultancy</a>
              <a href="/saku/industry-academia">Industry - Academia Engagement</a>
              <a href="/saku/career-readiness">Career Readiness &amp; Employability Solutions</a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Company</h4>
            <div class="footer-links">
              <a href="/about_us">About Us</a>
              <a href="#">Advisory Board</a>
              <a href="#">Internships</a>
              <a href="#">International</a>
              <a href="#">Careers</a>
            </div>
          </div>"""

def replace_footer(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(file_path, 'r', encoding='utf-16') as f:
            content = f.read()
            
    original = content
            
    # Replace Program with Programme in text
    content = content.replace('Quantum Communication Technology Program<', 'Quantum Communication Technology Programme<')
    content = content.replace('>Program<', '>Programme<')
    content = content.replace(' Technology Program"', ' Technology Programme"')

    # Replace the footer cols
    # Find start of Program footer-col
    start_str = '<h4 class="footer-col-title">Program</h4>'
    if start_str not in content:
        start_str = '<h4 class="footer-col-title">Programme</h4>'
        
    if start_str in content:
        start_idx = content.rfind('<div class="footer-col">', 0, content.find(start_str))
        end_str = '<h4 class="footer-col-title">Connect</h4>'
        if end_str in content:
            end_idx = content.rfind('<div class="footer-col">', 0, content.find(end_str))
            if start_idx != -1 and end_idx != -1:
                content = content[:start_idx] + new_footer_cols + '\n\n          ' + content[end_idx:]

    if original != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Processed {file_path}')

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.html'):
            replace_footer(os.path.join(root, file))

