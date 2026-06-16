/**
 * TileType.ts
 * Traduzione TypeScript del file C# TileType.cs
 * Definisce i tipi di tessere disponibili nel gioco Match-3 "Sweet & Dream"
 */

/**
 * Enum che rappresenta i tipi di tessere disponibili sulla griglia
 */
export enum TileType {
  None = 0,           // Cella vuota o non valida
  ZuccheroFilato = 1, // Zucchero filato (rosa/azzurro)
  PannaMontata = 2,   // Panna montata (bianca)
  NuvolaDolce = 3,    // Nuvola dolce (azzurra/rosa)
  UnicornoMagico = 4, // Unicorno magico (arcobaleno)
  CaramellaRosa = 5,  // Caramella rosa
  Ostacolo = 6        // Ostacolo (trappola da distruggere)
}

/**
 * Enum che rappresenta i tipi speciali di blocchi creati da match
 */
export enum SpecialBlockType {
  None = 0,
  Striped = 1,        // Blocco striato (distrugge riga/colonna)
  Bomb = 2,           // Bomba (esplosione 3x3)
  RainbowUnicorn = 3  // Unicorno arcobaleno (distrugge tutti dello stesso tipo)
}

/**
 * Classe che rappresenta una singola tessera sulla griglia
 */
export class Tile {
  type: TileType;
  specialType: SpecialBlockType;

  constructor(type: TileType, specialType: SpecialBlockType = SpecialBlockType.None) {
    this.type = type;
    this.specialType = specialType;
  }

  /**
   * Verifica se la tessera è giocabile (non è vuota né un ostacolo)
   */
  isPlayable(): boolean {
    return this.type !== TileType.None && this.type !== TileType.Ostacolo;
  }

  /**
   * Crea una copia della tessera
   */
  clone(): Tile {
    return new Tile(this.type, this.specialType);
  }

  /**
   * Restituisce una descrizione testuale del tipo di tessera
   */
  getTypeName(): string {
    switch (this.type) {
      case TileType.ZuccheroFilato:
        return "Zucchero Filato";
      case TileType.PannaMontata:
        return "Panna Montata";
      case TileType.NuvolaDolce:
        return "Nuvola Dolce";
      case TileType.UnicornoMagico:
        return "Unicorno Magico";
      case TileType.CaramellaRosa:
        return "Caramella Rosa";
      case TileType.Ostacolo:
        return "Ostacolo";
      case TileType.None:
      default:
        return "Vuoto";
    }
  }

  /**
   * Restituisce una descrizione testuale del tipo speciale
   */
  getSpecialTypeName(): string {
    switch (this.specialType) {
      case SpecialBlockType.Striped:
        return "Striato";
      case SpecialBlockType.Bomb:
        return "Bomba";
      case SpecialBlockType.RainbowUnicorn:
        return "Unicorno Arcobaleno";
      case SpecialBlockType.None:
      default:
        return "Normale";
    }
  }
}

/**
 * Funzione di utilità per ottenere tutti i tipi di tessere giocabili
 */
export function getPlayableTileTypes(): TileType[] {
  return [
    TileType.ZuccheroFilato,
    TileType.PannaMontata,
    TileType.NuvolaDolce,
    TileType.UnicornoMagico,
    TileType.CaramellaRosa
  ];
}

/**
 * Funzione di utilità per ottenere un tipo di tessera casuale
 */
export function getRandomPlayableTileType(): TileType {
  const playableTypes = getPlayableTileTypes();
  return playableTypes[Math.floor(Math.random() * playableTypes.length)];
}
