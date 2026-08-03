import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style2 text-center position-relative">
        <h1 className="hero-title fw-bold text-white mb-2" data-aos="fade-up" data-aos-delay="150">
          ¡Podrías ser el próximo ganador!
        </h1>
        <p className="hero-text text-white-50 fz16 fz14-sm maxw700 mx-auto mb-0" data-aos="fade-up" data-aos-delay="250">
          NO TE QUEDES SIN LA OPORTUNIDAD DE AYUDAR Y GANAR ESTE AUTO
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
