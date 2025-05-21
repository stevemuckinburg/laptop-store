import React, { useEffect, useState } from 'react';

const Header = () => {
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    fetch('/data/store.json')
      .then(res => res.json())
      .then(data => setStoreName(data.storeName));
  }, []);

  return (
    <header className="header">
      <h1>{storeName}</h1>
    </header>
  );
};

export default Header;
