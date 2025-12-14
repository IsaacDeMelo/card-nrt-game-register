
import React, { useState, useEffect, useMemo } from 'react';
import { ClanType, CLAN_DATA } from './types';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import ClanCharacter from './components/ClanCharacter';
import ShareModal from './components/ShareModal';
import SecretAdminPanel from './components/SecretAdminPanel';
import { registerNinja } from './services/api';

// Solid Fire Component
const SolidFire: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: -(Math.random() * 10),
      duration: 3 + Math.random() * 5,
      scale: 0.8 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 100,
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="fire-ambient" />
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading State

  useEffect(() => {
    if (window.location.pathname === '/bingo-book-s-rank') {
      setIsAdmin(true);
    }

    // Logic to handle loading screen
    const handleLoad = () => {
      // Small timeout to ensure smooth transition and font rendering
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedClan) {
      alert("Escolha um clã!");
      return;
    }
    if (!validateForm()) return;

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

  // Logic to copy link even without registering
  const handleCopyPreRegister = async () => {
    const baseUrl = window.location.href.split('?')[0];
    let shareLink = baseUrl;
    
    // If the user typed their name, create a recruiter link for them immediately
    if (formData.name.trim().length > 0) {
        shareLink = `${baseUrl}?recruiter=${encodeURIComponent(formData.name.trim())}`;
    }

    // Robust Copy Function with Fallback
    const copyToClipboard = async (text: string) => {
        // Try Modern API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn("Clipboard API failed, trying fallback...");
            }
        }
        
        // Fallback for older browsers or non-secure contexts
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        } catch (err) {
            console.error("Fallback copy failed", err);
            return false;
        }
    };

    const success = await copyToClipboard(shareLink);

    if (success) {
        if (formData.name.trim().length > 0) {
            alert(`Link gerado e copiado! Recrutador: ${formData.name}`);
        } else {
            alert("Link base copiado! Digite seu nome antes de copiar para criar seu link personalizado.");
        }
    } else {
        prompt("Não foi possível copiar automaticamente. Por favor, copie o link abaixo:", shareLink);
    }
  };

  if (isAdmin) return <SecretAdminPanel />;

  const currentClanData = selectedClan ? CLAN_DATA[selectedClan] : null;

  return (
    <div className="min-h-screen w-full relative bg-gray-950 overflow-x-hidden">
      
      {/* LOADING SCREEN OVERLAY - RINNEGAN */}
      <div 
        className={`fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
         <div className="relative flex items-center justify-center">
            <img 
                src="https://freepngimg.com/save/113065-rinnegan-download-free-image/840x780" 
                alt="Carregando..." 
                className="w-48 h-48 object-contain animate-spin" 
            />
         </div>
      </div>

      {/* 
          LAYER 0: BACKGROUND BASE (FIXED)
      */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        
        {/* SUB-LAYER 0: ELEMENTAL EFFECTS (z-0) 
            Colocamos z-0 explicitamente para garantir que fique atrás do personagem.
        */}
        <div className="absolute inset-0 z-0">
            <div className={`absolute inset-0 transition-opacity duration-1000 ${selectedClan === 'uchiha' ? 'opacity-100' : 'opacity-0'}`}>
                <SolidFire />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-1000 ${selectedClan === 'senju' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="liquid-wave"></div>
                <div className="liquid-wave"></div>
            </div>
        </div>

        {/* SUB-LAYER 1: CHARACTERS (z-10) 
            Colocamos z-10 para ficar NA FRENTE do fogo/água.
        */}
        <div className="absolute inset-0 z-10 flex justify-center items-start pt-6">
            <BackgroundSlideshow isVisible={!selectedClan} />
            {CLAN_DATA['uchiha'] && <ClanCharacter clanConfig={CLAN_DATA['uchiha']} isVisible={selectedClan === 'uchiha'} />}
            {CLAN_DATA['senju'] && <ClanCharacter clanConfig={CLAN_DATA['senju']} isVisible={selectedClan === 'senju'} />}
        </div>
      </div>

      {/* 
          LAYER 1: FORMULÁRIO E CONTEÚDO (SCROLLABLE) (z-20)
          Fica na frente de tudo.
      */}
      <div className="relative z-20 w-full min-h-screen flex flex-col pt-[22vh] md:pt-[20vh]">
        
        {/* Gradient Transition Wrapper */}
        <div className="w-full flex-1 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent pt-32 pb-20 px-4 flex flex-col items-center">
            
            <div className="w-full max-w-md mx-auto">
                <h1 className={`font-rpg text-5xl md:text-6xl text-center mb-2 tracking-wider text-shadow-strong transition-colors duration-500 ${currentClanData ? currentClanData.titleColor : 'text-purple-400'}`}>
                    {currentClanData ? currentClanData.name : 'ESCOLHA SEU LADO'}
                </h1>

                {/* Form Card - Neutro e integrado */}
                <div className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-t-3xl rounded-b-xl p-6 transition-all duration-300">
                    
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

                         {/* Pre-Register Copy Link Button */}
                         <button 
                            onClick={handleCopyPreRegister}
                            className="w-full py-3 mt-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            COPIAR LINK DE CONVITE
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="text-center text-gray-500 py-6 font-rpg text-xl">
                By Honorato
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
