import React, { useState, useEffect, useRef } from 'react';
import './SearchbarAdmin.css';
// 1. Importamos el ícono de búsqueda
import { FiSearch } from 'react-icons/fi';

const SearchbarAdmin = ({ items, onSelect, placeholder, displayKey }) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const searchbarRef = useRef(null);

  useEffect(() => {
    if (!items) return;

    const lowercasedQuery = query.toLowerCase();
    const result = items.filter(item =>
      item && item[displayKey] && String(item[displayKey]).toLowerCase().includes(lowercasedQuery)
    );
    setFilteredItems(result);
  }, [query, items, displayKey]);

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
    setQuery(String(item[displayKey]));
    onSelect(item);
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    setDropdownVisible(true);
    setFilteredItems(items || []);
  }

  return (
    <div className="searchbar-admin-container" ref={searchbarRef}>
      <div className="searchbar-wrapper">
        {/* 2. Reemplazamos el span con el emoji por el componente del ícono */}
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="searchbar-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />
      </div>
      {isDropdownVisible && (
        <ul className="search-dropdown">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li key={item[displayKey]} onClick={() => handleSelect(item)}>
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