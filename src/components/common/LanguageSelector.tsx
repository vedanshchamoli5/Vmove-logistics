import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../i18n/types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, languages, currentMeta } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-md transition-colors focus:outline-none ${
          compact
            ? 'px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-white/10'
            : 'px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Choose Language (भारतीय भाषाएं)"
      >
        <Globe className={`w-3.5 h-3.5 ${compact ? 'text-brand-orange' : 'text-slate-500'}`} />
        <span className="font-medium">{currentMeta.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 bg-slate-50 rounded-t-xl border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Choose Language / भाषा चुनें
            </span>
            <span className="text-[11px] text-slate-400">Available across all Indian transport corridors</span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? 'bg-orange-50 text-brand-orange font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400">
                      {lang.label} &bull; {lang.region}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-orange shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
