import { useRef, useEffect } from 'react';

export default function SearchInput({ query, setQuery }) { 
  
  const inputRef = useRef(null);


  useEffect(() => {
    function callBack(e) {
      if (document.activeElement === inputRef.current) return;
      if (e.code === 'Enter') {
        inputRef.current.focus();
        setQuery('');
      }
    }

    document.addEventListener('keydown', callBack);

    return () => document.addEventListener('keydown', callBack);

    // clean up  the effect
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      ref={inputRef}
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
