import React, { useState, useEffect, useRef } from 'react';
import './SearchbarAdmin.css';

const SearchbarAdmin = ({ items, onSelect, placeholder, displayKey }) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const searchbarRef = useRef(null);

  useEffect(() => {
    const lowercasedQuery = query.toLowerCase();
    const result = items.filter(item =>
      String(item[displayKey]).toLowerCase().includes(lowercasedQuery)
    );
    setFilteredItems(result);
  }, [query, items, displayKey]);

  // Manejar clics fuera del componente para cerrar el desplegable
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchbarRef.current && !searchbarRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchbarRef]);


  const handleSelect = (item) => {
    setQuery(item[displayKey]);
    onSelect(item);
    setDropdownVisible(false);
  };

  return (
    <div className="searchbar-admin-container" ref={searchbarRef}>
      <div className="searchbar-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="searchbar-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setDropdownVisible(true)}
        />
      </div>
      {isDropdownVisible && (
        <ul className="search-dropdown">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li key={index} onClick={() => handleSelect(item)}>
                {item[displayKey]}
              </li>
            ))
          ) : (
            <li className="no-results">No se encontraron resultados</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchbarAdmin;