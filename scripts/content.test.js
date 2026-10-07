const test = require("node:test");
const assert = require("node:assert/strict");
const { parse, renderer, load } = require("./content");
const { identity, references } = require("./writing");
test("raw HTML and script URLs cannot execute", () => {
  const html = renderer("blog", "test").render('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[x](javascript:alert(1))\n\n![x](data:image/svg+xml;base64,PHN2Zz4=)');
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("<img "));
  assert.ok(!html.includes('href="javascript:'));
});
test("YAML metadata is data and aliases cannot expand", () => {
  const result = parse('---\ntitle: example\ndraft: true\n---\nbody');
  assert.equal(result.data.draft, true);
  assert.throws(() => parse("---\ntitle: &x [one]\ntags: [*x]\n---\n"));
});
test("tables, code, images, math and old wiki links work", () => {
  const fence = String.fromCharCode(96).repeat(3);
  const html = renderer("wiki", "test").render('|a|b|\n|-|-|\n|1|2|\n\n' + fence + 'js\nconst a = "<script>";\n' + fence + '\n\n$x^2$\n\n$$\na+b\n$$\n\n![结果](/media/wiki/test/chart.png)\n\n[首页](home)\n\n[博客](/blog)');
  for (const marker of ["<table>", "<pre>", "katex", "/my-portfolio/media/wiki/test/chart.png", "/my-portfolio/wiki/pages/home/", "/my-portfolio/blog"]) assert.ok(html.includes(marker), marker);
  assert.ok(html.includes("&lt;script&gt;"));
});
test("KaTeX does not trust HTML or javascript extensions", () => {
  const html = renderer("blog", "test").render('$\\href{javascript:alert(1)}{click}$');
  assert.ok(!html.includes('href="javascript:'));
});
test("local image escape and unsafe slugs are rejected", () => {
  assert.throws(() => identity("blog", "../secret"));
  assert.throws(() => identity("private", "name"));
  assert.throws(() => renderer("blog", "test").render("![x](/media/blog/test/../../secret.png)"));
  assert.throws(() => references(renderer("blog", "test"), "![x](/media/blog/test/a.svg)", identity("blog", "test")));
});
test("existing content remains renderable", () => {
  assert.ok(load("blog").some(p => p.slug === "hello-agent"));
  assert.ok(load("wiki").some(p => p.slug === "home"));
});
test("Chinese punctuation can end bold text without added spaces", () => {
  const html = renderer("wiki", "test").render("**假设：**在相同条件下。**CEM（交叉熵方法）**的搜索。中文**“结论”**继续。");
  assert.ok(html.includes("<strong>假设：</strong>在"));
  assert.ok(html.includes("<strong>CEM（交叉熵方法）</strong>的"));
  assert.ok(html.includes("<strong>“结论”</strong>继续"));
});
test("CJK emphasis preserves escaped markers and code literals", () => {
  const tick = String.fromCharCode(96);
  const html = renderer("wiki", "test").render(tick + "**假设：**正文" + tick + "\n\n\\*\\*假设：\\*\\*正文");
  assert.ok(html.includes("<code>**假设：**正文</code>"));
  assert.ok(!html.includes("<strong>"));
});
test("VLN note has no unrendered strong delimiters", () => {
  const note = load("wiki").find(p => p.slug === "vln-learning-notes");
  assert.ok(note);
  assert.ok(!note.html.includes("**"));
  assert.ok(note.html.includes("<strong>闭环修正。</strong>"));
});
