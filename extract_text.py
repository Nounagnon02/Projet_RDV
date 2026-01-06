import xml.etree.ElementTree as ET
import sys

def extract_text(xml_content):
    root = ET.fromstring(xml_content)
    # The namespace might vary, let's try to handle it or just find all 't' tags
    text = []
    # Simplified search for any tag ending in 't' or 'p' might be risky, 
    # but docx uses w:t for text.
    for p in root.iter():
        if p.tag.endswith('t'):
            if p.text:
                text.append(p.text)
        elif p.tag.endswith('p'):
            text.append('\n')
    
    return "".join(text)

if __name__ == "__main__":
    xml_input = sys.stdin.read()
    print(extract_text(xml_input))



