// في CountryDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiSearch, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface Country {
  id: number;
  name: string;
  code: string;
  image: string;
  phone_code: string;
}

interface CountryDropdownProps {
  countries: Country[];
  selectedValue: string;
  onSelect: (value: string) => void;
  type: 'country' | 'phone';
  error?: string;
  placeholder?: string; // ⬅️ ضيف placeholder
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  countries,
  selectedValue,
  onSelect,
  type,
  error,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const selectedCountry = type === 'country' 
    ? countries.find(country => country.id.toString() === selectedValue)
    : countries.find(country => country.phone_code === selectedValue);

  const filteredCountries = countries.filter(country =>
    country.name?.toLowerCase().includes(search.toLowerCase()) ||
    country.code?.toLowerCase().includes(search.toLowerCase()) ||
    (type === 'phone' && country.phone_code?.includes(search))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    const value = type === 'country' ? country.id.toString() : country.phone_code;
    onSelect(value);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-xl border-2 text-right flex items-center justify-between transition-all duration-300 ${
          error ? 'border-red-500 bg-red-50' : 'border-blue-400 hover:border-blue-500 bg-white'
        }`}
      >
        {selectedCountry ? (
          <div className="flex items-center gap-3">
            {selectedCountry.image && (
              <img 
                src={selectedCountry.image} 
                alt="flag" 
                className="w-6 h-4 object-cover rounded" 
              />
            )}
            <span className="font-medium text-gray-800">
              {type === 'country' ? selectedCountry.name : `+${selectedCountry.phone_code}`}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">
            {placeholder || (type === 'country' ? `${t('register.form.chooscontry')}` : 'اختر الرمز')}
          </span>
        )}
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-400 rounded-xl shadow-2xl shadow-blue-500/20 z-50 max-h-80 overflow-hidden animate-fade-in-up">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={type === 'country' ? 'ابحث عن دولة...' : 'ابحث عن رمز...'}
                className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-60">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full p-3 text-right border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {country.image && (
                      <img 
                        src={country.image} 
                        alt={country.name} 
                        className="w-6 h-4 object-cover rounded" 
                      />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-800">
                        {type === 'country' ? country.name : `+${country.phone_code}`}
                      </div>
                      {type === 'country' && (
                        <div className="text-sm text-gray-500">+{country.phone_code}</div>
                      )}
                    </div>
                  </div>
                  {(type === 'country' 
                    ? selectedValue === country.id.toString()
                    : selectedValue === country.phone_code
                  ) && <FiCheck className="text-green-500" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">لا توجد نتائج</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;