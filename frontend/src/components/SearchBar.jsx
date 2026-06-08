import { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) {
        onChange(local);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [local, onChange, value]);

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  return (
    <div className="relative">
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
      />
    </div>
  );
}
