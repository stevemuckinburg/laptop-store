import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Slider.css';

const Slider = ({ images, altText }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Refs for swipe detection
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const prevSlide = (e) => {
    e && e.stopPropagation();
    setCurrentIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e && e.stopPropagation();
    setCurrentIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx) => {
    setCurrentIdx(idx);
  };

  /* Removed the auto-advance slides useEffect block */

  // Touch handlers (shared between normal slider and modal)
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const dx = touchStartX.current - touchEndX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showModal]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const imgSrc = `${process.env.PUBLIC_URL}${images[currentIdx]}`;

  // Modal JSX rendered via a Portal
  const modal = showModal ? ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={closeModal}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={closeModal}
          aria-label="Close"
        >
          ×
        </button>

        {/* Zoomed/Fullscreen Image */}
        <img
          src={imgSrc}
          alt={altText}
          className="modal-image"
        />

        {/* Thumbnails */}
        <div className="thumbnails">
          {images.map((img, idx) => {
            const thumbSrc = `${process.env.PUBLIC_URL}${img}`;
            return (
              <img
                key={idx}
                src={thumbSrc}
                alt={`${altText} ${idx + 1}`}
                className={`thumb ${idx === currentIdx ? 'active' : ''}`}
                onClick={() => setCurrentIdx(idx)}
              />
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* ── Normal Slider ── */}
      <div
        className="slider-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="slider-image-wrapper" onClick={openModal}>
          <img
            src={imgSrc}
            alt={altText}
            className="product-img"
          />
          <div className="image-overlay"></div>
        </div>

        {images.length > 1 && (
          <>
            <button
              className="arrow left-arrow"
              onClick={prevSlide}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="arrow right-arrow"
              onClick={nextSlide}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentIdx ? 'active' : ''}`}
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  aria-current={idx === currentIdx ? 'true' : 'false'}
                />
              ))}
            </div>

            <div className="image-counter">
              {currentIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Render the modal portal if needed */}
      {modal}
    </>
  );
};

export default Slider;
