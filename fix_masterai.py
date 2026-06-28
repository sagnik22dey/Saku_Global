import re
from pathlib import Path

MASTER_AI_FILE = Path("a:/FreeLancing/Saku_Global/public/saku_pages/masterai.html")

content = MASTER_AI_FILE.read_text(encoding="utf-8")

# We want to replace the closing </div> of the course-card with </a>
# We can find all the <a href="..." class="course-card" ...> tags and match them with their closing tag.
# A simpler way since we know the exact structure:
# Each course card has exactly:
# <div class="course-price-suffix">incl. GST</div>
# </div>
# </div>
# The outer </div> is what needs to be </a>.

new_content = content.replace(
    '<div class="course-price-suffix">incl. GST</div>\n</div>\n</div>',
    '<div class="course-price-suffix">incl. GST</div>\n</div>\n</a>'
)

# Wait, we might have carriage returns \r\n, let's use regex
pattern = re.compile(r'(<div class="course-price-suffix">incl\. GST</div>\s*</div>\s*)</div>')
new_content = pattern.sub(r'\1</a>', content)

if new_content != content:
    MASTER_AI_FILE.write_text(new_content, encoding="utf-8")
    print("Fixed closing tags in masterai.html")
else:
    print("No changes needed or regex didn't match.")
