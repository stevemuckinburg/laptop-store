import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch data from public folder
  useEffect(() => {
    fetch('/data/store.json')
      .then(response => response.json())
      .then(data => setProducts(data.products || []));
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filteredData = products.filter(p => {
      const matchCategory = category === 'All' || p.category === category;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Updated sorting for numeric prices
    if (sortOption === 'price-asc') {
      filteredData.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filteredData.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'name-desc') {
      filteredData.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFiltered(filteredData);
    setCurrentPage(1);
  }, [category, search, products, sortOption]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginate = (direction) => {
    setCurrentPage(prev =>
      direction === 'next'
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

  return (
    <div className="product-list">
      <div className="controls">
        <input
          type="text"
          placeholder="Search laptops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      <div className="products">
        {currentItems.length === 0 ? (
          <p>No matching products.</p>
        ) : (
          currentItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => paginate('prev')} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => paginate('next')} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;