import re
import glob

files = glob.glob('public/**/*.html', recursive=True)
for f in files:
    content = open(f, encoding='utf-8').read()
    match = re.search(r'<div class="dropdown-content">.*?</div>', content, re.DOTALL)
    if match:
        print(f"--- {f} ---")
        print(match.group(0))
        break
