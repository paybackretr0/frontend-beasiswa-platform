import Slider from "react-slick";
import Logo1 from "../assets/partners/logo1.png";
import Logo2 from "../assets/partners/logo2.png";
import Logo3 from "../assets/partners/logo3.png";
import Logo4 from "../assets/partners/logo4.png";

const PartnersCarousel = () => {
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
  };

  const logos = [Logo1, Logo2, Logo3, Logo4, Logo1, Logo2, Logo3, Logo4];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-center text-3xl font-semibold text-gray-700 mb-8">
          Mitra Beasiswa
        </h2>
        <Slider {...settings}>
          {logos.map((logo, idx) => (
            <div key={idx} className="flex justify-center items-center px-6">
              <img
                src={logo}
                alt={`Partner ${idx + 1}`}
                className="h-16 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnersCarousel;
