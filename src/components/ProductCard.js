import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-img" />
      <h3>{product.title}</h3>
      <p className="description">{product.description}</p>
      <p><strong>Specs:</strong> {product.specification}</p>
      <p className="price">{product.price}</p>
      <p className="note">{product.note}</p>
    </div>
  );
};

export default ProductCard;
