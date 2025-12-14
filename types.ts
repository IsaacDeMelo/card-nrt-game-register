
export type ClanType = 'uchiha' | 'senju' | null;

export interface RegistrationData {
  nome: string;
  whatsapp: string;
  cla: ClanType;
  quemRecrutou: string;
}

export interface NinjaProfile {
  _id: string;
  nome: string;
  whatsapp: string;
  cla: ClanType;
  quemRecrutou: string;
  dataRegistro: string;
}

export interface ClanConfig {
  name: string;
  desc: string; // HTML string allowed
  titleColor: string;
  btnText: string;
  btnClass: string;
  sliderClass: string;
  overlayColor: string;
  image: string;
  glowColor: string;
}

export const CLAN_DATA: Record<string, ClanConfig> = {
  uchiha: {
    name: 'CLÃ UCHIHA',
    desc: 'Poder ocular e chamas destrutivas. Foco em <span class="text-red-400 font-bold">Dano Crítico</span>.',
    titleColor: 'text-red-600',
    btnText: 'CONFIRMAR UCHIHA',
    btnClass: 'bg-gradient-to-r from-red-900 to-red-600 hover:from-red-800 hover:to-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    sliderClass: 'bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.6)]',
    overlayColor: 'bg-red-950/70',
    image: 'https://www.pngplay.com/wp-content/uploads/12/Madara-Uchiha-PNG-Background.png',
    glowColor: 'drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]'
  },
  senju: {
    name: 'CLÃ SENJU',
    desc: 'Força vital e jutsus de madeira. Foco em <span class="text-green-400 font-bold">Defesa e Cura</span>.',
    titleColor: 'text-green-500',
    btnText: 'CONFIRMAR SENJU',
    btnClass: 'bg-gradient-to-r from-green-900 to-green-600 hover:from-green-800 hover:to-green-500 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    sliderClass: 'bg-green-700 shadow-[0_0_15px_rgba(34,197,94,0.6)]',
    overlayColor: 'bg-green-950/70',
    image: 'https://i.namu.wiki/i/nrgbfMcdDrRXcFMvVwvetFK6799O4UCiEEsQhiL_lJnrogfs1xWiObc3X9rmJYfpkECMJF9xu6TvY5hfpazRKw.webp',
    glowColor: 'drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]'
  }
};
