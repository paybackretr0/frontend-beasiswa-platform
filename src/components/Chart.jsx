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

  // Check if data is empty or all values are 0
  const hasData =
    data && data.length > 0 && data.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <Card title={title} description={description}>
        <ChartEmptyState message="Belum ada data tren untuk ditampilkan" />
      </Card>
    );
  }

  const width = 360;
  const height = 180;
  const padding = 32;

  const { points, areaPath, linePath, maxValue } = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value));

    const points = data.map((d, i) => {
      const x = padding + ((width - 2 * padding) / (data.length - 1)) * i;
      const y =
        height - padding - ((height - 2 * padding) * d.value) / maxValue;
      return { ...d, x, y };
    });

    const controlPoint = (current, previous, next, isEnd) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = { x: p.x, y: p.y };
      const angle = Math.atan2(n.y - o.y, n.x - o.x);
      const length = Math.sqrt((n.x - o.x) ** 2 + (n.y - o.y) ** 2) * smoothing;
      const x = current.x + Math.cos(angle + Math.PI) * length;
      const y = current.y + Math.sin(angle + Math.PI) * length;
      return [x, y];
    };

    const line = points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const [cpsX, cpsY] = controlPoint(arr[i - 1], arr[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, arr[i - 1], arr[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    }, "");

    const area = `${line} L ${points[points.length - 1].x},${
      height - padding
    } L ${padding},${height - padding} Z`;

    return { points, areaPath: area, linePath: line, maxValue };
  }, [data, width, height]);

  return (
    <Card title={title} description={description}>
      <div className="relative flex flex-col items-center mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D60FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2D60FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ((height - 2 * padding) / 4) * i}
              x2={width - padding}
              y2={padding + ((height - 2 * padding) / 4) * i}
              stroke="#eee"
              strokeDasharray="4"
            />
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
                r={10}
                fill="#2D60FF"
                fillOpacity={hovered?.label === p.label ? 0.2 : 0}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill="white"
                stroke="#2D60FF"
                strokeWidth={2}
                className={`transition-transform duration-200 ${
                  hovered?.label === p.label ? "scale-125" : ""
                }`}
              />
            </g>
          ))}

          {/* Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - padding + 18}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none transition-all duration-200 z-10"
            style={{
              left: hovered.x,
              top: hovered.y - 15,
              transform: "translate(-50%, -100%)",
            }}
          >
            {hovered.label}: <span className="font-bold">{hovered.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const PieChart = ({ data, title, description }) => {
  // Check if data is empty or all values are 0
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

    return <path key={i} d={pathData} fill={d.color} />;
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
      <div className="flex flex-col items-center mt-4">
        <svg width={size} height={size} className="drop-shadow-sm">
          {slices}
        </svg>
        <div className="mt-4 space-y-1">{legend}</div>
      </div>
    </Card>
  );
};

const StatusSummary = () => (
  <Card
    title="Status Pendaftaran"
    description="Ringkasan status pendaftaran beasiswa"
  >
    <div className="space-y-3 mt-2">
      {statusCounts.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-[#D9D9D9] rounded-lg px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-sm text-gray-700">{s.label}</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">{s.value}</span>
        </div>
      ))}
    </div>
  </Card>
);

const ActivityCard = () => (
  <Card
    title="Aktivitas Terbaru"
    description="Aktivitas sistem dalam 24 jam terakhir"
  >
    <ul className="mt-2 space-y-3">
      {activities.map((act, idx) => (
        <li
          key={idx}
          className="flex items-center gap-2 bg-[#D9D9D9] rounded-lg px-4 py-2"
        >
          <span className="text-xs text-[#2D60FF] font-semibold min-w-[110px]">
            {act.type}
          </span>
          <span className="text-sm text-gray-700 flex-1">{act.desc}</span>
          <span className="text-xs text-gray-500">{act.time}</span>
        </li>
      ))}
    </ul>
  </Card>
);

export {
  LineChart,
  PieChart,
  HorizontalBarChart,
  StatusSummary,
  ActivityCard,
  ChartEmptyState,
};
