/**
 * RewardedAdComponent.tsx
 * Componente per gli annunci incentivati
 * Gli utenti guardano un annuncio di 30 secondi e ricevono 5 vite gratis
 */

import React, { useState, useEffect } from 'react';

interface RewardedAdProps {
  onRewardEarned: (reward: number) => void;
  isProUser: boolean;
  currentLives: number;
  maxLives: number;
}

export const RewardedAdComponent: React.FC<RewardedAdProps> = ({
  onRewardEarned,
  isProUser,
  currentLives,
  maxLives,
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canWatchAgain, setCanWatchAgain] = useState(true);
  const [nextAdAvailableIn, setNextAdAvailableIn] = useState(0);

  // Effetto per il countdown dell'annuncio
  useEffect(() => {
    if (!isWatchingAd) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          completeAdWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWatchingAd]);

  // Effetto per il cooldown tra annunci
  useEffect(() => {
    if (nextAdAvailableIn <= 0) {
      setCanWatchAgain(true);
      return;
    }

    const interval = setInterval(() => {
      setNextAdAvailableIn((prev) => {
        if (prev <= 1) {
          setCanWatchAgain(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextAdAvailableIn]);

  const handleWatchAd = () => {
    if (isProUser) {
      alert('👑 Sei un utente PRO! Non hai bisogno di guardare annunci per ricaricare le vite.');
      return;
    }

    if (currentLives >= maxLives) {
      alert('❤️ Hai già il massimo di vite! Torna quando ne avrai bisogno.');
      return;
    }

    if (!canWatchAgain) {
      alert(`⏳ Puoi guardare un altro annuncio tra ${nextAdAvailableIn} secondi.`);
      return;
    }

    setIsWatchingAd(true);
    setTimeLeft(30);
  };

  const completeAdWatch = () => {
    setIsWatchingAd(false);
    setAdWatched(true);

    // Ricompensa: +5 vite
    const reward = 5;
    onRewardEarned(reward);

    // Imposta il cooldown: 5 minuti (300 secondi)
    setCanWatchAgain(false);
    setNextAdAvailableIn(300);

    // Reset del messaggio di successo dopo 3 secondi
    setTimeout(() => setAdWatched(false), 3000);
  };

  const skipAd = () => {
    setIsWatchingAd(false);
    setTimeLeft(30);
    alert('❌ Hai saltato l\'annuncio. Nessuna ricompensa questa volta.');
  };

  // Non mostrare il componente se l'utente è PRO
  if (isProUser) {
    return null;
  }

  // Non mostrare se le vite sono al massimo
  if (currentLives >= maxLives) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Bottone Principale */}
      {!isWatchingAd && (
        <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-xl shadow-2xl p-4 max-w-sm border-2 border-white">
          {/* Intestazione */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎁</span>
            <h3 className="font-bold text-white text-lg">Guadagna Vite Gratis!</h3>
          </div>

          {/* Descrizione */}
          <p className="text-sm text-white mb-3 leading-relaxed">
            Guarda un breve annuncio e ricevi <span className="font-bold">+5 vite</span> gratuite!
          </p>

          {/* Vite Attuali */}
          <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-3">
            <p className="text-xs text-white">
              Vite attuali: <span className="font-bold">{currentLives}/{maxLives}</span>
            </p>
          </div>

          {/* Pulsante */}
          <button
            onClick={handleWatchAd}
            disabled={!canWatchAgain || isWatchingAd}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform ${
              !canWatchAgain || isWatchingAd
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-green-500 hover:bg-green-600 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {isWatchingAd
              ? `⏳ Guarda l'annuncio... (${timeLeft}s)`
              : canWatchAgain
              ? '📺 Guarda Annuncio'
              : `⏰ Disponibile tra ${nextAdAvailableIn}s`}
          </button>

          {/* Nota */}
          <p className="text-xs text-white mt-2 opacity-75 text-center">
            Puoi guardare un annuncio ogni 5 minuti
          </p>
        </div>
      )}

      {/* Schermata Annuncio */}
      {isWatchingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
            {/* Icona Annuncio */}
            <div className="text-6xl mb-4">📺</div>

            {/* Titolo */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Guarda l'Annuncio
            </h2>

            {/* Descrizione */}
            <p className="text-gray-600 mb-6">
              Rimani concentrato per ottenere la tua ricompensa!
            </p>

            {/* Barra di Progresso */}
            <div className="bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all"
                style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
              ></div>
            </div>

            {/* Timer */}
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {timeLeft}s
            </div>

            {/* Messaggio */}
            <p className="text-sm text-gray-600 mb-6">
              Guarda questo annuncio per ricevere <span className="font-bold text-green-600">+5 vite</span>
            </p>

            {/* Pulsanti */}
            <div className="flex gap-3">
              <button
                onClick={skipAd}
                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition"
              >
                Salta
              </button>
              <button
                disabled
                className="flex-1 py-2 px-4 bg-green-500 text-white font-bold rounded-lg opacity-50 cursor-not-allowed"
              >
                ⏳ In corso...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaggio di Successo */}
      {adWatched && (
        <div className="bg-green-500 text-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-green-600 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold">Annuncio Completato!</h3>
              <p className="text-sm">Hai guadagnato +5 vite!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
