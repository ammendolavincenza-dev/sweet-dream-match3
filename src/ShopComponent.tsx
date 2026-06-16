/**
 * ShopComponent.tsx
 * Componente React per il negozio di gioco
 * Gestisce gli acquisti in-app: rimozione pubblicità, mosse extra, potenziamenti
 * 
 * Simula l'integrazione con Stripe/PayPal
 * Per attivare i veri pagamenti:
 * 1. Registrati su Stripe (https://stripe.com) o PayPal (https://paypal.com)
 * 2. Installa la libreria: npm install @stripe/react-stripe-js @stripe/js
 * 3. Sostituisci la simulazione con i veri endpoint di pagamento
 */

import React, { useState } from 'react';

/**
 * Interfaccia per un prodotto del negozio
 */
interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in EUR/USD
  icon: string;
  type: 'ad-removal' | 'moves' | 'boost' | 'premium';
  value?: number; // Per mosse extra o boost
  duration?: number; // In giorni, per abbonamenti
}

interface ShopComponentProps {
  isProUser: boolean;
  onPurchase: (productId: string, productType: string) => void;
  onRemoveAds: () => void;
  onAddMoves: (moves: number) => void;
  currentMoves?: number;
}

/**
 * Catalogo dei prodotti del negozio
 */
const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'remove-ads-lifetime',
    name: 'Rimuovi Pubblicità',
    description: 'Gioca senza pubblicità per sempre',
    price: 4.99,
    icon: '🚫',
    type: 'ad-removal',
    duration: 999 // Lifetime
  },
  {
    id: 'moves-50',
    name: '+50 Mosse',
    description: 'Aggiungi 50 mosse al tuo gioco',
    price: 2.99,
    icon: '➕',
    type: 'moves',
    value: 50
  },
  {
    id: 'moves-100',
    name: '+100 Mosse',
    description: 'Aggiungi 100 mosse al tuo gioco',
    price: 4.99,
    icon: '➕',
    type: 'moves',
    value: 100
  },
  {
    id: 'moves-250',
    name: '+250 Mosse',
    description: 'Aggiungi 250 mosse al tuo gioco',
    price: 9.99,
    icon: '➕',
    type: 'moves',
    value: 250
  },
  {
    id: 'boost-combo',
    name: 'Boost Combo',
    description: 'Moltiplicatore di punti 2x per 1 ora',
    price: 1.99,
    icon: '⚡',
    type: 'boost',
    duration: 1
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensile',
    description: 'Accesso premium + mosse illimitate per 30 giorni',
    price: 9.99,
    icon: '👑',
    type: 'premium',
    duration: 30
  }
];

/**
 * Componente per un singolo prodotto nel negozio
 */
const ShopProductCard: React.FC<{
  product: ShopProduct;
  isProUser: boolean;
  onBuy: (product: ShopProduct) => void;
  isLoading: boolean;
}> = ({ product, isProUser, onBuy, isLoading }) => {
  // Nascondi il prodotto "Rimuovi pubblicità" se l'utente è già PRO
  if (product.type === 'ad-removal' && isProUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
      {/* Icona del prodotto */}
      <div className="text-5xl mb-3 text-center">{product.icon}</div>

      {/* Nome e descrizione */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        {product.description}
      </p>

      {/* Dettagli aggiuntivi */}
      {product.value && (
        <div className="bg-blue-50 rounded-lg p-2 mb-4 text-center">
          <p className="text-sm font-semibold text-blue-700">
            {product.value} mosse
          </p>
        </div>
      )}

      {product.duration && product.duration !== 999 && (
        <div className="bg-green-50 rounded-lg p-2 mb-4 text-center">
          <p className="text-sm font-semibold text-green-700">
            {product.duration} giorno{product.duration > 1 ? 'i' : ''}
          </p>
        </div>
      )}

      {/* Prezzo e pulsante */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-purple-600">
          €{product.price.toFixed(2)}
        </div>
        <button
          onClick={() => onBuy(product)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isLoading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? '⏳ Elaborazione...' : '🛒 Acquista'}
        </button>
      </div>
    </div>
  );
};

/**
 * Componente principale del negozio
 */
export const ShopComponent: React.FC<ShopComponentProps> = ({
  isProUser,
  onPurchase,
  onRemoveAds,
  onAddMoves,
  currentMoves = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  /**
   * Gestisce l'acquisto di un prodotto
   * Simula il processo di pagamento
   */
  const handleBuyProduct = async (product: ShopProduct) => {
    setSelectedProduct(product);
    setIsLoading(true);

    // Simula il delay della transazione
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simula il successo del pagamento
    const success = Math.random() > 0.1; // 90% di probabilità di successo

    if (success) {
      // Applica l'effetto dell'acquisto
      switch (product.type) {
        case 'ad-removal':
          onRemoveAds();
          break;
        case 'moves':
          if (product.value) {
            onAddMoves(product.value);
          }
          break;
        case 'boost':
          // TODO: Implementare logica di boost
          console.log('Boost attivato:', product.name);
          break;
        case 'premium':
          // TODO: Implementare logica premium
          console.log('Premium attivato:', product.name);
          break;
      }

      // Notifica il parent
      onPurchase(product.id, product.type);

      // Mostra il messaggio di successo
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setIsOpen(false);
        setSelectedProduct(null);
      }, 2000);
    } else {
      // Simula errore di pagamento
      alert('❌ Pagamento fallito. Riprova.');
    }

    setIsLoading(false);
    setPaymentMethod(null);
  };

  return (
    <>
      {/* Pulsante per aprire il negozio */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center text-3xl z-40"
        title="Apri il negozio"
      >
        🛍️
      </button>

      {/* Modal del negozio */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-3xl font-bold">🛍️ Negozio</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            {/* Messaggio di successo */}
            {purchaseSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4 rounded">
                <p className="font-bold">✅ Acquisto completato!</p>
                <p>Grazie per il tuo supporto!</p>
              </div>
            )}

            {/* Selezione metodo di pagamento */}
            {selectedProduct && !purchaseSuccess && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 m-4 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  Scegli il metodo di pagamento
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      paymentMethod === 'stripe'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    💳 Stripe
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      paymentMethod === 'paypal'
                        ? 'bg-blue-700 text-white'
                        : 'bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    🅿️ PayPal
                  </button>
                </div>

                {paymentMethod && (
                  <button
                    onClick={() => handleBuyProduct(selectedProduct)}
                    disabled={isLoading}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? '⏳ Elaborazione pagamento...' : '✓ Conferma acquisto'}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setPaymentMethod(null);
                  }}
                  disabled={isLoading}
                  className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annulla
                </button>
              </div>
            )}

            {/* Griglia dei prodotti */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOP_PRODUCTS.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    isProUser={isProUser}
                    onBuy={handleBuyProduct}
                    isLoading={isLoading && selectedProduct?.id === product.id}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 border-t-2 border-gray-200 text-center text-sm text-gray-600">
              <p>💳 I pagamenti sono sicuri e elaborati tramite Stripe/PayPal</p>
              <p className="mt-2">📧 Per supporto: support@sweetdream-match3.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopComponent;
