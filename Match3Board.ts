/**
 * Match3Board.ts
 * Traduzione TypeScript del file C# Match3Board.cs
 * Gestisce la logica pura della griglia di gioco Match-3
 */

import { Tile, TileType, SpecialBlockType, getPlayableTileTypes, getRandomPlayableTileType } from './TileType';

/**
 * Interfaccia per rappresentare una coordinata sulla griglia
 */
export interface Coordinate {
  x: number;
  y: number;
}

/**
 * Classe principale che gestisce la logica della griglia Match-3
 * Questa è una classe "logica pura" senza dipendenze da React o altre librerie UI
 */
export class Match3Board {
  private grid: (Tile | null)[][];
  readonly width: number;
  readonly height: number;

  /**
   * Costruttore della griglia
   * @param width Larghezza della griglia
   * @param height Altezza della griglia
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array(width)
      .fill(null)
      .map(() => Array(height).fill(null));
  }

  /**
   * Ottiene la tessera a una coordinata specifica
   */
  getTile(x: number, y: number): Tile | null {
    if (this.isValidCoordinate(x, y)) {
      return this.grid[x][y];
    }
    return null;
  }

  /**
   * Imposta una tessera a una coordinata specifica
   */
  setTile(x: number, y: number, tile: Tile | null): void {
    if (this.isValidCoordinate(x, y)) {
      this.grid[x][y] = tile;
    }
  }

