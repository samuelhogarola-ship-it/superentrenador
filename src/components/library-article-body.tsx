import type { ReactNode } from "react";

function plainText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function LibraryArticleBody({ body, format }: { body: string; format: "markdown" | "html" }) {
  const safeBody = format === "html" ? plainText(body) : body;
  const blocks = safeBody.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const content: ReactNode[] = [];

  for (const [index, block] of blocks.entries()) {
    const heading = block.match(/^(#{2,3})\s+([\s\S]+)$/);
    if (heading) {
      content.push(<h2 key={index} className="mt-10 font-heading text-2xl font-bold text-[#111214]">{heading[2]}</h2>);
      continue;
    }

    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      content.push(<ul key={index} className="my-6 list-disc space-y-2 pl-6 text-[#4f4f56]">{lines.map((line) => <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>)}</ul>);
      continue;
    }

    content.push(<p key={index} className="mt-5 whitespace-pre-line leading-8 text-[#4f4f56]">{block}</p>);
  }

  return <div>{content}</div>;
}
