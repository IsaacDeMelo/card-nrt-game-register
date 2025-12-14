import React from 'react';

interface Props {
  userName: string;
  onClose: () => void;
}

const ShareModal: React.FC<Props> = ({ userName, onClose }) => {
  // Generate link based on current location
  const baseUrl = window.location.href.split('?')[0];
  const shareLink = `${baseUrl}?recruiter=${encodeURIComponent(userName)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert("Link copiado para a área de transferência!");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-purple-500/50 rounded-2xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center relative">
        <h2 className="font-rpg text-4xl text-purple-400 mb-2 text-shadow-strong">PARABÉNS, NINJA!</h2>
        <p className="text-gray-300 mb-6 font-body">
          Seu registro foi enviado para os arquivos da vila. Agora recrute novos aliados para ganhar prestígio!
        </p>

        <div className="bg-black/50 p-3 rounded-lg border border-white/10 mb-4 break-all">
            <p className="text-xs text-gray-500 mb-1 text-left">SEU LINK DE RECRUTAMENTO:</p>
            <p className="text-blue-300 font-mono text-sm">{shareLink}</p>
        </div>

        <div className="flex flex-col gap-3">
            <button 
                onClick={copyToClipboard}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition shadow-lg"
            >
                COPIAR LINK
            </button>
            <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded-lg transition"
            >
                VOLTAR AO INÍCIO
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;