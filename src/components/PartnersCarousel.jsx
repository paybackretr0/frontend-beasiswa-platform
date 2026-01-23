import { useState, useEffect } from "react";
import Slider from "react-slick";

const PartnersCarousel = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const logoModules = import.meta.glob(
          "../assets/partners/*.{png,jpg,jpeg,svg,webp,avif}",
        );

        const logoPromises = Object.entries(logoModules).map(
          async ([path, importFn]) => {
            const module = await importFn();
            return {
              url: module.default,
              order: parseInt(path.match(/logo(\d+)/)?.[1] || "999"),
            };
          },
        );

        const loadedLogos = await Promise.all(logoPromises);
        const sortedLogos = loadedLogos
          .sort((a, b) => a.order - b.order)
          .map((item) => item.url);

        setLogos([...sortedLogos, ...sortedLogos]);
      } catch (error) {
        console.error("Error loading partner logos:", error);
        setLogos([]);
      } finally {
        setLoading(false);
      }
    };

    loadLogos();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-center text-3xl font-semibold text-gray-700 mb-8">
            Mitra Beasiswa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (logos.length === 0) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Mitra Beasiswa
          </h2>
          <p className="text-gray-500">Belum ada mitra beasiswa.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-center text-3xl font-semibold text-gray-700 mb-8">
          Mitra Beasiswa
        </h2>
        <style>
          {`
            .partners-carousel .slick-slide {
              display: flex !important;
              justify-content: center;
              align-items: center;
            }
            .partners-carousel .slick-slide > div {
              width: 100%;
            }
          `}
        </style>
        <Slider {...settings} className="partners-carousel">
          {logos.map((logo, idx) => (
            <div key={idx}>
              <div className="flex justify-center items-center h-20">
                <img
                  src={logo}
                  alt={`Partner ${idx + 1}`}
                  className="h-16 w-auto max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnersCarousel;
