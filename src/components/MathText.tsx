import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * MathFraction renders a mathematical horizontal fraction (a/b)
 * with numerator on top, clean fraction bar, and denominator below.
 */
export const MathFraction: React.FC<{
  num: string;
  den: string;
  whole?: string;
  className?: string;
}> = ({ num, den, whole, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center align-middle mx-0.5 font-sans select-none ${className}`}
      title={whole ? `${whole} ${num}/${den}` : `${num}/${den}`}
    >
      {whole && (
        <span className="font-bold text-[1.05em] mr-1 text-slate-900 leading-none">
          {whole}
        </span>
      )}
      <span className="inline-flex flex-col items-center justify-center text-[0.84em] leading-none align-middle">
        <span className="border-b-[1.5px] border-slate-800 px-1 pb-[1px] font-bold text-center w-full min-w-[0.85em] text-slate-900">
          {num}
        </span>
        <span className="pt-[2px] font-bold text-center w-full min-w-[0.85em] text-slate-900">
          {den}
        </span>
      </span>
    </span>
  );
};

/**
 * Parses and renders mathematical equations and expressions:
 * - Mixed fractions: e.g. "3 5/6", "5 2/7", "2 1/4"
 * - Simple fractions: e.g. "23/6", "3/4", "1/2", "7/20", "3/8", "9/4", "13/5"
 * - Scientific notation & powers: e.g. "10⁴", "10⁻³", "10^4", "10^-2", "a × 10ⁿ"
 * - Math inequalities and operators: "1 ≤ a < 10", "×", "÷", "±"
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by lines to preserve paragraphs
  const lines = text.split('\n');

  // Convert unicode superscripts to standard digits for consistency
  const unicodeSuperscriptMap: Record<string, string> = {
    '⁰': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9',
    '⁻': '-',
    'ⁿ': 'n',
  };

  const renderSuperscript = (supStr: string) => {
    const converted = supStr
      .split('')
      .map((char) => unicodeSuperscriptMap[char] || char)
      .join('');
    return (
      <sup className="text-[0.72em] font-bold text-indigo-700 ml-[1px]">
        {converted}
      </sup>
    );
  };

  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        // Regex patterns:
        // 1) Mixed fraction: e.g. "3 5/6"
        // 2) Simple fraction: e.g. "23/6" or "1/4" (ensuring not a date or path)
        // 3) Scientific notation or power: "10^4", "10^-3", or "10[⁴⁻³ⁿ¹²³⁵⁶⁷⁸⁹⁰]+"
        // 4) Equation variables like "a × 10ⁿ" or "1 ≤ a < 10"
        const regex =
          /(\b\d+)\s+([0-9]+)\/([0-9]+)\b|\b([0-9]+)\/([0-9]+)\b|10\^([0-9\-]+)|10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+)|(\b[a-zA-Z]\s*×\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+)|(1\s*≤\s*a\s*<\s*10)/g;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          // Push preceding plain text
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }

          if (match[1] && match[2] && match[3]) {
            // Mixed fraction: whole, num, den
            parts.push(
              <MathFraction
                key={`${lineIdx}-${match.index}`}
                whole={match[1]}
                num={match[2]}
                den={match[3]}
              />
            );
          } else if (match[4] && match[5]) {
            // Simple fraction: num, den
            parts.push(
              <MathFraction
                key={`${lineIdx}-${match.index}`}
                num={match[4]}
                den={match[5]}
              />
            );
          } else if (match[6]) {
            // 10^n
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="inline-flex items-baseline font-mono font-bold text-slate-900 mx-0.5">
                10<sup>{match[6]}</sup>
              </span>
            );
          } else if (match[7]) {
            // 10 with unicode exponent
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="inline-flex items-baseline font-mono font-bold text-slate-900 mx-0.5">
                10{renderSuperscript(match[7])}
              </span>
            );
          } else if (match[8]) {
            // e.g. "a × 10ⁿ"
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="inline-flex items-center gap-1 font-serif font-bold text-indigo-900 mx-0.5 px-1 py-0.5 bg-indigo-50/60 rounded border border-indigo-100">
                <i className="italic">a</i> × 10<sup>n</sup>
              </span>
            );
          } else if (match[9]) {
            // "1 ≤ a < 10"
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="inline-flex items-center gap-1 font-serif font-bold text-indigo-900 mx-0.5 px-1.5 py-0.5 bg-indigo-50/80 rounded border border-indigo-200">
                1 ≤ <i className="italic">a</i> &lt; 10
              </span>
            );
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        return (
          <React.Fragment key={lineIdx}>
            {parts}
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};
