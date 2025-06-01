// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  // State
  const [storeName, setStoreName] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Fetch store data (name + products)
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/store.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setStoreName(data.storeName || '');
        const prods = data.products || [];
        setProducts(prods);
        setFiltered(prods);
      })
      .catch(error => {
        console.error('Error loading store data:', error);
      });
  }, []);

  // Filter whenever category, search, or products change
  useEffect(() => {
    const data = products.filter(p => {
      const matchCategory = category === 'All' || p.category === category;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFiltered(data);
  }, [category, search, products]);

  // Categories dropdown
  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className="product-list">
      {/* Store Title */}
      <h1 className="store-title">{storeName}</h1>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search laptops..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="products">
        {filtered.length === 0 ? (
          <p>No matching products.</p>
        ) : (
          filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
