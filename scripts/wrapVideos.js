const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const pattern = path.resolve(__dirname, '../Public/*.html').replace(/\\/g, '/');// adjust if needed

const files = glob.sync(pattern, { nodir: true });
console.log(pattern)



if (files.length === 0) {
  console.log('No HTML files found.');
  process.exit(0);
}

files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let changed = false;

  $('iframe, video').each((i, el) => {
    const $el = $(el);
    // skip if already inside a .video-container ancestor
    if ($el.closest('.video-container').length === 0) {
      $el.wrap('<div class="video-container"></div>');
      changed = true;
    }
  });

  if (changed) {
    // Preserve <!DOCTYPE ...> if present
    const doctypeMatch = html.match(/^\s*<!doctype [\s\S]*?>/i);
    const newHtmlBody = $.root().html();
    const newHtml = (doctypeMatch ? doctypeMatch[0] + '\n' : '') + newHtmlBody;
    fs.writeFileSync(file, newHtml, 'utf8');
    console.log('Updated:', file);
  }
});

console.log('Done.');