CHOTU FRAME JOURNAL
===================

A personal photography journal by Vishal, also known as Chotu.

This is a standalone static website built around the supplied 30-photo set.
It has no website-builder dependency, no paid front-end library, no external
fonts and no third-party JavaScript.

GALLERY IMAGES
--------------
The original WebP photographs are kept at the repository root.
A GitHub Actions workflow creates smaller WebP derivatives in /thumbnails
for the scrolling archive and collection covers. The original files are
still used in the full-size photograph viewer.

PREVIEW
-------
Open index.html in a modern browser. The gallery, filters and image viewer
work locally without an internet connection after thumbnails are generated.

EDITING
-------
- Photo titles, captions and collection labels: photos.js
- Page content, contact details and metadata: index.html
- Visual design and responsive layout: styles.css
- Gallery, filters, mobile menu and image viewer: main.js
- Thumbnail generation: tools/generate_thumbnails.py
- Thumbnail workflow: .github/workflows/generate-thumbnails.yml
- Browser tab icon: favicon.svg

Keep the original WebP filenames unchanged unless you also update photos.js.
