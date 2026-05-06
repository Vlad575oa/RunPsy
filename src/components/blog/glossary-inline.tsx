import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { getGlossaryEntryByMatch, glossaryTermPattern } from "@/lib/glossary";

function buildGlossaryHref(articlePath: string, sectionId: string, entrySlug: string, articleLink?: string) {
  if (articleLink) return articleLink;
  const from = `${articlePath}#${sectionId}`;
  return `/glossary?from=${encodeURIComponent(from)}#${entrySlug}`;
}

function renderExternalLinks(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\[(?:https?:\/\/[^\]]+)\])/g);
  return parts.filter(Boolean).map((part, index) => {
    const bracketUrl = part.match(/^\[(https?:\/\/[^\]]+)\]$/);
    if (bracketUrl) {
      return (
        <a
          key={`${keyPrefix}-link-${index}`}
          href={bracketUrl[1]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть источник"
          className="mx-1 inline-flex items-center rounded text-[var(--accent)] hover:opacity-75"
        >
          🌐
        </a>
      );
    }
    return <Fragment key={`${keyPrefix}-text-${index}`}>{part}</Fragment>;
  });
}

export function renderGlossaryInline(text: string | undefined | null, articlePath: string, sectionId: string): ReactNode {
  if (!text) return text;
  
  const matches = [...text.matchAll(glossaryTermPattern)];
  if (!matches.length) {
    return <>{renderExternalLinks(text, `${sectionId}-plain`)}</>;
  }

  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const matchedText = match[0];
    const start = match.index ?? 0;
    const end = start + matchedText.length;
    const entry = getGlossaryEntryByMatch(matchedText);

    if (start > lastIndex) {
      nodes.push(...renderExternalLinks(text.slice(lastIndex, start), `text-${index}`));
    }

    if (entry) {
      nodes.push(
        <Link
          key={`${entry.slug}-${start}-${index}`}
          href={buildGlossaryHref(articlePath, sectionId, entry.slug, entry.articleLink)}
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
    nodes.push(...renderExternalLinks(text.slice(lastIndex), "tail"));
  }

  return nodes;
}
