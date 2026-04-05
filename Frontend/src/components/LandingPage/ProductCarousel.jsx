import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductCarousel = ({ autoSlide = true, slides = [] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [current, autoSlide]);

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  if (!slides || slides.length === 0)
    return (
      <div className="bg-slate-200 dark:bg-slate-800 w-full h-full transition-colors"></div>
    );

  return (
    <div className="relative overflow-hidden group w-full h-full rounded-xl">
      <div
        className="flex transition-transform ease-out duration-700 h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative bg-slate-50 dark:bg-[#0A0F1E] transition-colors"
          >
            <img
              src={slide.src}
              alt={slide.label}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-md hover:bg-white dark:hover:bg-[#1E293B] text-slate-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-black/5 dark:border-white/10"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-md hover:bg-white dark:hover:bg-[#1E293B] text-slate-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-black/5 dark:border-white/10"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 h-2 rounded-full cursor-pointer shadow-sm ${
              current === i
                ? "w-8 bg-blue-600 dark:bg-cyan-400"
                : "w-2 bg-slate-300 dark:bg-slate-600/50 hover:bg-white dark:hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
