/**
 * App.tsx
 * Componente principale dell'applicazione
 * Integra la logica di gioco (Match3Board) con i componenti React (BoardComponent, ShopComponent, AdBannerComponent)
 * Gestisce lo stato globale e la persistenza nel localStorage
 */

import React, { useState, useEffect } from 'react';
import { Match3Board } from './Match3Board';
import BoardComponent from './BoardComponent';
import ShopComponent from './ShopComponent';
import { HorizontalAdBanner, SquareAdBanner } from './AdBannerComponent';
import { RewardedAdComponent } from './RewardedAdComponent';

/**
 * Interfaccia per lo stato di gioco persistente
 */
interface GameState {
  isProUser: boolean;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  lastPlayedDate: string;
  lives: number; // Vite disponibili
}

/**
 * Chiave per il localStorage
 */
const GAME_STATE_KEY = 'sweet-dream-match3-state';

/**
 * Stato iniziale del gioco
 */
const DEFAULT_GAME_STATE: GameState = {
  isProUser: false,
  totalScore: 0,
  gamesPlayed: 0,
  bestScore: 0,
  lastPlayedDate: new Date().toISOString(),
  lives: 30 // Vite iniziali
};

/**
 * Componente principale dell'app
 */
export const App: React.FC = () => {
  const [board, setBoard] = useState<Match3Board | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [showShop, setShowShop] = useState(false);

  /**
   * Carica lo stato di gioco dal localStorage al montaggio
   */
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

    // Inizializza il gioco
    initializeGame();
  }, []);

  /**
   * Salva lo stato di gioco nel localStorage ogni volta che cambia
   */
  useEffect(() => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  /**
   * Inizializza un nuovo gioco
   */
  const initializeGame = () => {
    const newBoard = new Match3Board(7, 7);
    newBoard.initializeBoard();
    setBoard(newBoard);
    setScore(0);
    setMoves(30);
    setGameOver(false);
  };

  /**
   * Gestisce lo swap di due tessere
   */
  const handleSwap = (x1: number, y1: number, x2: number, y2: number) => {
    if (!board || gameOver) return;

    // Crea una copia della griglia per evitare mutazioni dirette
    const newBoard = new Match3Board(board.width, board.height);
    const snapshot = board.getGridSnapshot();

    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        newBoard.setTile(x, y, snapshot[x][y]);
      }
    }

    // Tenta lo swap
    if (newBoard.swapTiles(x1, y1, x2, y2)) {
      // Swap valido, processa i match
      const matchedCoordinates = newBoard.processMatches();

      if (matchedCoordinates.length > 0) {
        // Calcola il punteggio
        const matchScore = matchedCoordinates.length * 10;
        const newScore = score + matchScore;
        setScore(newScore);
        setMoves((prev) => prev - 1);

        // Aggiorna la griglia
        setBoard(newBoard);

        // Controlla se il gioco è finito
        if (moves - 1 <= 0) {
          endGame(newScore);
        }
      } else {
        // Nessun match, annulla lo swap
        console.log('Nessun match trovato, swap annullato');
      }
    } else {
      // Swap non valido
      console.log('Swap non valido');
    }
  };

  /**
   * Termina il gioco e salva le statistiche
   */
  const endGame = (finalScore: number) => {
    setGameOver(true);

    // Aggiorna le statistiche
    setGameState((prev) => ({
      ...prev,
      totalScore: prev.totalScore + finalScore,
      gamesPlayed: prev.gamesPlayed + 1,
      bestScore: Math.max(prev.bestScore, finalScore),
      lastPlayedDate: new Date().toISOString()
    }));
  };

  /**
   * Resetta il gioco
   */
  const handleReset = () => {
    initializeGame();
  };

  /**
   * Gestisce l'acquisto di un prodotto dal negozio
   */
  const handlePurchase = (productId: string, productType: string) => {
    console.log('Acquisto completato:', productId, productType);
    // Qui puoi aggiungere logica aggiuntiva, come inviare l'acquisto a un backend
  };

  /**
   * Attiva la modalità PRO (rimuove pubblicità)
   */
  const handleRemoveAds = () => {
    setGameState((prev) => ({
      ...prev,
      isProUser: true
    }));
    alert('✅ Pubblicità rimossa! Grazie per il supporto!');
  };

  /**
   * Aggiunge mosse extra
   */
  const handleAddMoves = (movesToAdd: number) => {
    setMoves((prev) => prev + movesToAdd);
    alert(`✅ Aggiunte ${movesToAdd} mosse!`);
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦄</div>
          <p className="text-2xl font-bold text-purple-700">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
          🍭 Sweet & Dream Match-3 🦄
        </h1>
        <p className="text-gray-600 text-lg">Abbina le dolcezze e vinci!</p>

        {/* Badge PRO */}
        {gameState.isProUser && (
          <div className="inline-block mt-2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-full text-sm">
            👑 PRO - Senza Pubblicità
          </div>
        )}
      </div>

      {/* Banner pubblicitario superiore (se non è PRO) */}
      {!gameState.isProUser && (
        <div className="mb-6">
          <HorizontalAdBanner isProUser={gameState.isProUser} />
        </div>
      )}

      {/* Layout principale con griglia e sidebar */}
      <div className="flex gap-8 items-start justify-center flex-wrap lg:flex-nowrap">
        {/* Sidebar sinistra con banner pubblicitario */}
        {!gameState.isProUser && (
          <div className="w-full lg:w-auto">
            <SquareAdBanner isProUser={gameState.isProUser} />
          </div>
        )}

        {/* Sezione principale: Statistiche + Griglia */}
        <div className="flex flex-col items-center gap-6">
          {/* Statistiche di gioco */}
          <div className="flex gap-8 bg-white rounded-xl shadow-lg p-6 border-2 border-purple-300">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">PUNTEGGIO</p>
              <p className="text-4xl font-bold text-purple-600">{score}</p>
            </div>
            <div className="w-1 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">MOSSE</p>
              <p
                className={`text-4xl font-bold ${
                  moves > 10 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {moves}
              </p>
            </div>
            <div className="w-1 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">MIGLIOR PUNTEGGIO</p>
              <p className="text-4xl font-bold text-blue-600">{gameState.bestScore}</p>
            </div>
          </div>

          {/* Griglia di gioco */}
          <div>
            <BoardComponent
              board={board}
              onSwap={handleSwap}
              tileSize={60}
              gap={8}
            />
          </div>

          {/* Statistiche globali */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200 text-center">
            <p className="text-sm text-gray-600">
              Partite giocate: <span className="font-bold text-blue-600">{gameState.gamesPlayed}</span>
            </p>
            <p className="text-sm text-gray-600">
              Punteggio totale: <span className="font-bold text-purple-600">{gameState.totalScore}</span>
            </p>
          </div>
        </div>

        {/* Sidebar destra con banner pubblicitario */}
        {!gameState.isProUser && (
          <div className="w-full lg:w-auto">
            <SquareAdBanner isProUser={gameState.isProUser} />
          </div>
        )}
      </div>

      {/* Messaggio di fine gioco */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-400 text-center max-w-md">
            <p className="text-5xl mb-4">😢</p>
            <p className="text-3xl font-bold text-red-600 mb-2">Gioco Finito!</p>
            <p className="text-lg text-gray-700 mb-6">
              Punteggio finale: <span className="font-bold text-purple-600 text-2xl">{score}</span>
            </p>

            {/* Statistiche della partita */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">
                Miglior punteggio: <span className="font-bold">{gameState.bestScore}</span>
              </p>
              <p className="text-sm text-gray-600">
                Partite totali: <span className="font-bold">{gameState.gamesPlayed + 1}</span>
              </p>
            </div>

            {/* Pulsanti di azione */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-600"
              >
                🔄 Gioca di Nuovo
              </button>
              <button
                onClick={() => setShowShop(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-600"
              >
                🛍️ Negozio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulsanti di controllo (quando il gioco non è finito) */}
      {!gameOver && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-600"
          >
            🔄 Nuovo Gioco
          </button>
          <button
            onClick={() => setShowShop(true)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-600"
          >
            🛍️ Negozio
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>Seleziona due tessere adiacenti per scambiarle</p>
        <p className="mt-2">Crea match di 3 o più tessere dello stesso tipo!</p>
      </div>

      {/* Componente Annunci Incentivati (Guadagna Vite) */}
      <RewardedAdComponent
        isProUser={gameState.isProUser}
        currentLives={gameState.lives}
        maxLives={30}
        onRewardEarned={(reward) => {
          const newLives = gameState.lives + reward;
          setGameState((prev) => ({
            ...prev,
            lives: Math.min(newLives, 30) // Max 30 vite
          }));
        }}
      />

      {/* Componente Negozio */}
      <ShopComponent
        isProUser={gameState.isProUser}
        onPurchase={handlePurchase}
        onRemoveAds={handleRemoveAds}
        onAddMoves={handleAddMoves}
        currentMoves={moves}
      />
    </div>
  );
};

export default App;
