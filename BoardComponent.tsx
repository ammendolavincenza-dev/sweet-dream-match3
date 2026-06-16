/**
 * BoardComponent.tsx
 * Componente React che visualizza l'intera griglia di gioco
 * Mappa le tessere del Match3Board e le renderizza usando TileComponent
 */

import React, { useState, useCallback } from 'react';
import { Match3Board, Coordinate } from './Match3Board';
import { Tile } from './TileType';
import TileComponent from './TileComponent';

interface BoardComponentProps {
  board: Match3Board;
  onTileClick?: (x: number, y: number) => void;
  onSwap?: (x1: number, y1: number, x2: number, y2: number) => void;
  tileSize?: number;
  gap?: number;
}

/**
 * Componente della griglia di gioco
 */
export const BoardComponent: React.FC<BoardComponentProps> = ({
  board,
  onTileClick,
  onSwap,
  tileSize = 60,
  gap = 8
}) => {
  const [selectedTile, setSelectedTile] = useState<Coordinate | null>(null);

  /**
   * Gestisce il click su una tessera
   * Se è la prima tessera selezionata, la marca come selezionata
   * Se è la seconda tessera, tenta uno swap
   */
  const handleTileClick = useCallback(
    (x: number, y: number) => {
      // Notifica il parent del click
      if (onTileClick) {
        onTileClick(x, y);
      }

      // Se non c'è una tessera selezionata, seleziona questa
      if (!selectedTile) {
        setSelectedTile({ x, y });
        return;
      }

      // Se clicchi sulla stessa tessera, deseleziona
      if (selectedTile.x === x && selectedTile.y === y) {
        setSelectedTile(null);
        return;
      }

      // Se clicchi su un'altra tessera, tenta uno swap
      if (onSwap) {
        onSwap(selectedTile.x, selectedTile.y, x, y);
      }

      // Deseleziona dopo il tentativo di swap
      setSelectedTile(null);
    },
    [selectedTile, onTileClick, onSwap]
  );

  /**
   * Renderizza la griglia di tessere
   */
  const renderGrid = () => {
    const tiles: JSX.Element[] = [];

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const tile = board.getTile(x, y);
        const isSelected = selectedTile?.x === x && selectedTile?.y === y;

        tiles.push(
          <div key={`${x}-${y}`}>
            <TileComponent
              tile={tile}
              x={x}
              y={y}
              isSelected={isSelected}
              onClick={handleTileClick}
              size={tileSize}
            />
          </div>
        );
      }
    }

    return tiles;
  };

  const gridWidth = board.width * (tileSize + gap) - gap;
  const gridHeight = board.height * (tileSize + gap) - gap;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Contenitore della griglia */}
      <div
        className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl shadow-2xl p-4 border-4 border-purple-300"
        style={{
          width: `${gridWidth + 32}px`,
          height: `${gridHeight + 32}px`
        }}
      >
        {/* Griglia CSS */}
        <div
          className="grid gap-2 h-full"
          style={{
            gridTemplateColumns: `repeat(${board.width}, 1fr)`,
            gridTemplateRows: `repeat(${board.height}, 1fr)`,
            gap: `${gap}px`
          }}
        >
          {renderGrid()}
        </div>
      </div>

      {/* Informazioni sulla griglia */}
      <div className="text-center text-sm text-gray-600">
        <p>Griglia: {board.width} × {board.height}</p>
        {selectedTile && (
          <p className="text-purple-600 font-semibold">
            Tessera selezionata: ({selectedTile.x}, {selectedTile.y})
          </p>
        )}
      </div>
    </div>
  );
};

export default BoardComponent;
