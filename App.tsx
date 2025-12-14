
import React, { useState, useEffect, useMemo } from 'react';
import { ClanType, CLAN_DATA } from './types';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import ClanCharacter from './components/ClanCharacter';
import ShareModal from './components/ShareModal';
import SecretAdminPanel from './components/SecretAdminPanel';
import { registerNinja } from './services/api';

// Background image
const BG_IMAGE = "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop";

// Solid Fire Component
const SolidFire: React.FC = () => {
  // Use Memo to prevent particles from regenerating on every render (typing)
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100%
      delay: -(Math.random() * 10), // Negative delay for instant start spread
      duration: 3 + Math.random() * 5, // 3-8s (Slower, longer lasting)
      scale: 0.8 + Math.random() * 1.5, // 0.8 - 2.3x Scale (Much bigger)
      drift: (Math.random() - 0.5) * 100, // Horizontal drift px
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Ambient background glow for depth */}
      <div className="fire-ambient" />
      
      {/* Solid Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="solid-flame"
          style={{
            left: `${p.left}%`,
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--scale': p.scale,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  // --- SECRET ADMIN ROUTING ---
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/bingo-book-s-rank') {
      setIsAdmin(true);
    }
  }, []);

  const [selectedClan, setSelectedClan] = useState<ClanType>(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    recruiter: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Parse URL params for recruiter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recruiter = params.get('recruiter');
    if (recruiter) {
      setFormData(prev => ({ ...prev, recruiter: decodeURIComponent(recruiter) }));
    }
  }, []);

  const handleClanSwitch = (clan: ClanType) => {
    setSelectedClan(clan);
  };

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'whatsapp') {
      const masked = maskPhone(value);
      setFormData(prev => ({ ...prev, whatsapp: masked }));
      if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: false }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
      if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    
    const rawPhone = formData.whatsapp.replace(/\D/g, '');
    if (rawPhone.length !== 11) newErrors.whatsapp = true;

    // Recruiter is optional for submission if not enforced by business logic, 
    // but requested to be an input. If it must be filled to submit:
    // if (!formData.recruiter.trim()) newErrors.recruiter = true; 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedClan) {
      alert("Escolha um clã!");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerNinja({
        nome: formData.name,
        whatsapp: formData.whatsapp,
        cla: selectedClan,
        quemRecrutou: formData.recruiter
      });
      setShowShare(true);
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If URL is the secret admin path, show Admin Panel
  if (isAdmin) {
    return <SecretAdminPanel />;
  }

  const currentClanData = selectedClan ? CLAN_DATA[selectedClan] : null;

  return (
    <div className="h-screen w-full relative bg-black flex flex-col overflow-hidden">
      
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      
      {/* Base Dark Overlay */}
      <div className="fixed inset-0 z-0 bg-black/70 pointer-events-none" />

      {/* --- LITERAL ELEMENTAL EFFECTS --- */}
      
      {/* FIRE: UCHIHA - Solid Flames */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${selectedClan === 'uchiha' ? 'opacity-100' : 'opacity-0'}`}>
          <SolidFire />
      </div>

      {/* WATER: SENJU (WAVES) */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${selectedClan === 'senju' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="liquid-wave"></div>
          <div className="liquid-wave"></div>
      </div>

      {/* Character / Slideshow Area */}
      <div className="relative z-10 w-full h-[65%] flex justify-center items-center overflow-visible">
        <BackgroundSlideshow isVisible={!selectedClan} />
        {CLAN_DATA['uchiha'] && <ClanCharacter clanConfig={CLAN_DATA['uchiha']} isVisible={selectedClan === 'uchiha'} />}
        {CLAN_DATA['senju'] && <ClanCharacter clanConfig={CLAN_DATA['senju']} isVisible={selectedClan === 'senju'} />}
      </div>

      {/* Form Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-end pb-8 px-4">
        <div className="w-full max-w-md mx-auto">
            
          <h1 className={`font-rpg text-5xl md:text-6xl text-center mb-2 tracking-wider text-shadow-strong transition-colors duration-500 ${currentClanData ? currentClanData.titleColor : 'text-purple-400'}`}>
            {currentClanData ? currentClanData.name : 'ESCOLHA SEU LADO'}
          </h1>

          <div className="bg-gray-900/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.6)] rounded-t-3xl rounded-b-xl p-6 transition-all duration-300">
            
            {/* Toggle Switch */}
            <div className="flex bg-black/60 rounded-full p-1 mb-5 relative h-12 border border-white/10">
                <div 
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full shadow-lg transition-all duration-300 ${
                    selectedClan 
                      ? currentClanData?.sliderClass 
                      : 'opacity-0 scale-95'
                  }`}
                  style={{ transform: selectedClan === 'senju' ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
                ></div>
                <button 
                  onClick={() => handleClanSwitch('uchiha')} 
                  className="flex-1 text-center font-bold z-10 relative uppercase text-sm tracking-widest text-white hover:text-red-300 transition-colors"
                >
                  Uchiha
                </button>
                <button 
                  onClick={() => handleClanSwitch('senju')} 
                  className="flex-1 text-center font-bold z-10 relative uppercase text-sm tracking-widest text-white hover:text-green-300 transition-colors"
                >
                  Senju
                </button>
            </div>

            {/* Description */}
            <div className="mb-4 text-center h-12 flex items-center justify-center">
                <p 
                  className="text-gray-300 text-sm leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ 
                    __html: currentClanData 
                      ? currentClanData.desc 
                      : 'O mundo ninja está em guerra. Escolha seu clã para liberar seu poder.' 
                  }}
                />
            </div>

            {/* Inputs */}
            <div className="space-y-3">
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 outline-none focus:bg-black/60 transition-all text-white placeholder-gray-500 font-body ${errors.name ? 'border-red-500 bg-red-900/20' : 'border-gray-600 focus:border-white'}`}
                  placeholder="Nome do Ninja" 
                />

                <input 
                  type="tel" 
                  id="whatsapp" 
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  maxLength={15}
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 outline-none focus:bg-black/60 transition-all text-white placeholder-gray-500 font-body ${errors.whatsapp ? 'border-red-500 bg-red-900/20' : 'border-gray-600 focus:border-white'}`}
                  placeholder="Seu Whatsapp" 
                />

                <input 
                  type="text" 
                  id="recruiter" 
                  value={formData.recruiter}
                  onChange={handleInputChange}
                  readOnly={!!new URLSearchParams(window.location.search).get('recruiter')} 
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 outline-none focus:bg-black/60 transition-all text-white placeholder-gray-500 font-body ${errors.recruiter ? 'border-red-500 bg-red-900/20' : 'border-gray-600 focus:border-white'} ${new URLSearchParams(window.location.search).get('recruiter') ? 'text-gray-400 cursor-not-allowed border-gray-700' : ''}`}
                  placeholder="Quem recrutou" 
                />

                <button 
                  onClick={handleSubmit}
                  disabled={!selectedClan || isSubmitting}
                  className={`w-full py-4 mt-2 rounded-xl font-rpg text-xl tracking-widest text-white shadow-lg transform transition active:scale-95 duration-200
                    ${selectedClan 
                        ? currentClanData?.btnClass 
                        : 'bg-gray-700 cursor-not-allowed opacity-70'
                    }
                  `}
                >
                  {isSubmitting ? 'ENVIANDO...' : (currentClanData ? currentClanData.btnText : 'ESCOLHA UM CLÃ')}
                </button>
            </div>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareModal 
            userName={formData.name} 
            onClose={() => setShowShare(false)} 
        />
      )}
    </div>
  );
};

export default App;
