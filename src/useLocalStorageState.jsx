import { useEffect, useState } from 'react';

export default function useLocalStorageState(initialState , key) {
  const [value, setValue] = useState(function () {
    const ItemFromStorage = localStorage.getItem('watched');
    return ItemFromStorage ? JSON.parse(ItemFromStorage) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value , key]);


  return [value, setValue];
}
