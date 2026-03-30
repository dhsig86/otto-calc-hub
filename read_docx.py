import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(path, out_path):
    try:
        with zipfile.ZipFile(path) as docx:
            tree = ET.XML(docx.read('word/document.xml'))
            namespace = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            paragraphs = []
            for paragraph in tree.iter(f'{namespace}p'):
                texts = [node.text for node in paragraph.iter(f'{namespace}t') if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(paragraphs))
            return "Success"
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    print(extract_text(sys.argv[1], sys.argv[2]))