  /**
   * Verifica se una coordinata è valida
   */
  isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Inizializza la griglia con tessere casuali, evitando match iniziali
   */
  initializeBoard(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let chosenType: TileType;
        let attempts = 0;
        const maxAttempts = 100;

        do {
          chosenType = getRandomPlayableTileType();
          attempts++;
        } while (this.checkForMatchAtInitialization(x, y, chosenType) && attempts < maxAttempts);

        this.grid[x][y] = new Tile(chosenType);
      }
    }
  }

  /**
   * Controlla se un blocco a (x,y) di un certo tipo creerebbe un match durante l'inizializzazione
   */
  private checkForMatchAtInitialization(x: number, y: number, type: TileType): boolean {
    // Controlla orizzontalmente
    if (x >= 2) {
      const left1 = this.grid[x - 1][y];
      const left2 = this.grid[x - 2][y];
      if (left1 && left1.type === type && left2 && left2.type === type) {
        return true;
      }
    }

    // Controlla verticalmente
    if (y >= 2) {
      const up1 = this.grid[x][y - 1];
      const up2 = this.grid[x][y - 2];
      if (up1 && up1.type === type && up2 && up2.type === type) {
        return true;
      }
    }

    return false;
  }

  /**
   * --- LOGICA DI SWAP ---
   */

  /**
   * Verifica se uno swap è valido e crea un match
   */
  canSwap(x1: number, y1: number, x2: number, y2: number): boolean {
    // Controlla se le coordinate sono valide
    if (!this.isValidCoordinate(x1, y1) || !this.isValidCoordinate(x2, y2)) {
      return false;
    }

    // Controlla se le tessere sono adiacenti (orizzontalmente o verticalmente)
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
      return false;
    }

    // Non si possono scambiare ostacoli o celle vuote
    const tile1 = this.grid[x1][y1];
    const tile2 = this.grid[x2][y2];
    if (!tile1 || !tile1.isPlayable() || !tile2 || !tile2.isPlayable()) {
      return false;
    }

    // Simula lo swap e controlla se crea un match
    this.swapTilesInternal(x1, y1, x2, y2);
    const createsMatch = this.findAllMatches().length > 0;
    this.swapTilesInternal(x1, y1, x2, y2); // Annulla lo swap

    return createsMatch;
  }

  /**
   * Esegue uno swap tra due tessere
   */
  swapTiles(x1: number, y1: number, x2: number, y2: number): boolean {
    if (this.canSwap(x1, y1, x2, y2)) {
      this.swapTilesInternal(x1, y1, x2, y2);
      return true;
    }
    return false;
  }

  /**
   * Scambia internamente due tessere (senza validazione)
   */
  private swapTilesInternal(x1: number, y1: number, x2: number, y2: number): void {
    const temp = this.grid[x1][y1];
    this.grid[x1][y1] = this.grid[x2][y2];
    this.grid[x2][y2] = temp;
  }

  /**
   * --- LOGICA DI MATCH DETECTION ---
   */

  /**
   * Trova tutti i match sulla griglia
   * Ritorna un array di array di coordinate, dove ogni array rappresenta un match
   */
  findAllMatches(): Coordinate[][] {
    const allMatches: Coordinate[][] = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const currentTile = this.grid[x][y];
        if (!currentTile || !currentTile.isPlayable()) continue;

        // Controlla match orizzontali
        const horizontalMatch = this.getMatch(x, y, 1, 0);
        if (horizontalMatch.length >= 3) {
          allMatches.push(horizontalMatch);
        }

        // Controlla match verticali
        const verticalMatch = this.getMatch(x, y, 0, 1);
        if (verticalMatch.length >= 3) {
          allMatches.push(verticalMatch);
        }
      }
    }

    return allMatches;
  }

  /**
   * Trova un match partendo da una coordinata in una direzione specifica
   * @param x Coordinata X di partenza
   * @param y Coordinata Y di partenza
   * @param dx Direzione X (1 per destra, -1 per sinistra, 0 per verticale)
   * @param dy Direzione Y (1 per giù, -1 per su, 0 per orizzontale)
   */
  private getMatch(x: number, y: number, dx: number, dy: number): Coordinate[] {
    const match: Coordinate[] = [];
    const startTile = this.grid[x][y];

    if (!startTile || !startTile.isPlayable()) return match;

    // Controlla in una direzione
    for (let i = 0; ; i++) {
      const currentX = x + i * dx;
      const currentY = y + i * dy;

      if (
        this.isValidCoordinate(currentX, currentY) &&
        this.grid[currentX][currentY] &&
        this.grid[currentX][currentY]!.type === startTile.type
      ) {
        match.push({ x: currentX, y: currentY });
      } else {
        break;
      }
    }

    // Controlla nella direzione opposta (per match centrali)
    for (let i = 1; ; i++) {
      const currentX = x - i * dx;
      const currentY = y - i * dy;

      if (
        this.isValidCoordinate(currentX, currentY) &&
        this.grid[currentX][currentY] &&
        this.grid[currentX][currentY]!.type === startTile.type
      ) {
        match.unshift({ x: currentX, y: currentY }); // Inserisci all'inizio
      } else {
        break;
      }
    }

    return match;
  }

  /**
   * --- LOGICA DI RISOLUZIONE ---
   */

  /**
   * Processa i match: rimuove le tessere, crea blocchi speciali, applica gravità e ricarica
   * Ritorna le coordinate delle tessere matchate
   */
  processMatches(): Coordinate[] {
    const allMatches = this.findAllMatches();

    if (allMatches.length === 0) {
      return [];
    }

    // Crea un Set di coordinate matchate per evitare duplicati
    const matchedCoordinates = new Set<string>();
    allMatches.forEach((match) => {
      match.forEach((coord) => {
        matchedCoordinates.add(`${coord.x},${coord.y}`);
      });
    });

    // Logica per generare tessere speciali prima di rimuovere quelle matchate
    allMatches.forEach((match) => {
      if (match.length === 4) {
        // Match da 4 in linea = Elemento striato
        const specialTileCoord = match[Math.floor(Math.random() * match.length)];
        const tile = this.grid[specialTileCoord.x][specialTileCoord.y];
        if (tile) {
          tile.specialType = SpecialBlockType.Striped;
        }
      } else if (match.length >= 5) {
        // Match da 5 in linea = Unicorno Arcobaleno
        const specialTileCoord = match[Math.floor(Math.random() * match.length)];
        const tile = this.grid[specialTileCoord.x][specialTileCoord.y];
        if (tile) {
          tile.specialType = SpecialBlockType.RainbowUnicorn;
        }
      }
      // TODO: Implementare logica per match a L o T per la bomba
    });

    // Rimuovi le tessere matchate
    matchedCoordinates.forEach((coordStr) => {
      const [x, y] = coordStr.split(',').map(Number);
      this.grid[x][y] = null;
    });

    // Applica gravità e ricarica
    this.applyGravity();
    this.refillBoard();

    // Ritorna le coordinate come array
    return Array.from(matchedCoordinates).map((coordStr) => {
      const [x, y] = coordStr.split(',').map(Number);
      return { x, y };
    });
  }

  /**
   * Applica la gravità: fa cadere le tessere verso il basso
   */
  private applyGravity(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.grid[x][y] === null) {
          // Trovato uno spazio vuoto
          for (let y2 = y + 1; y2 < this.height; y2++) {
            if (this.grid[x][y2] !== null) {
              // Trovata una tessera sopra
              this.grid[x][y] = this.grid[x][y2];
              this.grid[x][y2] = null;
              break;
            }
          }
        }
      }
    }
  }

  /**
   * Ricarica la griglia: riempie gli spazi vuoti con nuove tessere casuali
   */
  private refillBoard(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.grid[x][y] === null) {
          this.grid[x][y] = new Tile(getRandomPlayableTileType());
        }
      }
    }
  }

  /**
   * --- METODI UTILITY ---
   */

  /**
   * Ottiene una copia della griglia (per debug o snapshot)
   */
  getGridSnapshot(): (Tile | null)[][] {
    return this.grid.map((row) => row.map((tile) => (tile ? tile.clone() : null)));
  }

  /**
   * Resetta la griglia
   */
  reset(): void {
    this.grid = Array(this.width)
      .fill(null)
      .map(() => Array(this.height).fill(null));
  }

  /**
   * Verifica se ci sono ancora possibili mosse sulla griglia
   */
  hasAvailableMoves(): boolean {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        // Controlla swap con il vicino a destra
        if (x < this.width - 1 && this.canSwap(x, y, x + 1, y)) {
          return true;
        }
        // Controlla swap con il vicino in basso
        if (y < this.height - 1 && this.canSwap(x, y, x, y + 1)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Conta il numero di tessere di un tipo specifico sulla griglia
   */
  countTileType(tileType: TileType): number {
    let count = 0;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const tile = this.grid[x][y];
        if (tile && tile.type === tileType) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Calcola il punteggio per un match (numero di tessere * moltiplicatore)
   */
  static calculateMatchScore(matchLength: number): number {
    if (matchLength < 3) return 0;
    if (matchLength === 3) return 10;
    if (matchLength === 4) return 25;
    if (matchLength >= 5) return 50;
    return 0;
  }
}
