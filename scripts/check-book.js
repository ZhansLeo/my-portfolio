const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { load } = require('./content');
const root = path.join(__dirname, '..', 'out');
const notes = load('wiki');
const research = ['planning-execution-failures', 'small-llm-math-reasoning-lab'];
const projects = ['cartify', 'market-microstructure'];
const routes = ['', 'research', 'projects', 'notes', 'personal', ...research.map(s => 'research/' + s), ...projects.map(s => 'projects/' + s), ...notes.map(n => 'notes/' + n.slug)];
function read(route) { return fs.readFileSync(path.join(root, route, 'index.html'), 'utf8'); }
for (const route of routes) {
  for (const language of ['en', 'zh']) {
    const current = (language === 'zh' ? 'zh/' : '') + route;
    const html = read(current);
    assert.match(html, new RegExp(`<html[^>]+lang="${language === 'zh' ? 'zh-CN' : 'en'}"`), current + ' document language');
    const canonical = 'https://zhansleo.github.io/my-portfolio/' + (current ? current.replace(/\/$/, '') + '/' : '');
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), current + ' canonical');
    assert.ok(html.includes('hrefLang="en"') || html.includes('hrefLang="zh-CN"'), current + ' alternate language');
    assert.ok(!html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').includes('undefined'), current + ' missing visible content');
    assert.ok(html.includes('id="main-content"'), current + ' main landmark');
  }
}
for (const n of notes) {
  const en = read('notes/' + n.slug);
  const zh = read('zh/notes/' + n.slug);
  // Compare rendered source, including every equation, code block, citation and heading ID.
  assert.ok(en.includes(n.html.replaceAll('/my-portfolio/wiki/pages/', '/my-portfolio/notes/')), n.slug + ' complete Chinese content (English navigation)');
  assert.ok(zh.includes(n.html.replaceAll('/my-portfolio/wiki/pages/', '/my-portfolio/zh/notes/')), n.slug + ' complete Chinese content (Chinese navigation)');
  assert.ok(read('wiki/pages/' + n.slug).includes('/zh/notes/' + n.slug + '/'), n.slug + ' legacy link');
}
for (const slug of research) {
  const table = language => read((language === 'zh' ? 'zh/' : '') + 'research/' + slug).match(/<table>[\s\S]*?<\/table>/)[0];
  const numbers = html => html.replace(/<[^>]+>/g, ' ').match(/\d+(?:\.\d+)?(?:%|k)?/g);
  assert.deepEqual(numbers(table('en')), numbers(table('zh')), slug + ' experimental values');
}
for (const legacy of ['about','blog','papers','rss-reader','digest','status']) {
  assert.ok(read(legacy).includes('历史归档'), legacy + ' archive indication');
}
assert.ok(read('about').includes('id="experience"'), 'old experience anchor');
console.log(`Book checks passed: ${routes.length * 2} pages, ${notes.length} complete Chinese notes, paired research data, and legacy routes.`);
