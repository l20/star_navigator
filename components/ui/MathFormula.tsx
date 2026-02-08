'use client';

import katex from 'katex';
import { useEffect, useState } from 'react';

interface MathFormulaProps {
  tex: string;
  block?: boolean;
  className?: string; // Allow custom styling
}

export default function MathFormula({ tex, block = false, className = '' }: MathFormulaProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const rendered = katex.renderToString(tex, {
        throwOnError: false,
        displayMode: block
      });
      setHtml(rendered);
    } catch (e) {
      console.error("KaTeX Error:", e);
      setHtml(tex); // Fallback to plain text
    }
  }, [tex, block]);

  return (
    <span
      className={`math-formula ${className}`} // Add class for potential global styling
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
