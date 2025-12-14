
import React, { useEffect, useState } from 'react';
import { NinjaProfile } from '../types';

const SecretAdminPanel: React.FC = () => {
  const [ninjas, setNinjas] = useState<NinjaProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/all-ninjas')
      .then(res => res.json())
      .then(data => {
        setNinjas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar bingo book:", err);
        setLoading(false);
      });
  }, []);

  // Calcular Ranking de Recrutadores
  const recruiterStats = ninjas.reduce((acc, ninja) => {
    if (ninja.quemRecrutou && ninja.quemRecrutou.trim() !== '') {
      const recruiter = ninja.quemRecrutou.trim();
      acc[recruiter] = (acc[recruiter] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedRanking = Object.entries(recruiterStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5

  const formatWhatsAppLink = (phone: string) => {
    // Remove tudo que não é número e adiciona 55 (Brasil) se não tiver
    const cleanNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanNumber}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-rpg text-4xl animate-pulse">Carregando Arquivos Secretos...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8 font-body overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center border-b border-red-800 pb-6">
          <h1 className="font-rpg text-6xl text-red-600 tracking-widest text-shadow-strong">BINGO BOOK</h1>
          <p className="text-gray-400">Arquivos confidenciais da Vila. Acesso restrito.</p>
        </div>

        {/* RANKING SECTION */}
        <div className="bg-gray-800/50 border border-yellow-600/30 rounded-xl p-6 shadow-lg backdrop-blur-md">
          <h2 className="font-rpg text-3xl text-yellow-500 mb-4 flex items-center gap-2">
            🏆 TOP RECRUTADORES (KAGE LEVEL)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedRanking.length > 0 ? sortedRanking.map(([name, count], index) => (
              <div key={name} className={`flex items-center justify-between p-4 rounded-lg border ${index === 0 ? 'bg-yellow-900/40 border-yellow-500' : 'bg-gray-700/40 border-gray-600'}`}>
                <div className="flex items-center gap-3">
                  <span className={`font-rpg text-2xl ${index === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>#{index + 1}</span>
                  <span className="font-bold text-lg">{name}</span>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold">{count}</span>
                  <span className="text-xs text-gray-400 uppercase">Recrutados</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">Nenhum recrutamento registrado ainda.</p>
            )}
          </div>
        </div>

        {/* LISTA COMPLETA */}
        <div className="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="font-rpg text-2xl text-gray-200">TODOS OS REGISTROS ({ninjas.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm uppercase bg-black/40">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Nome</th>
                  <th className="p-4 font-semibold">Clã</th>
                  <th className="p-4 font-semibold">Recrutado Por</th>
                  <th className="p-4 font-semibold text-right">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {ninjas.map((ninja) => (
                  <tr key={ninja._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-gray-500 text-sm font-mono">
                      {new Date(ninja.dataRegistro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 font-bold text-lg text-white">
                      {ninja.nome}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        ninja.cla === 'uchiha' 
                          ? 'bg-red-900/30 text-red-400 border-red-800' 
                          : 'bg-green-900/30 text-green-400 border-green-800'
                      }`}>
                        {ninja.cla}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {ninja.quemRecrutou || <span className="text-gray-600 italic">-</span>}
                    </td>
                    <td className="p-4 text-right">
                      <a 
                        href={formatWhatsAppLink(ninja.whatsapp)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-green-900/20"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                        </svg>
                        WhatsApp
                      </a>
                      <div className="text-xs text-gray-500 mt-1 font-mono">{ninja.whatsapp}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecretAdminPanel;
