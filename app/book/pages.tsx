/* Native anchors intentionally enable cross-document view transitions and work without JS. */
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { copy, projects, research, url, type Language } from "./content";
import { notes } from "./notes-data";

export const paths = ["", "research", "projects", "notes", "personal",
  ...research("en").map(p => `research/${p.slug}`),
  ...projects.en.map(p => `projects/${p.slug}`),
  ...notes.map(p => `notes/${p.slug}`)];

export function pageMetadata(path: string, language: Language): Metadata {
  const c = copy[language];
  const [section, slug] = path.split("/");
  const item = section === "research" ? research(language).find(p => p.slug === slug)
    : section === "projects" ? projects[language].find(p => p.slug === slug)
    : section === "notes" ? notes.find(p => p.slug === slug) : undefined;
  const title = item?.title ?? (section === "personal" ? c.personalTitle : c.nav[["", "research", "projects", "notes", "personal"].indexOf(path)]);
  const description = section === "notes" ? (notes.find(n => n.slug === slug)?.description || c.notesDescription)
    : section === "research" ? research(language).find(p => p.slug === slug)?.question || c.researchDescription
    : section === "projects" ? projects[language].find(p => p.slug === slug)?.description || c.projectsDescription
    : section === "personal" ? c.personal[0] : c.intro[0];
  return { title: `${title || c.name} | ${c.name}`, description,
    alternates: { canonical: `https://zhansleo.github.io${url(path, language)}`,
      languages: { en: `https://zhansleo.github.io${url(path)}`, "zh-CN": `https://zhansleo.github.io${url(path, "zh")}` } } };
}

