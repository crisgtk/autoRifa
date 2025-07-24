import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style2 text-center position-relative">
        <HeroContent />
        <h2 className="hero-title" data-aos="fade-up" data-aos-delay="150">
          ¡Podrias ser el próximo ganador!
        </h2>
        <p className="hero-text fz15" data-aos="fade-up" data-aos-delay="250">
          NO TE QUEDES SIN LA OPORTUNIDAD DE GANAR ESTE AUTO
        </p>
      </div>
      {/* End Hero content */}

      {/* <!-- Advance Feature Modal Start --> */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>
      {/* <!-- Advance Feature Modal End --> */}
    </>
  );
};

export default Hero;
