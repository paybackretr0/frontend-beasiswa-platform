import React, { useEffect, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { getLatestInformation } from "../services/websiteService";
import EmptyInformation from "../assets/empty-state-news.svg";

const SectionNews = () => {
  const navigate = useNavigate();
  const [informationList, setInformationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const informations = await getLatestInformation();
        console.log("Fetched informations:", informations);
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
            Seputar Beasiswa
          </h2>
          <p className="text-center text-gray-500">Memuat berita...</p>
        </div>
      </section>
    );
  }

  if (informationList.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-700">Seputar Beasiswa</h2>
          <div className="flex flex-col items-center">
            <img src={EmptyInformation} alt="No News" className="w-50 h-50" />
            <p className="text-gray-500 text-lg mb-4">
              Belum ada informasi terbaru untuk saat ini.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          Seputar Beasiswa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {informationList.map((information, idx) => (
            <Card
              key={idx}
              image={information.cover_url}
              title={information.title}
              subtitle={new Date(information.published_at).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
              description={information.content.slice(0, 100) + "..."}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/informations/${information.slug}`)}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button variant="primary" onClick={() => navigate("/informations")}>
          Lihat Berita Lainnya
        </Button>
      </div>
    </section>
  );
};

export default SectionNews;
