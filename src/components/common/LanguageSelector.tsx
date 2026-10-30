import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../i18n/types';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage, languages, currentMeta } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(0);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return languages;
    const q = searchQuery.toLowerCase().trim();
    return languages.filter(
      (lang) =>
        lang.label.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(0);
  };

  // Keyboard Navigation: ArrowUp, ArrowDown, Enter, Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < filteredLanguages.length - 1 ? prev + 1 : 0;
        scrollIndexIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredLanguages.length - 1;
        scrollIndexIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLanguages[highlightedIndex]) {
        handleSelect(filteredLanguages[highlightedIndex].code);
      }
    }
  };

  const scrollIndexIntoView = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.children;
      if (items[index]) {
        (items[index] as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  };

  return (
    <div className="relative inline-block text-left font-sans" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-orange/40 ${
          compact
            ? 'px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-white/10'
            : 'px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Select Language / भाषा चुनें (All 22 Indian Scheduled Languages)"
      >
        <Globe className={`w-3.5 h-3.5 shrink-0 ${compact ? 'text-brand-orange' : 'text-slate-500'}`} />
        <span className="font-semibold">{currentMeta.nativeName}</span>
        <span className="text-[10px] opacity-75 font-normal hidden sm:inline">({currentMeta.label})</span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 bg-slate-50 rounded-t-xl border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Choose Language / भाषा चुनें
              </span>
              <span className="text-[10px] font-semibold text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60">
                22 Indian + English
              </span>
            </div>

            {/* Quick Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search language, script, region..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHighlightedIndex(0);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-50" ref={listRef} role="listbox">
            {filteredLanguages.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                No matching languages found
              </div>
            ) : (
              filteredLanguages.map((lang, index) => {
                const isSelected = lang.code === language;
                const isHighlighted = index === highlightedIndex;
                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                      isHighlighted
                        ? 'bg-slate-100 text-brand-navy'
                        : isSelected
                        ? 'bg-orange-50 text-brand-orange font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-navy'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{lang.nativeName}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({lang.label})</span>
                        {lang.isRTL && (
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-200 text-slate-600 rounded">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {lang.script} &bull; {lang.region}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-orange shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
          <div className="p-2 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-between px-3 rounded-b-xl">
            <span>Use ↑ ↓ to navigate, Enter to select</span>
            <span>Eighth Schedule</span>
          </div>
        </div>
      )}
    </div>
  );
};
