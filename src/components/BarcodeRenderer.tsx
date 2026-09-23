import React from 'react';

interface BarcodeRendererProps {
  value: string;
  height?: number;
  showText?: boolean;
  className?: string;
  barColor?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  height = 24,
  showText = true,
  className = '',
  barColor = '#1e293b',
}) => {
  // Generate deterministic bar widths based on input string characters
  const generateBars = (code: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    // Start guard
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 1, isSpace: false });
    bars.push({ width: 2, isSpace: true });

    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const pattern = [
        (charCode % 3) + 1,
        ((charCode >> 1) % 2) + 1,
        ((charCode >> 2) % 3) + 1,
        ((charCode >> 3) % 2) + 1,
      ];

      bars.push({ width: pattern[0], isSpace: false });
      bars.push({ width: pattern[1], isSpace: true });
      bars.push({ width: pattern[2], isSpace: false });
      bars.push({ width: pattern[3], isSpace: true });
    }

    // Stop guard
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });

    return bars;
  };

  const bars = generateBars(value);
  let totalWidth = 0;
  bars.forEach((b) => (totalWidth += b.width));

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{ width: '100%', height: `${height}px`, maxWidth: '140px' }}
        className="overflow-visible"
        shapeRendering="crispEdges"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={height}
              fill={barColor}
            />
          );
        })}
      </svg>
      {showText && (
        <span className="text-[8px] font-mono tracking-widest text-slate-600 mt-0.5 tabular-nums">
          *{value}*
        </span>
      )}
    </div>
  );
};
