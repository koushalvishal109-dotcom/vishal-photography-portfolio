CHOTU FRAME JOURNAL
===================

A personal photography journal by Vishal, also known as Chotu.

This standalone site is built around the supplied 30-photo set. It has no
website-builder dependency, paid front-end library, external fonts or
third-party JavaScript.

GALLERY IMAGES
--------------
Original WebP photographs stay at the repository root.
A GitHub Actions workflow generates smaller WebP derivatives in /thumbnails
for the scrolling archive and collection covers. The originals remain
available in the full-size photograph viewer.

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
