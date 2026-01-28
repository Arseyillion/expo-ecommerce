"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useState, useEffect } from "react";
import "swiper/css/navigation";
import "swiper/css";
import Image from "next/image";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider();
  const data = useAppSelector((state) => state.productDetailsReducer.value);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get images from data
  const images = data?.imgs?.previews || (data as any)?.images || [];

  const handlePrev = useCallback(() => {
    console.log('Prev button clicked');
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      console.log('Changed to image:', currentImageIndex - 1);
    }
  }, [currentImageIndex]);

  const handleNext = useCallback(() => {
    console.log('Next button clicked');
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      console.log('Changed to image:', currentImageIndex + 1);
    }
  }, [currentImageIndex, images.length]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalPreviewOpen) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalPreviewOpen, handlePrev, handleNext]);

  // Reset current image when modal opens
  useEffect(() => {
    if (isModalPreviewOpen) {
      setCurrentImageIndex(0);
      setImagesLoaded(true);
    }
  }, [isModalPreviewOpen]);

  // Debug logging
  console.log('PreviewSlider Debug:', {
    isModalPreviewOpen,
    imagesCount: images.length,
    currentImageIndex,
    images,
    currentImage: images[currentImageIndex]
  });

  return (
    <div
      className={`preview-slider w-full h-screen  z-999999 inset-0 flex justify-center items-center bg-[#000000F2] bg-opacity-70 ${isModalPreviewOpen ? "fixed" : "hidden"
        }`}
    >
      <button
        onClick={() => closePreviewModal()}
        aria-label="button for close modal"
        className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 text-white hover:text-meta-5 z-10"
      >
        <svg
          className="fill-current"
          width="36"
          height="36"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
            fill=""
          />
        </svg>
      </button>

      <div>
        <button
          className="absolute left-4 sm:left-8 p-5 cursor-pointer z-10 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          onClick={handlePrev}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.4082 20.0745C11.0909 20.3918 10.5764 20.3918 10.2591 20.0745L3.75912 13.5745C3.44181 13.2572 3.44181 12.7428 3.75912 12.4255L10.2591 5.92548C10.5764 5.60817 11.0909 5.60817 11.4082 5.92548C11.7255 6.24278 11.7255 6.75722 11.4082 7.07452L6.29522 12.1875H21.667C22.1157 12.1875 22.4795 12.5513 22.4795 13C22.4795 13.4487 22.1157 13.8125 21.667 13.8125H6.29522L11.4082 18.9255C11.7255 19.2428 11.7255 19.7572 11.4082 20.0745Z"
              fill="#FDFDFD"
            />
          </svg>
        </button>

        <button
          className="absolute right-4 sm:right-8 p-5 cursor-pointer z-10 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          onClick={handleNext}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.5918 5.92548C14.9091 5.60817 15.4236 5.60817 15.7409 5.92548L22.2409 12.4255C22.5582 12.7428 22.5582 13.2572 22.2409 13.5745L15.7409 20.0745C15.4236 20.3918 14.9091 20.3918 14.5918 20.0745C14.2745 19.7572 14.2745 19.2428 14.5918 18.9255L19.7048 13.8125H4.33301C3.88428 13.8125 3.52051 13.4487 3.52051 13C3.52051 12.5513 3.88428 12.1875 4.33301 12.1875H19.7048L14.5918 7.07452C14.2745 6.75722 14.2745 6.24278 14.5918 5.92548Z"
              fill="#FDFDFD"
            />
          </svg>
        </button>
      </div>

      <div className="relative">
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-[450px]">
            <div className="text-white text-center">
              <p>No images available</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Add slide counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Current Image Display */}
            <div className="flex justify-center items-center">
              <div className="relative">
                {/* Add slide number indicator */}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                  Image {currentImageIndex + 1}
                </div>
                <Image
                  src={images[currentImageIndex]}
                  alt={`product image ${currentImageIndex + 1}`}
                  width={450}
                  height={450}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    console.log('Image failed to load:', images[currentImageIndex]);
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/products/product-1-bg-1.png";
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', images[currentImageIndex]);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSliderModal;
