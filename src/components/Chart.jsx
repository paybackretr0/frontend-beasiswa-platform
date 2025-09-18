import { useState, useMemo } from "react";
import Card from "./Card";

const summaryData = [
  { title: "Jumlah Pendaftar", value: 1240 },
  { title: "Jumlah Penyedia", value: 12 },
  { title: "Menunggu Verifikasi", value: 87 },
  { title: "Total Pendanaan", value: "Rp 1.250.000.000" },
];

const fakultasData = [
  { label: "Teknik", value: 120 },
  { label: "Ekonomi", value: 95 },
  { label: "Hukum", value: 80 },
  { label: "Kedokteran", value: 60 },
  { label: "MIPA", value: 50 },
];

const departemenData = [
  { label: "Informatika", value: 70 },
  { label: "Manajemen", value: 55 },
  { label: "Agroteknologi", value: 40 },
  { label: "Ilmu Hukum", value: 35 },
  { label: "Sistem Informasi", value: 35 },
];

const tahunData = [
  { label: "2021", value: 180 },
  { label: "2022", value: 210 },
  { label: "2023", value: 250 },
  { label: "2024", value: 300 },
  { label: "2025", value: 320 },
];

const genderData = [
  { label: "Laki-laki", value: 600, color: "#2D60FF" },
  { label: "Perempuan", value: 640, color: "#FF69B4" },
];

// Horizontal Bar Chart
const HorizontalBarChart = ({ data, title, description }) => (
  <Card title={title} description={description}>
    <div className="space-y-3 mt-2">
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
              className="h-3 rounded bg-[#2D60FF]"
              style={{
                width: `${
                  (d.value / Math.max(...data.map((x) => x.value))) * 100
                }%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const LineChart = ({ data, title, description }) => {
  const [hovered, setHovered] = useState(null); // Data point yang di-hover

  // Dimensi chart
  const width = 360;
  const height = 180;
  const padding = 32;

  // -- Kalkulasi yang dioptimalkan dengan useMemo --
  // Memoize akan mencegah kalkulasi ulang jika data dan dimensi tidak berubah
  const { points, areaPath, linePath, maxValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], areaPath: "", linePath: "", maxValue: 0 };
    }

    const maxValue = Math.max(...data.map((d) => d.value));

    // 1. Menghitung koordinat setiap titik
    const points = data.map((d, i) => {
      const x = padding + ((width - 2 * padding) / (data.length - 1)) * i;
      const y =
        height - padding - ((height - 2 * padding) * d.value) / maxValue;
      return { ...d, x, y };
    });

    // 2. Helper function untuk membuat kontrol poin kurva (untuk garis halus)
    const controlPoint = (current, previous, next, isEnd) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = {
        x: p.x,
        y: p.y,
      };
      const angle = Math.atan2(n.y - o.y, n.x - o.x);
      const length = Math.sqrt((n.x - o.x) ** 2 + (n.y - o.y) ** 2) * smoothing;
      const x = current.x + Math.cos(angle + Math.PI) * length;
      const y = current.y + Math.sin(angle + Math.PI) * length;
      return [x, y];
    };

    // 3. Membuat path data untuk garis kurva (SVG <path>)
    const line = points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const [cpsX, cpsY] = controlPoint(arr[i - 1], arr[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, arr[i - 1], arr[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    }, "");

    // 4. Membuat path data untuk area di bawah garis
    const area = `${line} L ${points[points.length - 1].x},${
      height - padding
    } L ${padding},${height - padding} Z`;

    return { points, areaPath: area, linePath: line, maxValue };
  }, [data, width, height]);

  return (
    <Card title={title} description={description}>
      {/* Container dibuat relative untuk positioning tooltip */}
      <div className="relative flex flex-col items-center mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            {/* Definisi gradien untuk area chart */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D60FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2D60FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid horizontal */}
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

          {/* Garis Area dengan Gradien */}
          <path d={areaPath} fill="url(#areaGradient)" stroke="none" />

          {/* Garis Kurva Utama */}
          <path
            d={linePath}
            fill="none"
            stroke="#2D60FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Titik-titik data */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Lingkaran luar untuk efek 'glow' saat hover */}
              <circle
                cx={p.x}
                cy={p.y}
                r={10}
                fill="#2D60FF"
                fillOpacity={hovered?.label === p.label ? 0.2 : 0}
              />
              {/* Lingkaran utama */}
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

          {/* Label Sumbu X */}
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

        {/* Tooltip Interaktif */}
        {hovered && (
          <div
            className="absolute p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none transition-all duration-200"
            style={{
              // Posisi tooltip di atas titik, dengan transisi
              left: hovered.x,
              top: hovered.y - 15,
              transform: "translate(-50%, -100%)",
              opacity: 1,
            }}
          >
            {hovered.label}: <span className="font-bold">{hovered.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
// Pie Chart (SVG)
const PieChart = ({ data, title, description }) => {
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

  // Legend
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
        <svg width={size} height={size}>
          {slices}
        </svg>
        <div className="mt-4 space-y-1">{legend}</div>
      </div>
    </Card>
  );
};

const activities = [
  {
    type: "Pendaftaran Baru",
    desc: "Mahasiswa A mendaftar Beasiswa Unggulan",
    time: "2 menit lalu",
  },
  {
    type: "Beasiswa Baru",
    desc: "Beasiswa Bank Indonesia telah dibuka",
    time: "10 menit lalu",
  },
  {
    type: "Pendaftaran Baru",
    desc: "Mahasiswa B mendaftar Beasiswa KIP Kuliah",
    time: "30 menit lalu",
  },
  {
    type: "Verifikasi",
    desc: "Pendaftaran Mahasiswa C telah diverifikasi",
    time: "1 jam lalu",
  },
];

// Dummy status pendaftaran
const statusCounts = [
  { label: "Menunggu Verifikasi", value: 87, color: "#FFBB38" },
  { label: "Menunggu Validasi", value: 34, color: "#FF3838" },
  { label: "Terverifikasi", value: 112, color: "#2D60FF" },
  { label: "Tervalidasi", value: 98, color: "#4CAF50" },
];

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
  summaryData,
  fakultasData,
  departemenData,
  tahunData,
  genderData,
  StatusSummary,
  ActivityCard,
};
