import React, { useState, useMemo } from 'react';
import { User, Search, ChevronDown, Check, Sparkles } from 'lucide-react';

interface AssistantSelectorProps {
  assistants: string[];
  selectedAssistant: string;
  onSelectAssistant: (name: string) => void;
}

export const AssistantSelector: React.FC<AssistantSelectorProps> = ({
  assistants,
  selectedAssistant,
  onSelectAssistant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredAssistants = useMemo(() => {
    if (!search.trim()) return assistants;
    const q = search.toLowerCase().trim();
    return assistants.filter((name) => name.toLowerCase().includes(q));
  }, [assistants, search]);

  const popularQuickList = useMemo(() => {
    // Top 5 or first 5 for quick pill clicking
    return assistants.slice(0, 7);
  }, [assistants]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Pilih Nama Asisten
            </span>
            <span className="text-sm font-bold text-slate-900">
              {selectedAssistant || 'Belum dipilih'}
            </span>
          </div>
        </div>

        {/* Dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-64 flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <span className="truncate">
              {selectedAssistant ? `Asisten: ${selectedAssistant}` : 'Pilih dari daftar...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-full sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
              {/* Search input inside dropdown */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama asisten..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              {/* List */}
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {filteredAssistants.length === 0 ? (
                  <p className="p-3 text-center text-xs text-slate-400">Tidak ada nama cocok.</p>
                ) : (
                  filteredAssistants.map((name) => {
                    const isSelected = name.toLowerCase() === selectedAssistant.toLowerCase();
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          onSelectAssistant(name);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-teal-50 text-teal-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Pills for common assistants */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
        <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Cepat:
        </span>
        {popularQuickList.map((name) => {
          const isSelected = name.toLowerCase() === selectedAssistant.toLowerCase();
          return (
            <button
              key={name}
              onClick={() => onSelectAssistant(name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

