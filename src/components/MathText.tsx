import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * MathFraction renders a mathematical horizontal fraction (a/b)
 * with numerator on top, fraction bar, and denominator below.
 */
export const MathFraction: React.FC<{ num: string; den: string; whole?: string; className?: string }> = ({
  num,
  den,
  whole,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-baseline align-middle mx-1 font-serif select-none ${className}`}>
      {whole && <span className="font-bold text-base mr-1.5 self-center">{whole}</span>}
      <span className="inline-flex flex-col items-center justify-center text-[0.82em] leading-none align-middle">
        <span className="border-b-[1.5px] border-current px-1 pb-[1px] font-bold text-center w-full min-w-[0.9em]">
          {num}
        </span>
        <span className="pt-[2px] font-bold text-center w-full min-w-[0.9em]">
          {den}
        </span>
      </span>
    </span>
  );
};

/**
 * MathText parses math notations inside Indonesian text such as:
 * - Mixed fractions: "3 5/6", "5 2/7", "2 1/4"
 * - Simple fractions: "23/6", "3/4", "1/2", "7/20"
 * - Exponents: "10³", "10⁴", "10⁻³", "10^4", "10^-2"
 * - Operators: "x" -> "×", ":" or "/" in ops -> "÷"
 * - Variables: "a x 10ⁿ", "1 ≤ a < 10"
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by lines to preserve paragraphs
  const lines = text.split('\n');

  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        // Regex to identify mixed fraction (e.g., "3 5/6") or simple fraction (e.g., "23/6" or "1/2")
        // Also capture exponents like 10^4 or 10^-2
        const parts: React.ReactNode[] = [];
        // Pattern:
        // 1) Mixed fraction: (\b\d+)\s+([0-9]+)\/([0-9]+)\b
        // 2) Simple fraction: \b([0-9]+)\/([0-9]+)\b
        // 3) Powers like 10\^([0-9\-]+)
        const regex = /(\b\d+)\s+([0-9]+)\/([0-9]+)\b|\b([0-9]+)\/([0-9]+)\b|10\^([0-9\-]+)|([0-9]+(?:\.[0-9]+)?\s*×\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)/g;

        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          // Push text before match
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }

          if (match[1] && match[2] && match[3]) {
            // Mixed fraction: match[1] whole, match[2] num, match[3] den
            parts.push(
              <MathFraction
                key={`${lineIdx}-${match.index}`}
                whole={match[1]}
                num={match[2]}
                den={match[3]}
              />
            );
          } else if (match[4] && match[5]) {
            // Simple fraction: match[4] num, match[5] den
            parts.push(
              <MathFraction
                key={`${lineIdx}-${match.index}`}
                num={match[4]}
                den={match[5]}
              />
            );
          } else if (match[6]) {
            // Power: 10^n
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="font-mono font-semibold">
                10<sup>{match[6]}</sup>
              </span>
            );
          } else if (match[7]) {
            // Scientific notation with unicode exponent
            parts.push(
              <span key={`${lineIdx}-${match.index}`} className="font-mono font-semibold tracking-wide">
                {match[7]}
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
