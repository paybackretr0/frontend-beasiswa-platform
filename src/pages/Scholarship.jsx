import React, { useEffect } from "react";
import GuestLayout from "../layouts/GuestLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const scholarships = [
  {
    id: 1,
    name: "Beasiswa Unggulan UNAND",
    organizer: "Universitas Andalas",
    year: 2025,
    quota: 100,
    description:
      "Beasiswa prestasi untuk mahasiswa aktif dengan nilai akademik tinggi dan kontribusi organisasi.",
    cover:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Beasiswa KIP Kuliah",
    organizer: "Kementerian Pendidikan",
    year: 2025,
    quota: 200,
    description:
      "Beasiswa untuk mahasiswa kurang mampu secara ekonomi dan berprestasi.",
    cover:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Beasiswa Bank Indonesia",
    organizer: "Bank Indonesia",
    year: 2025,
    quota: 50,
    description:
      "Beasiswa untuk mahasiswa berprestasi dari berbagai jurusan di UNAND.",
    cover:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
  },
];

const Scholarship = () => {
  useEffect(() => {
    document.title = "Daftar Beasiswa - UNAND";
  }, []);

  return (
    <GuestLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Daftar Beasiswa
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {scholarships.map((sch) => (
            <Card
              key={sch.id}
              image={sch.cover}
              title={sch.name}
              subtitle={`${sch.organizer} • ${sch.year}`}
              description={sch.description}
            >
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Kuota: {sch.quota}
                </span>
                <Button
                  className="px-4 py-2 text-sm"
                  onClick={() => alert(`Detail beasiswa: ${sch.name}`)}
                >
                  Detail
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button>Lihat Lebih Banyak</Button>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Scholarship;
