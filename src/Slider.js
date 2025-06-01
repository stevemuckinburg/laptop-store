// src/Slider.js
import React, { useState } from "react";

/**
 * A simple slider that:
 *  - Shows one image at a time (full width of container)
 *  - “‹” and “›” buttons to cycle through images
 *  - Displays “1 / N” overlay in the top‐right
 *  - On click, opens a fullscreen modal with blurred background
 */
export default function Slider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const total = images.length;
  const currentUrl = images[currentIndex];

  // Move to previous image (wrap around)
  const goPrev = () => {
    setCurrentIndex((idx) => (idx === 0 ? total - 1 : idx - 1));
  };

  // Move to next image (wrap around)
  const goNext = () => {
    setCurrentIndex((idx) => (idx === total - 1 ? 0 : idx + 1));
  };

  // Toggle fullscreen zoom
  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <>
      {/* Slider container */}
      <div
        className="slider-container"
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundColor: "#000",
          overflow: "hidden",
          cursor: "pointer"
        }}
        onClick={toggleZoom}
      >
        {/* Current image */}
        <img
          src={currentUrl}
          alt={`Slide ${currentIndex + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            style={{
              position: "absolute",
              left: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "2rem",
              height: "2rem",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: "1rem"
            }}
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            style={{
              position: "absolute",
              right: "0.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "2rem",
              height: "2rem",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: "1rem"
            }}
          >
            ›
          </button>
        )}

        {/* “1 / N” overlay */}
        <div
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.3)",
            color: "#fff",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.9rem"
          }}
        >
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Zoom modal */}
      {isZoomed && (
        <div
          onClick={toggleZoom}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out"
          }}
        >
          <img
            src={currentUrl}
            alt={`Zoomed Slide ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
              cursor: "auto"
            }}
          />
        </div>
      )}
    </>
  );
}
