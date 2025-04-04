import React from 'react';
import { useSearch } from '../context/SearchContext';

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <input
  type="text"
  placeholder="Search for channel/posts/users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="navbar-search"
/>

  );
};

export default SearchBar;
