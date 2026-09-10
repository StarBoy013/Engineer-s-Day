import React, { useEffect, useState } from "react";
import { CrowdCanvas } from "./CrowdCanvas";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  
  const [parallaxY, setParallaxY] = useState(0);

  // Calculate next September 15th dynamically to keep the countdown active
  const getTargetTime = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(`September 15, ${currentYear} 09:00:00`);
    if (target.getTime() < now.getTime()) {
      target = new Date(`September 15, ${currentYear + 1} 09:00:00`);
    }
    return target.getTime();
  };

  useEffect(() => {
    const targetDate = getTargetTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();

    const handleScroll = () => {
      const scrolled = window.scrollY;
      setParallaxY(scrolled * 0.1);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("register");
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center text-center pt-32 px-margin-edge overflow-hidden"
      id="hero"
    >
      <div className="max-w-max-width w-full text-center mb-12 z-10 flex flex-col items-center mx-auto">
        <div className="w-full mb-4">
          <h1
            className="font-display-lg text-4xl sm:text-6xl md:text-[84px] text-primary uppercase tracking-tighter transition-all duration-700 ease-out select-none"
            style={{ opacity: 1 }}
          >
            National Engineers' Day
          </h1>
        </div>
        
        <p className="font-body-lg text-lg sm:text-xl md:text-body-lg text-on-surface-variant mb-3">
          Celebrating the minds that build the future.
        </p>

        <p className="font-label-caps text-sm sm:text-base tracking-widest text-secondary font-bold uppercase mb-10 select-none">
          School of Engineering &amp; Technology
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-12">
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <span className="font-display-lg text-3xl sm:text-4xl md:text-headline-lg lg:text-display-lg text-primary leading-none">
              {timeLeft.days}
            </span>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant mt-2 font-bold">
              DAYS
            </span>
          </div>
          <div className="h-12 sm:h-16 w-px bg-outline/30 self-center"></div>
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <span className="font-display-lg text-3xl sm:text-4xl md:text-headline-lg lg:text-display-lg text-primary leading-none">
              {timeLeft.hours}
            </span>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant mt-2 font-bold">
              HRS
            </span>
          </div>
          <div className="h-12 sm:h-16 w-px bg-outline/30 self-center"></div>
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <span className="font-display-lg text-3xl sm:text-4xl md:text-headline-lg lg:text-display-lg text-primary leading-none">
              {timeLeft.minutes}
            </span>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant mt-2 font-bold">
              MINS
            </span>
          </div>
          <div className="h-12 sm:h-16 w-px bg-outline/30 self-center"></div>
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <span className="font-display-lg text-3xl sm:text-4xl md:text-headline-lg lg:text-display-lg text-primary leading-none">
              {timeLeft.seconds}
            </span>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant mt-2 font-bold">
              SECS
            </span>
          </div>
        </div>

        <a
          href="#register"
          onClick={handleRegisterClick}
          className="inline-block border-2 border-primary text-primary px-8 sm:px-10 py-3 sm:py-4 font-label-caps text-label-caps tracking-widest hover:bg-secondary hover:text-on-secondary hover:border-secondary transition-all transform hover:scale-105 active:scale-95 mb-12 sm:mb-16 bg-transparent font-bold"
        >
          REGISTER NOW
        </a>
      </div>

      {/* Spacer to preserve flex layout height */}
      <div className="h-[50vh] md:h-[400px] w-full pointer-events-none mt-auto"></div>

      {/* Crowd Animation Canvas (Edge-to-edge absolute container) */}
      <div
        className="absolute bottom-0 left-0 w-full transition-transform duration-700 ease-out select-none h-[50vh] md:h-[500px]"
        style={{
          transform: `translateY(${parallaxY}px)`,
        }}
      >
        <CrowdCanvas />
      </div>
    </section>
  );
};
