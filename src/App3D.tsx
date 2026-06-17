/**
 * App3D.tsx
 * Versione 3D del gioco con grafica moderna e accattivante
 */

import React, { useState, useEffect } from 'react';
import { Game3DBoard } from './Game3DBoard';
import ShopComponent from './ShopComponent';
import { HorizontalAdBanner } from './AdBannerComponent';
import { RewardedAdComponent } from './RewardedAdComponent';

interface GameState {
  isProUser: boolean;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  lastPlayedDate: string;
  lives: number;
}

const GAME_STATE_KEY = 'sweet-dream-match3-state';

const DEFAULT_GAME_STATE: GameState = {
  isProUser: false,
  totalScore: 0,
  gamesPlayed: 0,
  bestScore: 0,
  lastPlayedDate: new Date().toISOString(),
  lives: 30
};

export const App3D: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [showShop, setShowShop] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);

  useEffect(() => {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setGameState(parsedState);
      } catch (error) {
        console.error('Errore nel caricamento dello stato:', error);
        setGameState(DEFAULT_GAME_STATE);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleRemoveAds = () => {
    setGameState((prev) => ({
      ...prev,
      isProUser: true
    }));
  };

  const handleNewGame = () => {
    setScore(0);
    setMoves(30);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* 3D Game Board - Full Screen */}
      <Game3DBoard />

      {/* Top Ad Banner - Only if not PRO */}
      {!gameState.isProUser && (
        <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-black bg-opacity-30">
          <HorizontalAdBanner isProUser={gameState.isProUser} />
        </div>
      )}

      {/* Top Left - Stats */}
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 shadow-2xl text-white">
          <div className="text-xs font-semibold opacity-80">PUNTEGGIO</div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-4 shadow-2xl text-white">
          <div className="text-xs font-semibold opacity-80">MOSSE</div>
          <div className="text-3xl font-bold">{moves}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-4 shadow-2xl text-white">
          <div className="text-xs font-semibold opacity-80">BEST</div>
          <div className="text-3xl font-bold">{gameState.bestScore}</div>
        </div>
      </div>

      {/* Top Right - PRO Badge */}
      {gameState.isProUser && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-2 px-4 rounded-full shadow-lg">
            👑 PRO - No Ads
          </div>
        </div>
      )}

      {/* Bottom Left - Shop Button */}
      <div className="absolute bottom-4 left-4 z-20">
        <button
          onClick={() => setShowShop(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-110 transition-all duration-200 text-lg"
        >
          🛍️ Shop
        </button>
      </div>

      {/* Bottom Center - New Game Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={handleNewGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-110 transition-all duration-200 text-lg"
        >
          🔄 New Game
        </button>
      </div>

      {/* Bottom Right - Rewarded Ad Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <RewardedAdComponent
          isProUser={gameState.isProUser}
          currentLives={gameState.lives}
          maxLives={30}
          onRewardEarned={(reward) => {
            const newLives = gameState.lives + reward;
            setGameState((prev) => ({
              ...prev,
              lives: Math.min(newLives, 30)
            }));
          }}
        />
      </div>

      {/* Shop Modal */}
      {showShop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <ShopComponent
              isProUser={gameState.isProUser}
              onPurchase={() => {}}
              onRemoveAds={handleRemoveAds}
              onAddMoves={() => {}}
              currentMoves={moves}
            />
            <button
              onClick={() => setShowShop(false)}
              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App3D;
