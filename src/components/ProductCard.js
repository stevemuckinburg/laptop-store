// src/components/ProductCard.js
import React from 'react';
import Slider from './Slider';
import './ProductCard.css'; // still needed for card, hover, etc.

const ProductCard = ({ product }) => {
  // Normalize `product.image` into an array
  const images = Array.isArray(product.image)
    ? product.image
    : [product.image];

  return (
    <div className="product-card">
      {/* Use Slider for images */}
      <div className="product-img-container">
        <Slider images={images} altText={product.title} />
      </div>

      <span className="category-tag">{product.category}</span>

      <h3>{product.title}</h3>
      <p className="description">{product.description}</p>
      <p><strong>Specs:</strong> {product.specification}</p>
      <p className="price">${product.price}</p>
      <p className="note">{product.note}</p>
    </div>
  );
};

export default ProductCard;
