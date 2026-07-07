import React, { useState, useEffect, useRef } from 'react';
import { BirackoMesto, Person } from '../types';
import { REONI } from '../data';

import { Search, Plus, MapPin, Trash2, Shield, Users, Check, AlertTriangle, X } from 'lucide-react';

interface BMTabProps {
  bm: BirackoMesto[];
  people: Person[];
  onAddBM: (newBM: BirackoMesto) => void;
  onDeleteBM: (broj: string) => void;
  onAssignPerson: (pid: string, targetId: string, targetRole: string) => void;
  canAssignPerson: boolean;
  isReadOnly: boolean;
  allowAddBM?: boolean;
  reoni?: string[];
}

export default function BMTab({ bm, people, onAddBM, onDeleteBM, onAssignPerson, canAssignPerson, isReadOnly, allowAddBM = true, reoni = REONI }: BMTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding BM
  const [broj, setBroj] = useState('');
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [reon, setReon] = useState(reoni[0] || 'Neimar');
  const [deli, setDeli] = useState(false);

  // Form states for assigning person
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedBMId, setSelectedBMId] = useState('');
  const [selectedRole, setSelectedRole] = useState('kontrolor');
  const [selectedPersonSearch, setSelectedPersonSearch] = useState('');
  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const personDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReon(reoni[0] || 'Neimar');
  }, [reoni]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        personDropdownRef.current &&
        !personDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPersonDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broj || !naziv || !adresa) return;
    
    // Check if already exists
    if (bm.some(b => b.broj === broj)) {
      alert(`Biračko mesto sa brojem ${broj} već postoji.`);
      return;
    }

    onAddBM({
      broj,
      naziv,
      adresa,
      reon,
      deli,
      sefBM: [],
      kontrolori: []
    });

    // Reset
    setBroj('');
    setNaziv('');
    setAdresa('');
    setDeli(false);
    setIsModalOpen(false);
  };

  const handleAssignPersonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonId || !selectedBMId || !selectedRole) {
      alert('Molimo odaberite osobu, biračko mesto i ulogu.');
      return;
    }

    onAssignPerson(selectedPersonId, selectedBMId, selectedRole);
    setSelectedPersonId('');
    setSelectedPersonSearch('');
    setSelectedBMId('');
    setSelectedRole('kontrolor');
    setIsPersonDropdownOpen(false);
    setIsModalOpen(false);
  };

  const filteredBM = bm.filter(b => 
    b.broj.includes(searchQuery) || 
    b.naziv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Pretraži biračka mesta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#101318] border border-[#1e222b] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Add BM / Assign Person Button */}
        {((canAssignPerson || !isReadOnly) && (allowAddBM ?? true)) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-xl transition-colors flex items-center gap-1.5 justify-center"
          >
            <Plus className="w-4 h-4" />
            {canAssignPerson ? 'Rasporedi osobu' : 'Novo biračko mesto'}
          </button>
        )}
      </div>

      {/* Grid of Biračka Mesta */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBM.map((b) => {
          const sefNames = b.sefBM.map(id => people.find(p => p.id === id)?.imePrezime).filter(Boolean);
          const kontrolorNames = b.kontrolori.map(id => people.find(p => p.id === id)?.imePrezime).filter(Boolean);
          
          const hasSef = sefNames.length > 0;
          const kCount = kontrolorNames.length;
          
          let statusColor = 'border-red-500/20 bg-red-500/5 text-red-400';
          let statusText = 'Nema šefa';
          
          if (hasSef && kCount >= 2) {
            statusColor = 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400';
            statusText = 'Popunjeno';
          } else if (hasSef) {
            statusColor = 'border-amber-500/20 bg-amber-500/5 text-amber-400';
            statusText = `Fali kontrolor (${kCount}/2)`;
          } else if (kCount > 0) {
            statusColor = 'border-red-500/20 bg-red-500/5 text-red-400';
            statusText = 'Fali šef biračkog mesta';
          }

          return (
            <div 
              key={b.broj}
              className="bg-[#101318] border border-[#1e222b] rounded-2xl p-5 hover:border-[#2a303d] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-xs font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                      BM {b.broj}
                    </span>
                  </div>

                  {!isReadOnly && (
                    <button
                      onClick={() => {
                        if (confirm(`Da li ste sigurni da želite obrisati biračko mesto BM ${b.broj}?`)) {
                          onDeleteBM(b.broj);
                        }
                      }}
                      className="text-[#9aa3b2] hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors"
                      title="Obriši"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name & Address */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-white leading-tight">{b.naziv}</h4>
                  <p className="text-[11px] text-[#9aa3b2] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{b.adresa}</span>
                  </p>
                </div>

                {/* Shared status indicator */}
                {b.deli && (
                  <div className="mt-2 text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md inline-block font-medium">
                    Deljeno biračko mesto (Zajedničko)
                  </div>
                )}

                {/* Team Assignment Breakdown */}
                <div className="mt-5 space-y-3.5">
                  {/* Šef BM */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#9aa3b2] uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span>Šef biračkog mesta</span>
                    </div>
                    {sefNames.length > 0 ? (
                      <div className="text-xs text-white font-semibold">
                        {sefNames.join(', ')}
                      </div>
                    ) : (
                      <div className="text-xs text-[#ef4444] font-medium flex items-center gap-1 italic">
                        <AlertTriangle className="w-3 h-3" />
                        Nije raspoređen
                      </div>
                    )}
                  </div>

                  {/* Kontrolori */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#9aa3b2] uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" />
                      <span>Kontrolori ({kCount}/2)</span>
                    </div>
                    {kontrolorNames.length > 0 ? (
                      <div className="text-xs text-white space-y-0.5">
                        {kontrolorNames.map((name, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                            <span>{name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[#9aa3b2] italic">Nema raspoređenih kontrolora</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status footer badge */}
              <div className={`mt-5 pt-3.5 border-t border-[#1e222b] text-[10px] font-bold uppercase tracking-wider flex items-center justify-between`}>
                <span className="text-[#9aa3b2]">Stanje tima</span>
                <span className={`px-2 py-0.5 rounded border ${statusColor}`}>
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add BM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#101318] border border-[#1e222b] w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#1e222b] flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white">
                {canAssignPerson ? 'Rasporedi osobu na BM' : 'Dodaj novo biračko mesto'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {canAssignPerson ? (
              <form onSubmit={handleAssignPersonSubmit} className="p-6 space-y-4">
                <div className="space-y-1 relative" ref={personDropdownRef}>
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Izaberi osobu</label>
                  <input
                    type="text"
                    placeholder="Pretraži i izaberi osobu..."
                    value={selectedPersonSearch}
                    onChange={(e) => {
                      setSelectedPersonSearch(e.target.value);
                      setIsPersonDropdownOpen(true);
                      setSelectedPersonId('');
                    }}
                    onFocus={() => setIsPersonDropdownOpen(true)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {isPersonDropdownOpen && (
                    <div className="absolute inset-x-0 top-full mt-1 max-h-52 overflow-y-auto bg-[#101318] border border-[#232935] rounded-xl shadow-2xl z-40">
                      {people.filter(p => !p.rasporedjen && p.imePrezime.toLowerCase().includes(selectedPersonSearch.toLowerCase())).slice(0, 10).map(person => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => {
                            setSelectedPersonId(person.id);
                            setSelectedPersonSearch(`${person.imePrezime} (${person.uloga || 'bez uloge'})`);
                            setIsPersonDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-blue-600/10 transition-colors"
                        >
                          {person.imePrezime} <span className="text-[#9aa3b2]">({person.uloga || 'bez uloge'})</span>
                        </button>
                      ))}
                      {people.filter(p => !p.rasporedjen && p.imePrezime.toLowerCase().includes(selectedPersonSearch.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-xs text-[#9aa3b2]">Nema rezultata za "{selectedPersonSearch}"</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Odaberi biračko mesto</label>
                  <select
                    required
                    value={selectedBMId}
                    onChange={(e) => setSelectedBMId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Odaberi biračko mesto --</option>
                    {bm.map(b => (
                      <option key={b.broj} value={b.broj}>{`BM ${b.broj} — ${b.naziv}`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Uloga / Dužnost</label>
                  <select
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="kontrolor">Kontrolor</option>
                    <option value="sef_bm">Šef biračkog mesta</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-2 justify-end border-t border-[#1e222b]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Odustani
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-xl transition-colors"
                  >
                    Rasporedi osobu
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddBMSubmit} className="p-6 space-y-4">
                {/* Broj BM */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Broj biračkog mesta</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. 012"
                    value={broj}
                    onChange={(e) => setBroj(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Naziv lokacije */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Naziv biračkog mesta (lokacija)</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. OŠ Sveti Sava"
                    value={naziv}
                    onChange={(e) => setNaziv(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Adresa */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#9aa3b2] uppercase tracking-wider">Adresa</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Resavska 17"
                    value={adresa}
                    onChange={(e) => setAdresa(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161a22] border border-[#232935] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Deli flag */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="deli_checkbox"
                    checked={deli}
                    onChange={(e) => setDeli(e.target.checked)}
                    className="rounded border-[#232935] bg-[#161a22] text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                  />
                  <label htmlFor="deli_checkbox" className="text-xs text-gray-300 font-medium select-none cursor-pointer">
                    Zajedničko biračko mesto (deli prostoriju sa drugim BM)
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-2 justify-end border-t border-[#1e222b]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Odustani
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-xl transition-colors"
                  >
                    Dodaj biračko mesto
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
