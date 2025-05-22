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
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

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

  // Filter, sort, and reset pagination when dependencies change
  useEffect(() => {
    let data = products.filter(p => {
      const matchCategory = category === 'All' || p.category === category;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortOption === 'price-asc') {
      data.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      data.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'name-desc') {
      data.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [category, search, products, sortOption]);

  // Categories dropdown
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginate = direction => {
    setCurrentPage(prev =>
      direction === 'next'
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

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

        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="products">
        {currentItems.length === 0 ? (
          <p>No matching products.</p>
        ) : (
          currentItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => paginate('prev')} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => paginate('next')} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
