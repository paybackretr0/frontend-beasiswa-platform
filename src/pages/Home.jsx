import { useEffect } from "react";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Illustration from "../assets/illustration.png";
import PartnersCarousel from "../components/PartnersCarousel";
import SectionWhy from "../components/SectionWhy";
import SectionNews from "../components/SectionNews";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Beranda - Beasiswa";
  }, []);

  return (
    <GuestLayout>
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between min-h-[70vh] gap-8 px-6 md:px-12 py-12">
        <div className="flex-1 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="text-neutral-800 block mb-2">
              Sistem Informasi Beasiswa
            </span>
            <span className="text-[#2D60FF] block mb-6">
              Universitas Andalas
            </span>
          </h1>
          <Button onClick={() => navigate("/scholarship")}>
            Lihat Beasiswa
          </Button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={Illustration}
            alt="Programmer Illustration"
            className="max-w-[400px] w-full h-auto"
          />
        </div>
      </section>
      <PartnersCarousel />
      <SectionWhy />
      <SectionNews />
    </GuestLayout>
  );
};

export default Home;
