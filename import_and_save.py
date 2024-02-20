import os
from xml.etree import ElementTree as ET

# Replace 'your_wordpress_export.xml' with the path to your XML file
xml_file = 'your_wordpress_export.xml'

tree = ET.parse(xml_file)
root = tree.getroot()

# Namespace may be required to parse certain elements
namespaces = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    # Add other namespaces here if needed
}

# Loop through each post/item in the XML
for item in root.findall('.//item'):
    title = item.find('title').text
    pubDate = item.find('pubDate').text
    content_encoded = item.find('content:encoded', namespaces).text

    # Extract image URL from content if present
    image_url = 'No image URL found'  # Default message if no image URL is found
    if '<img src="' in content_encoded:
        start = content_encoded.find('<img src="') + len('<img src="')
        end = content_encoded.find('"', start)
        image_url = content_encoded[start:end]
    
    # Create a new HTML file for the post
    filename = title.replace(' ', '_').lower() + '.html'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('<body>\n')
        f.write('    <header>\n')
        f.write(f'        <div class="header-content">\n')
        f.write(f'            <h1>{title}</h1>\n')
        f.write('            <div id="shareButtonContainer">\n')
        f.write('                <button onclick="shareContent()">Share</button>\n')
        f.write('            </div>\n')
        f.write('        </div>\n')
        f.write('    </header>\n')
        f.write('    <article>\n')
        f.write(content_encoded + '\n')
        f.write('    </article>\n')
        f.write('    <footer>\n')
        f.write('        <p>&copy; 2024 Modern Male. All rights reserved.</p>\n')
        f.write('    </footer>\n')
        f.write('</body>\n')

    print(f'File {filename} has been created with image URL: {image_url} and published date: {pubDate}')
