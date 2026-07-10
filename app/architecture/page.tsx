import Reveal from "../components/reveal";
import architectureData from "../../public/data/architecture.json";

interface CodeElement {
  type: "code";
  lang: string;
  content: string;
}

interface HeadingElement {
  type: "h1" | "h2" | "h3";
  text: string;
}

interface ParagraphElement {
  type: "p";
  text: string;
}

interface BlockquoteElement {
  type: "blockquote";
  text: string;
}

interface TableElement {
  type: "table";
  rows: { type: "sep" | "row"; cells?: string[] }[];
}

interface ListElement {
  type: "list";
  items: string[];
}

type Element =
  | CodeElement
  | HeadingElement
  | ParagraphElement
  | BlockquoteElement
  | TableElement
  | ListElement;

function inlineMd(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-white/10 px-1 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function renderElement(el: Element, idx: number) {
  switch (el.type) {
    case "h1":
      return (
        <h1 key={idx} className="mb-4 text-3xl font-bold">
          <span className="text-gradient">{el.text}</span>
        </h1>
      );
    case "h2":
      return (
        <h2 key={idx} className="mb-3 mt-10 text-xl font-semibold text-white/85">
          {el.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={idx} className="mb-2 mt-6 text-lg font-medium text-white/70">
          {el.text}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="mb-3 leading-relaxed text-white/55">
          {inlineMd(el.text)}
        </p>
      );
    case "blockquote":
      return (
        <blockquote
          key={idx}
          className="my-4 border-l-2 border-indigo-500/40 pl-4 text-white/45 italic"
        >
          {inlineMd(el.text)}
        </blockquote>
      );
    case "code":
      return (
        <div key={idx} className="my-4 overflow-hidden rounded-xl bg-[#0d1128] border border-white/10">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
            <span className="font-mono text-[10px] text-white/25 uppercase">
              {el.lang}
            </span>
          </div>
          <pre className="overflow-x-auto p-4">
            <code className="font-mono text-xs leading-relaxed text-white/60">
              {el.content}
            </code>
          </pre>
        </div>
      );
    case "table":
      return (
        <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {el.rows
                  .filter((r) => r.type === "row")
                  .slice(0, 1)
                  .flatMap((row) =>
                    row.cells!.map((cell, ci) => (
                      <th
                        key={ci}
                        className="px-4 py-2.5 font-medium text-white/50"
                      >
                        {cell}
                      </th>
                    ))
                  )}
              </tr>
            </thead>
            <tbody>
              {el.rows
                .filter((r) => r.type === "row")
                .slice(1)
                .map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    {row.cells!.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-white/45">
                        {inlineMd(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    case "list":
      return (
        <ul key={idx} className="mb-4 space-y-1.5">
          {el.items.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-white/55">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-400/60" />
              <span className="leading-relaxed">{inlineMd(item)}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function ArchitecturePage() {
  const elements = architectureData as Element[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Reveal>
        <div className="mb-12">
          {elements
            .filter((el) => el.type === "h1")
            .map((el, i) => renderElement(el, i))}
          <p className="text-white/30 font-mono text-xs">
            最后更新: 2026-07-10 · 来源: docs/architecture.md
          </p>
        </div>
      </Reveal>

      <Reveal stagger={0.03}>
        <article className="max-w-none">
          {elements
            .filter((el) => el.type !== "h1")
            .map((el, i) => renderElement(el, i))}
        </article>
      </Reveal>
    </div>
  );
}