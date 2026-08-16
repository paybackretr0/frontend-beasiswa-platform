import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { getLatestInformation } from "../services/websiteService";
import EmptyInformation from "../assets/empty-state-news.svg";
import { SkeletonNewsCard } from "./common/skeleton";

const SectionNews = () => {
  const navigate = useNavigate();
  const [informationList, setInformationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const informations = await getLatestInformation();
        setInformationList(informations);
      } catch (error) {
        console.error("Error fetching latest information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformations();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Seputar Beasiswa
          </h2>
          <SkeletonNewsCard items={3} />
        </div>
      </section>
    );
  }

  if (informationList.length === 0) {
    return (
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Seputar Beasiswa
          </h2>
          <div className="flex flex-col items-center">
            <img src={EmptyInformation} alt="No News" className="w-50 h-50" />
            <p className="text-slate-500 text-lg mb-4">
              Belum ada informasi terbaru untuk saat ini.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Seputar Beasiswa
            </h2>
            <p className="text-slate-600">
              Informasi dan pengumuman terbaru seputar beasiswa di Universitas
              Andalas.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/informations")}>
            Lihat Semua Berita
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {informationList.map((information, idx) => (
            <article
              key={idx}
              onClick={() => navigate(`/informations/${information.slug}`)}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 transition-colors cursor-pointer"
            >
              {information.cover_url && (
                <img
                  src={information.cover_url}
                  alt={information.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-slate-400 mb-2">
                  {new Date(information.published_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 leading-snug">
                  {information.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {information.content.slice(0, 120)}
                  {information.content.length > 120 ? "…" : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionNews;
