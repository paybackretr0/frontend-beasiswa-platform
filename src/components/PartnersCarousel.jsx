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

        const logoPaths = Object.entries(logoModules).map(
          ([path, importFn]) => ({
            path,
            importFn,
            order: parseInt(path.match(/logo(\d+)/)?.[1] || "999"),
          }),
        );

        const sortedPaths = logoPaths.sort((a, b) => a.order - b.order);

        setLogos(sortedPaths.map(() => null));
        setLoading(false);

        sortedPaths.forEach(async (item, index) => {
          const module = await item.importFn();
          setLogos((prev) => {
            const updated = [...prev];
            updated[index] = module.default;
            return updated;
          });
        });
      } catch (error) {
        console.error("Error loading partner logos:", error);
        setLogos([]);
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
    lazyLoad: "progressive",
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
            
            .partner-logo {
              opacity: 0;
              transition: opacity 0.3s ease-in;
            }
            .partner-logo.loaded {
              opacity: 1;
            }
          `}
        </style>
        <Slider {...settings} className="partners-carousel">
          {logos.map((logo, idx) => (
            <div key={idx}>
              <div className="flex justify-center items-center h-20">
                {logo ? (
                  <img
                    src={logo}
                    alt={`Partner ${idx + 1}`}
                    className="partner-logo loaded h-16 w-auto max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add("loaded")}
                  />
                ) : (
                  <div className="h-16 w-32 bg-gray-200 rounded animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnersCarousel;
