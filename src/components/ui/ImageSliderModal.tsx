"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

export default function ImageSliderModal({ images, isOpen, onClose, initialIndex = 0 }: { images: string[], isOpen: boolean, onClose: () => void, initialIndex?: number }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset current index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800 transition-colors z-50"
        aria-label="Close modal"
      >
        <FaTimes size={24} />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image container */}
      <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto">
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        aria-label="Previous image"
      >
        <FaArrowLeft size={20} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        aria-label="Next image"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
}