const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./content');
const englishListings = require('../content/note-listings.en.json');

// The published Wiki remains the sole content source. Notes are intentionally Chinese.
const notes = load('wiki').map(note => {
  const listing = englishListings[note.slug];
  if (!listing || typeof listing.title !== 'string' || !listing.title.trim() || typeof listing.description !== 'string' || (note.description && !listing.description.trim()) || !Array.isArray(listing.tags) || listing.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
    throw new Error(`Missing English listing metadata for ${note.slug}; update content/note-listings.en.json.`);
  }
  return {
  ...note,
  englishListing: listing,
  html: note.html.replaceAll('/my-portfolio/wiki/pages/', '/my-portfolio/notes/'),
  zhHtml: note.html.replaceAll('/my-portfolio/wiki/pages/', '/my-portfolio/zh/notes/'),
}; }).sort((a, b) => b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug));
fs.writeFileSync(path.join(__dirname, '../app/book/notes-data.ts'),
  'export const notes = ' + JSON.stringify(notes, null, 2) + ';\n');
console.log(`notes: generated ${notes.length} Chinese entries, with two navigation languages`);
