/**
 * TileComponent.tsx
 * Componente React che rappresenta una singola tessera sulla griglia
 * Utilizza Tailwind CSS per lo stile "sweet & dream"
 */

import React from 'react';
import { Tile, TileType, SpecialBlockType } from './TileType';

interface TileComponentProps {
  tile: Tile | null;
  x: number;
  y: number;
  isSelected?: boolean;
  onClick?: (x: number, y: number) => void;
  size?: number; // Dimensione della tessera in pixel
}

/**
 * Ottiene il colore di sfondo della tessera in base al tipo
 */
const getTileColorClass = (tileType: TileType): string => {
  switch (tileType) {
    case TileType.ZuccheroFilato:
      return 'bg-gradient-to-br from-pink-300 via-pink-200 to-pink-400';
    case TileType.PannaMontata:
      return 'bg-gradient-to-br from-white via-blue-50 to-blue-100';
    case TileType.NuvolaDolce:
      return 'bg-gradient-to-br from-blue-200 via-blue-100 to-purple-200';
    case TileType.UnicornoMagico:
      return 'bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300';
    case TileType.CaramellaRosa:
      return 'bg-gradient-to-br from-orange-300 via-pink-300 to-red-300';
    case TileType.Ostacolo:
      return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700';
    default:
      return 'bg-gray-100';
  }
};

/**
 * Ottiene l'emoji o il simbolo rappresentativo della tessera
 */
const getTileEmoji = (tileType: TileType): string => {
  switch (tileType) {
    case TileType.ZuccheroFilato:
      return '🍭';
    case TileType.PannaMontata:
      return '🍦';
    case TileType.NuvolaDolce:
      return '☁️';
    case TileType.UnicornoMagico:
      return '🦄';
    case TileType.CaramellaRosa:
      return '🍬';
    case TileType.Ostacolo:
      return '🔒';
    default:
      return '';
  }
};

/**
 * Ottiene la classe CSS per il tipo speciale di blocco
 */
const getSpecialBlockClass = (specialType: SpecialBlockType): string => {
  switch (specialType) {
    case SpecialBlockType.Striped:
      return 'animate-pulse border-4 border-yellow-400';
    case SpecialBlockType.Bomb:
      return 'ring-4 ring-red-500 animate-bounce';
    case SpecialBlockType.RainbowUnicorn:
      return 'ring-4 ring-purple-500 animate-spin';
    default:
      return '';
  }
};

/**
 * Componente della singola tessera
 */
export const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  x,
  y,
  isSelected = false,
  onClick,
  size = 60
}) => {
  const handleClick = () => {
    if (onClick && tile && tile.isPlayable()) {
      onClick(x, y);
    }
  };

  // Se la tessera è vuota, mostra uno spazio vuoto
  if (!tile) {
    return (
      <div
        className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    );
  }

  const colorClass = getTileColorClass(tile.type);
  const emoji = getTileEmoji(tile.type);
  const specialClass = getSpecialBlockClass(tile.specialType);
  const isPlayable = tile.isPlayable();

  return (
    <button
      onClick={handleClick}
      disabled={!isPlayable}
      className={`
        relative
        rounded-lg
        shadow-lg
        transition-all
        duration-200
        transform
        ${colorClass}
        ${specialClass}
        ${isSelected ? 'ring-4 ring-yellow-300 scale-110 shadow-2xl' : ''}
        ${isPlayable ? 'hover:scale-105 cursor-pointer hover:shadow-xl' : 'cursor-not-allowed opacity-60'}
        flex
        items-center
        justify-center
        text-4xl
        font-bold
        border-2
        border-white
        overflow-hidden
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      title={tile.getTypeName()}
    >
      {/* Effetto di lucentezza */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg pointer-events-none" />

      {/* Emoji della tessera */}
      <span className="relative z-10 drop-shadow-lg">{emoji}</span>

      {/* Indicatore di blocco speciale */}
      {tile.specialType !== SpecialBlockType.None && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-300 rounded-full border border-yellow-500 shadow-md" />
      )}
    </button>
  );
};

export default TileComponent;
