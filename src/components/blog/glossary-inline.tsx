import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { getGlossaryEntryByMatch, glossaryTermPattern } from "@/lib/glossary";

function buildGlossaryHref(articlePath: string, sectionId: string, entrySlug: string) {
  const from = `${articlePath}#${sectionId}`;
  return `/glossary?from=${encodeURIComponent(from)}#${entrySlug}`;
}

export function renderGlossaryInline(text: string | undefined | null, articlePath: string, sectionId: string): ReactNode {
  if (!text) return text;
  
  const matches = [...text.matchAll(glossaryTermPattern)];
  if (!matches.length) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const matchedText = match[0];
    const start = match.index ?? 0;
    const end = start + matchedText.length;
    const entry = getGlossaryEntryByMatch(matchedText);

    if (start > lastIndex) {
      nodes.push(<Fragment key={`text-${index}`}>{text.slice(lastIndex, start)}</Fragment>);
    }

    if (entry) {
      nodes.push(
        <Link
          key={`${entry.slug}-${start}-${index}`}
          href={buildGlossaryHref(articlePath, sectionId, entry.slug)}
          className="rounded-[0.35rem] border border-black/10 bg-black/[0.03] px-1 py-0.5 text-[0.95em] font-medium text-[var(--text)] underline decoration-[0.08em] underline-offset-[0.16em] transition hover:border-[var(--accent)] hover:bg-[#fff2e6] hover:text-[var(--accent-deep)]"
          title={`Открыть термин: ${entry.term}`}
        >
          {matchedText}
        </Link>,
      );
    } else {
      nodes.push(<Fragment key={`fallback-${index}`}>{matchedText}</Fragment>);
    }

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    nodes.push(<Fragment key="tail">{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}
