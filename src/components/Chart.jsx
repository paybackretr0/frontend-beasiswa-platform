import { useState, useMemo } from "react";
import Card from "./Card";

const ChartEmptyState = ({ message = "Tidak ada data untuk ditampilkan" }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <svg
      className="w-16 h-16 text-gray-300 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-sm text-gray-500 text-center">{message}</p>
  </div>
);

const HorizontalBarChart = ({ data, title, description }) => {
  const hasData =
    data && data.length > 0 && data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data distribusi untuk ditampilkan" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((x) => x.value));

  return (
    <Card title={title} description={description}>
      <div className="space-y-3 mt-4">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700">{d.label}</span>
              <span className="text-sm font-semibold text-gray-800">
                {d.value}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded h-3">
              <div
                className="h-3 rounded bg-[#2D60FF] transition-all duration-300"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const LineChart = ({ data, title, description }) => {
  const [hovered, setHovered] = useState(null);

  const hasData =
    data && data.length > 0 && data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data tren untuk ditampilkan" />
      </Card>
    );
  }

  const width = 400;
  const height = 200;
  const padding = 40;

  const { points, areaPath, linePath, maxValue, yAxisLabels } = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((d, i) => {
      const x = padding + ((width - 2 * padding) / (data.length - 1)) * i;
      const y =
        height -
        padding -
        ((height - 2 * padding) * (d.value - minValue)) / range;
      return { ...d, x, y };
    });

    // Generate smooth curve
    const line = (points) => {
      return points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x},${point.y}`;

        const prev = arr[i - 1];
        const cpx1 = prev.x + (point.x - prev.x) / 3;
        const cpy1 = prev.y;
        const cpx2 = point.x - (point.x - prev.x) / 3;
        const cpy2 = point.y;

        return `${acc} C ${cpx1},${cpy1} ${cpx2},${cpy2} ${point.x},${point.y}`;
      }, "");
    };

    const linePath = line(points);
    const area = `${linePath} L ${points[points.length - 1].x},${
      height - padding
    } L ${padding},${height - padding} Z`;

    // Y-axis labels
    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
      const value = minValue + (range * i) / 4;
      return {
        value: Math.round(value),
        y: height - padding - ((height - 2 * padding) * i) / 4,
      };
    });

    return { points, areaPath: area, linePath, maxValue, yAxisLabels };
  }, [data, width, height]);

  return (
    <Card title={title} description={description}>
      <div className="relative flex flex-col items-center mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D60FF" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2D60FF" stopOpacity={0.02} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {yAxisLabels.map((label, i) => (
            <g key={i}>
              <line
                x1={padding}
                y1={label.y}
                x2={width - padding}
                y2={label.y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padding - 8}
                y={label.y}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                dy="0.3em"
              >
                {label.value}
              </text>
            </g>
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#areaGradient)" stroke="none" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#2D60FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered?.label === p.label ? 8 : 6}
                fill="white"
                stroke="#2D60FF"
                strokeWidth={hovered?.label === p.label ? 3 : 2}
                className="transition-all duration-200 drop-shadow-sm"
              />
              {hovered?.label === p.label && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill="#2D60FF"
                  fillOpacity={0.1}
                />
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - padding + 16}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
              fontWeight="500"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none transition-all duration-200 z-10"
            style={{
              left: hovered.x,
              top: hovered.y - 10,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-semibold text-gray-800">{hovered.label}</div>
            <div className="text-blue-600 font-bold">
              {hovered.value} pendaftar
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Tambahkan komponen baru untuk performance chart
const PerformanceBarChart = ({ data, title, description }) => {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data performa untuk ditampilkan" />
      </Card>
    );
  }

  return (
    <Card title={title} description={description}>
      <div className="space-y-4 mt-4">
        {data.map((d, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 truncate">
                {d.label}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {d.tingkat_keberhasilan || d.tingkat_penerimaan}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Pendaftar:</span>
                <span className="font-semibold">
                  {d.pendaftar || d.total_pendaftar}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diterima:</span>
                <span className="font-semibold text-green-600">
                  {d.diterima}
                </span>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${d.tingkat_keberhasilan || d.tingkat_penerimaan}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PieChart = ({ data, title, description }) => {
  const hasData =
    data && data.length > 0 && data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data distribusi untuk ditampilkan" />
      </Card>
    );
  }

  const size = 200;
  const radius = size / 2 - 10;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data distribusi untuk ditampilkan" />
      </Card>
    );
  }

  const [hoveredIndex, setHoveredIndex] = useState(null);

  let cumulative = 0;
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI;

    const x1 = size / 2 + radius * Math.cos(startAngle);
    const y1 = size / 2 + radius * Math.sin(startAngle);
    const x2 = size / 2 + radius * Math.cos(endAngle);
    const y2 = size / 2 + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${size / 2} ${size / 2}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    return (
      <path
        key={i}
        d={pathData}
        fill={d.color}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)",
          transformOrigin: "center",
          transition: "transform 0.2s ease-in-out",
          cursor: "pointer",
        }}
      />
    );
  });

  const legend = data.map((d, i) => (
    <div key={i} className="flex items-center gap-2 text-sm">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ background: d.color }}
      />
      <span>
        {d.label} ({d.value})
      </span>
    </div>
  ));

  return (
    <Card title={title} description={description}>
      <div className="flex flex-col items-center mt-4 relative">
        <svg width={size} height={size} className="drop-shadow-sm">
          {slices}
        </svg>
        {hoveredIndex !== null && (
          <div
            className="absolute px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none transition-all duration-200 z-10"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="font-semibold text-gray-800">
              {data[hoveredIndex].label}
            </div>
            <div className="text-blue-600 font-bold">
              {data[hoveredIndex].value} pendaftar
            </div>
          </div>
        )}
        <div className="mt-4 space-y-1">{legend}</div>
      </div>
    </Card>
  );
};

export {
  LineChart,
  PieChart,
  HorizontalBarChart,
  ChartEmptyState,
  PerformanceBarChart,
};
