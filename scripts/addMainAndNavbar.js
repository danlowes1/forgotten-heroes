const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const workspaceRoot = path.join(__dirname, '..');
// const pattern = path.join(workspaceRoot, '**', '*.html');
const pattern = path.resolve(__dirname, '../Public/*.html').replace(/\\/g, '/');// adjust if needed

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
  let html = fs.readFileSync(file, 'utf8');
  const doctypeMatch = html.match(/^\s*<!doctype [\s\S]*?>/i);
  const $ = cheerio.load(html, { decodeEntities: false });

  let changed = false;

  // 1) Ensure <main class="page-content"> exists and wraps page content.
  if ($('main.page-content').length === 0) {
    const body = $('body');
    if (body.length) {
      // Collect children and classify: keep nav-bar at start, site-footer at end, wrap rest
      const children = body.contents().toArray();
      const pre = [];
      const post = [];
      const middle = [];

      children.forEach(node => {
        if (node.type === 'tag' && (node.name === 'nav-bar' || node.name === 'navbar' )) {
          pre.push(node);
        } else if (node.type === 'tag' && node.name === 'site-footer') {
          post.push(node);
        } else {
          middle.push(node);
        }
      });

      // Only modify if there's something to wrap
      if (middle.length > 0) {
        // Remove all current body children
        body.empty();

        // Append pre (e.g. nav-bar)
        pre.forEach(n => body.append(n));

        // Create main wrapper and append middle nodes
        const main = $('<main class="page-content"></main>');
        middle.forEach(n => main.append(n));
        body.append(main);

        // Append post (e.g. site-footer)
        post.forEach(n => body.append(n));

        changed = true;
      }
    }
  }

  // 2) Ensure <script src="js/navbarBurger.js"></script> exists before </body>
  const navbarScriptSelector = 'script[src="js/navbarBurger.js"], script[src="./js/navbarBurger.js"], script[src="/js/navbarBurger.js"]';
  if ($(navbarScriptSelector).length === 0) {
    // Add before closing body if body exists, otherwise append at end of document
    if ($('body').length) {
      $('body').append('\n  <script src="js/navbarBurger.js"></script>\n');
    } else {
      $.root().append('\n<script src="js/navbarBurger.js"></script>\n');
    }
    changed = true;
  }

  if (changed) {
    // backup
    try {
      fs.copyFileSync(file, file + '.bak');
    } catch (err) {
      console.error('Failed to create backup for', file, err);
      return;
    }

    // Rebuild HTML with preserved doctype if present
    const rebuilt = (doctypeMatch ? doctypeMatch[0] + '\n' : '') + $.html();
    fs.writeFileSync(file, rebuilt, 'utf8');
    console.log('Updated:', file);
  }
});

console.log('Done.');