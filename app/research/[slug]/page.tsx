import Link from "next/link";
import { notFound } from "next/navigation";
import { researchProjects } from "../projects";
export function generateStaticParams() { return researchProjects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = researchProjects.find(p => p.slug === slug);
  return { title: `${project?.title ?? "科研实践"} | 赵寒石`, description: project?.question };
}
export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = researchProjects.find(p => p.slug === slug);
  if (!project) notFound();
  return <article className="site-page research-document">
    <Link className="back-link" href="/#research">返回科研实践</Link>
    <header className="page-header"><p>独立完成 · 科研学习实践 · 未发表</p><h1>{project.title}</h1><p>{project.question}</p><p>{project.period}</p></header>
    <section><h2>研究的问题</h2><p>{project.intro}</p></section>
    <section><h2>如何验证</h2><p>{project.design}</p></section>
    <section><h2>实验结果</h2><p>{project.finding}</p><div className="results-scroll" tabIndex={0} role="region" aria-label="实验数据，可横向滚动"><table><caption>冻结实验结果，数据来自项目公开记录</caption><thead><tr>{project.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead><tbody>{project.rows.map(row => <tr key={row[0]}>{row.map((c, i) => i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>)}</tr>)}</tbody></table></div><ul>{project.observations.map(o => <li key={o}>{o}</li>)}</ul></section>
    <section><h2>我完成的工作</h2><p>{project.contribution}</p></section>
    <section><h2>结论的边界</h2><p>{project.limitations}</p></section>
    <section><h2>下一步的问题</h2><p>{project.next}</p></section>
    <footer className="research-source"><a href={project.repo} target="_blank" rel="noreferrer">查看代码、实验协议与原始结果 ↗</a><p>项目页概述研究过程；指标定义与复现条件以仓库记录为准。</p></footer>
  </article>;
}
