# 🍭 Sweet & Dream Match-3 🦄

Un gioco Match-3 web-based con tema dolciumi e unicorni, costruito con React, TypeScript e Tailwind CSS.

## 📁 Struttura del Progetto

```
sweet-dream-match3/
├── TileType.ts              # Enum dei tipi di tessere e classe Tile
├── Match3Board.ts           # Logica pura della griglia di gioco
├── TileComponent.tsx        # Componente React per una singola tessera
├── BoardComponent.tsx       # Componente React per la griglia completa
├── App.tsx                  # Componente principale dell'applicazione
├── main.tsx                 # Entry point di React
├── index.html               # File HTML principale
├── index.css                # Stili globali
├── vite.config.ts           # Configurazione di Vite
├── tsconfig.json            # Configurazione di TypeScript
├── package.json             # Dipendenze del progetto
└── README.md                # Questo file
```

## 🎮 Caratteristiche

- **Logica pura in TypeScript:** La classe `Match3Board` contiene tutta la logica di gioco, indipendente da React
- **Componenti React riutilizzabili:** `TileComponent` e `BoardComponent` per la visualizzazione
- **Stile "sweet & dream":** Tailwind CSS con colori pastello, gradienti e animazioni
- **Tessere tematiche:** Zucchero Filato, Panna Montata, Nuvola Dolce, Unicorno Magico, Caramella Rosa
- **Blocchi speciali:** Striped, Bomb, RainbowUnicorn per match di 4+ tessere
- **Meccaniche di gioco:** Swap, match detection, gravity, refill
- **Interfaccia utente:** Punteggio, mosse rimanenti, selezione tessere

## 🚀 Come Avviare

### Prerequisiti
- Node.js 16+ e npm/pnpm

### Installazione

```bash
# Clona il repository o scarica i file
cd sweet-dream-match3

# Installa le dipendenze
npm install
# oppure
pnpm install
```

### Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev
# oppure
pnpm dev
```

Il sito si aprirà automaticamente su `http://localhost:5173`

### Build per la produzione

```bash
# Compila TypeScript e crea il bundle
npm run build
# oppure
pnpm build
```

I file compilati saranno in `dist/`

## 🎯 Come Giocare

1. **Seleziona una tessera** cliccandoci sopra
2. **Seleziona una tessera adiacente** per scambiarle
3. **Crea match di 3+ tessere** dello stesso tipo
4. **Guadagna punti** e accumula combo
5. **Usa le mosse** saggiamente per raggiungere il punteggio massimo

## 🛠️ Architettura

### Logica Pura (`Match3Board.ts`)
- `initializeBoard()`: Inizializza la griglia
- `canSwap()`: Verifica se uno swap è valido
- `findAllMatches()`: Trova tutti i match
- `processMatches()`: Rimuove match, crea blocchi speciali, applica gravità
- `hasAvailableMoves()`: Controlla se ci sono mosse possibili

### Componenti React
- **TileComponent:** Renderizza una singola tessera con emoji e effetti
- **BoardComponent:** Renderizza la griglia e gestisce la selezione
- **App:** Integra la logica di gioco con i componenti

## 🎨 Personalizzazione

### Cambiare i colori
Modifica `getTileColorClass()` in `TileComponent.tsx`

### Cambiare gli emoji
Modifica `getTileEmoji()` in `TileComponent.tsx`

### Cambiare le dimensioni della griglia
Modifica il costruttore di `Match3Board` in `App.tsx`:
```typescript
const newBoard = new Match3Board(8, 8); // 8x8 invece di 7x7
```

### Cambiare il numero di mosse
Modifica `setMoves()` in `App.tsx`:
```typescript
setMoves(50); // 50 mosse invece di 30
```

## 📦 Dipendenze

- **React 18:** Framework UI
- **TypeScript:** Linguaggio tipizzato
- **Vite:** Build tool veloce
- **Tailwind CSS:** Framework CSS utility-first

## 🌐 Deploy

### Vercel (Consigliato)
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build il progetto
npm run build

# Drag & drop la cartella 'dist' su Netlify
```

### GitHub Pages
```bash
# Modifica vite.config.ts
# base: '/sweet-dream-match3/'

npm run build
# Carica la cartella 'dist' su GitHub Pages
```

## 🔮 Prossimi Passi

- [ ] Aggiungere suoni e musica
- [ ] Implementare il sistema di livelli
- [ ] Aggiungere effetti particellari
- [ ] Implementare il salvataggio dei progressi
- [ ] Aggiungere animazioni di transizione
- [ ] Creare una leaderboard
- [ ] Supporto mobile touch

## 📄 Licenza

MIT

## 👨‍💻 Autore

Creato da **Manus AI**

---

Divertiti a giocare! 🎮✨
