const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const workspaceRoot = path.join(__dirname, '..');
const pattern = path.join(workspaceRoot, '**', '*.html');

const ignore = [
  path.join(workspaceRoot, 'node_modules', '**'),
  path.join(workspaceRoot, '.git', '**'),
  path.join(workspaceRoot, 'scripts', '**')
];

const files = glob.sync(pattern, { nodir: true, ignore });

if (!files.length) {
  console.log('No HTML files found.');
  process.exit(0);
}

files.forEach(file => {
  const original = fs.readFileSync(file, 'utf8');
  const doctypeMatch = original.match(/^\s*<!doctype [\s\S]*?>/i);

  const $ = cheerio.load(original, { decodeEntities: false });
  let changed = false;

  // match src values like "js/navbarBurger.js", "./js/navbarBurger.js", "/js/navbarBurger.js"
  $('script[src]').each((i, el) => {
    const $el = $(el);
    let src = ($el.attr('src') || '').trim();
    // normalize leading ./ or /
    src = src.replace(/^\.?\//, '');
    if (src.toLowerCase() === 'js/navbarburger.js') {
      // replace whole tag with exact desired tag
      $el.replaceWith('<script src="js/global.js"></script>');
      changed = true;
    }
  });

  if (changed) {
    // create a backup
    try {
      fs.copyFileSync(file, file + '.bak');
    } catch (err) {
      console.error('Failed to create backup for', file, err);
      return;
    }

    const rebuilt = (doctypeMatch ? doctypeMatch[0] + '\n' : '') + $.html();
    fs.writeFileSync(file, rebuilt, 'utf8');
    console.log('Updated:', file);
  }
});

console.log('Done.');