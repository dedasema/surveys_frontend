import React from "react";

/**
 * Renderizador de Markdown ligero, seguro y optimizado para las respuestas del Copiloto MCP.
 * Soporta encabezados (#, ##, ###), negritas (**texto**), cursivas (*texto*), viñetas (- o •),
 * listas numeradas (1.), código en línea (`código`), enlaces y saltos de línea.
 */
export function CopilotMarkdown({ content, sender = "bot" }) {
  if (!content) return null;

  const lines = content.split("\n");

  const renderInlineFormatted = (text) => {
    // Regex para tokens: `code`, **bold**, *italic*, [label](url), o URL cruda
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Código en línea: `code`
      if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
        const codeText = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded-md font-mono text-[11px] bg-slate-100 text-indigo-700 border border-slate-200/80 font-semibold"
          >
            {codeText}
          </code>
        );
      }

      // Negrita: **bold**
      if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-slate-900">
            {boldText}
          </strong>
        );
      }

      // Cursiva: *italic*
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        const italicText = part.slice(1, -1);
        return (
          <em key={index} className="italic text-slate-700">
            {italicText}
          </em>
        );
      }

      // Enlace Markdown: [label](url)
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const closeBracket = part.indexOf("](");
        const label = part.slice(1, closeBracket);
        const url = part.slice(closeBracket + 2, -1);
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors"
          >
            {label}
          </a>
        );
      }

      // URL cruda
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all font-semibold transition-colors"
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-800">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();

        // Línea vacía
        if (!trimmed) {
          return <div key={lIdx} className="h-1.5" />;
        }

        // Títulos
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lIdx} className="font-bold text-sm text-slate-900 mt-2.5 mb-1">
              {renderInlineFormatted(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={lIdx} className="font-extrabold text-base text-slate-950 mt-3 mb-1">
              {renderInlineFormatted(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={lIdx} className="font-black text-lg text-slate-950 mt-3.5 mb-1.5">
              {renderInlineFormatted(trimmed.slice(2))}
            </h2>
          );
        }

        // Viñetas: • o - o *
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const itemText = trimmed.replace(/^[•\-*]\s+/, "");
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-blue-600 font-bold select-none">•</span>
              <div className="flex-1">{renderInlineFormatted(itemText)}</div>
            </div>
          );
        }

        // Listas numeradas: ej "1. ", "2. "
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const [, num, itemText] = numMatch;
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="font-bold text-blue-700 min-w-[1.2rem] text-right select-none">
                {num}.
              </span>
              <div className="flex-1">{renderInlineFormatted(itemText)}</div>
            </div>
          );
        }

        // Separador horizontal: --- o ***
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={lIdx} className="my-2 border-slate-200" />;
        }

        // Párrafo estándar
        return (
          <p key={lIdx} className="leading-relaxed">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}
export default CopilotMarkdown;