function Contact({ language }: { language: Language }) {
  const c = copy[language];
  return <footer className="book-contact"><h2>{c.contactTitle}</h2><p>{c.contact}</p><a href="mailto:1061124482@qq.com">1061124482@qq.com</a></footer>;
}
function Icon({ github = false }: { github?: boolean }) {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{github ? <><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3A5.7 5.7 0 0 0 19.3 4a5.2 5.2 0 0 0-.1-4S18-.4 15 1.5a14 14 0 0 0-6 0C6-.4 4.8 0 4.8 0a5.2 5.2 0 0 0-.1 4A5.7 5.7 0 0 0 3.2 8c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 9 18v4" transform="translate(1 2) scale(.86)" /></> : <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>}</svg>;
}
function Identity({ language }: { language: Language }) {
  const c = copy[language];
  return <aside className="book-identity" aria-label={language === "en" ? "About me" : "基本信息"}>
    <div className="portrait-frame"><Image src="/my-portfolio/images/hanshi-portrait.png" alt={language === "en" ? "Illustrated portrait of Hanshi Zhao" : "赵寒石的手绘肖像"} width={144} height={184} unoptimized priority/></div>
    <h1>{c.name}</h1><p className="identity-university">{c.university}</p>
    <p className="identity-subjects">{c.degrees.map(d => <span key={d}>{d}</span>)}</p>
    <div className="identity-contact"><a href="mailto:1061124482@qq.com"><Icon/>1061124482@qq.com</a><a href="https://github.com/ZhansLeo" target="_blank" rel="noopener noreferrer"><Icon github/>GitHub <span className="sr-only">({language === "en" ? "opens a new tab" : "新窗口打开"})</span></a></div>
  </aside>;
}
function SectionTitle({ title, path, language }: { title: string; path: string; language: Language }) {
  return <div className="book-section-title"><h2>{title}</h2><a href={url(path, language)}>{copy[language].all}<span aria-hidden="true"> →</span></a></div>;
}
function ResearchList({ language }: { language: Language }) {
  return <div className="book-list">{research(language).map(p => <article key={p.slug}><h3><a href={url(`research/${p.slug}`, language)}>{p.title}</a></h3><p>{p.question}</p><a className="text-link" href={url(`research/${p.slug}`, language)}>{copy[language].read}<span aria-hidden="true"> →</span></a></article>)}</div>;
}
function ProjectList({ language }: { language: Language }) {
  return <div className="book-list project-pair">{projects[language].map(p => <article key={p.slug}><h3><a href={url(`projects/${p.slug}`, language)}>{p.title}</a></h3><p className="project-subtitle">{p.subtitle}</p><p>{p.description}</p><a className="text-link" href={url(`projects/${p.slug}`, language)}>{copy[language].read}<span aria-hidden="true"> →</span></a></article>)}</div>;
}
function NotesList({ language, recent = false }: { language: Language; recent?: boolean }) {
  const entries = notes.filter(n => n.slug !== "home");
  const selected = recent ? entries.slice(0, 3) : entries;
  return <div className="notes-list" lang={language === "en" ? "en" : "zh-CN"}>{selected.length ? selected.map(n => {
    const listing = language === "en" ? n.englishListing : n;
    return <article key={n.slug}><div><h3><a href={url(`notes/${n.slug}`, language)}>{listing.title}</a></h3>{!recent && listing.description && <p>{listing.description}</p>}{!recent && <p className="note-tags">{listing.tags.join(" · ")}</p>}</div><time dateTime={n.updated}>{n.updated}</time></article>;
  }) : <p>{copy[language].empty}</p>}</div>;
}
function PageHeader({ title, description }: { title: string; description?: string }) {
  return <header className="book-page-header"><h1>{title}</h1>{description && <p>{description}</p>}</header>;
}
function ResearchDetail({ slug, language }: { slug: string; language: Language }) {
  const p = research(language).find(p => p.slug === slug);
  if (!p) notFound();
  const c = copy[language];
  return <article className="book-document"><a className="back-link" href={url("research", language)}>← {c.nav[1]}</a>
    <header className="book-page-header"><p className="book-meta">{c.independent}</p><h1>{p.title}</h1><p>{p.question}</p><p className="book-meta">{p.period}</p></header>
    <section><h2>{c.researchLabels[0]}</h2><p>{p.intro}</p></section><section><h2>{c.researchLabels[1]}</h2><p>{p.design}</p></section>
    <section><h2>{c.researchLabels[2]}</h2><p>{p.finding}</p><div className="book-table" tabIndex={0} role="region" aria-label={c.results}><table><caption>{c.results}</caption><thead><tr>{p.columns.map(col => <th scope="col" key={col}>{col}</th>)}</tr></thead><tbody>{p.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div><ul>{p.observations.map(o => <li key={o}>{o}</li>)}</ul></section>
    <section><h2>{c.researchLabels[3]}</h2><p>{p.contribution}</p></section><section><h2>{c.researchLabels[4]}</h2><p>{p.limitations}</p></section><section><h2>{c.researchLabels[5]}</h2><p>{p.next}</p></section>
    <footer className="book-source"><a href={p.repo} target="_blank" rel="noopener noreferrer">{c.source} ↗</a><p>{c.sourceNote}</p></footer></article>;
}

export function BookPage({ path = "", language = "en" }: { path?: string; language?: Language }) {
  if (!paths.includes(path)) notFound();
  const c = copy[language];
  const [section, slug] = path.split("/");
  if (!path) return <div className="book-home" lang={language === "zh" ? "zh-CN" : "en"}><Identity language={language}/><div className="book-home-content"><header className="book-intro">{c.intro.map(p => <p key={p}>{p}</p>)}</header>
    <section id="research" className="book-chapter"><SectionTitle title={c.nav[1]} path="research" language={language}/><ResearchList language={language}/></section>
    <section className="book-chapter"><SectionTitle title={c.nav[2]} path="projects" language={language}/><ProjectList language={language}/></section>
    <section className="book-chapter"><SectionTitle title={c.nav[3]} path="notes" language={language}/>{language === "en" && <p className="book-meta">{c.chinese}</p>}<NotesList language={language} recent/></section><Contact language={language}/></div></div>;
  if (section === "research" && slug) return <ResearchDetail slug={slug} language={language}/>;
  if (section === "projects" && slug) {
    const project = projects[language].find(p => p.slug === slug);
    if (!project) notFound();
    return <article className="book-document"><a className="back-link" href={url("projects", language)}>← {c.nav[2]}</a><PageHeader title={project.title} description={project.subtitle}/><p className="book-meta">{project.period} · {project.role}</p>{project.paragraphs.map(p => <p key={p}>{p}</p>)}<footer className="book-source"><a href={project.link} target={project.link.startsWith("https:") ? "_blank" : undefined} rel="noopener noreferrer">{project.linkText}{project.link.startsWith("https:") ? " ↗" : ""}</a></footer></article>;
  }
  if (section === "notes" && slug) {
    const note = notes.find(n => n.slug === slug);
    if (!note) notFound();
    return <article className="book-document book-note"><a className="back-link" href={url("notes", language)}>← {c.nav[3]}</a><div lang="zh-CN"><PageHeader title={note.title} description={note.description}/><p className="book-meta"><time dateTime={note.updated}>{note.updated}</time> · {note.tags.join(" · ")}</p><div className="note-body" dangerouslySetInnerHTML={{ __html: language === "zh" ? note.zhHtml : note.html }}/></div></article>;
  }
  if (section === "personal") return <article className="book-document book-personal"><PageHeader title={c.personalTitle}/>{c.personal.map(p => <p key={p}>{p}</p>)}<a href="mailto:1061124482@qq.com">1061124482@qq.com</a></article>;
  return <div className="book-document"><PageHeader title={c.nav[["", "research", "projects", "notes", "personal"].indexOf(section)]} description={section === "research" ? c.researchDescription : section === "projects" ? c.projectsDescription : c.notesDescription}/>{section === "research" ? <ResearchList language={language}/> : section === "projects" ? <ProjectList language={language}/> : <NotesList language={language}/>}</div>;
}
