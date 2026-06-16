/**
 * ShopComponentStripe.tsx
 * Componente React per il negozio di gioco con integrazione Stripe
 * Gestisce gli acquisti in-app con pagamenti reali
 */

import React, { useState } from 'react';
// import { loadStripe } from '@stripe/js';

// Carica Stripe dinamicamente dal CDN
const loadStripe = async (key: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      resolve((window as any).Stripe(key));
    };
    document.head.appendChild(script);
  });
};

/**
 * Interfaccia per un prodotto del negozio
 */
interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in EUR
  icon: string;
  type: 'ad-removal' | 'moves' | 'boost' | 'premium';
  value?: number;
  duration?: number;
}

interface ShopComponentProps {
  isProUser: boolean;
  onPurchase: (productId: string, productType: string) => void;
  onRemoveAds: () => void;
  onAddMoves: (moves: number) => void;
  currentMoves?: number;
  userEmail?: string;
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
    duration: 999,
  },
  {
    id: 'moves-50',
    name: '+50 Mosse',
    description: 'Aggiungi 50 mosse al tuo gioco',
    price: 2.99,
    icon: '➕',
    type: 'moves',
    value: 50,
  },
  {
    id: 'moves-100',
    name: '+100 Mosse',
    description: 'Aggiungi 100 mosse al tuo gioco',
    price: 4.99,
    icon: '➕',
    type: 'moves',
    value: 100,
  },
  {
    id: 'moves-250',
    name: '+250 Mosse',
    description: 'Aggiungi 250 mosse al tuo gioco',
    price: 9.99,
    icon: '➕',
    type: 'moves',
    value: 250,
  },
  {
    id: 'boost-combo',
    name: 'Boost Combo',
    description: 'Moltiplicatore di punti 2x per 1 ora',
    price: 1.99,
    icon: '⚡',
    type: 'boost',
    duration: 1,
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensile',
    description: 'Accesso premium + mosse illimitate per 30 giorni',
    price: 9.99,
    icon: '👑',
    type: 'premium',
    duration: 30,
  },
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
  if (product.type === 'ad-removal' && isProUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
      <div className="text-5xl mb-3 text-center">{product.icon}</div>

      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        {product.description}
      </p>

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
          {isLoading ? '⏳ Elaborazione...' : '💳 Acquista'}
        </button>
      </div>
    </div>
  );
};

/**
 * Componente principale del negozio con Stripe
 */
export const ShopComponentStripe: React.FC<ShopComponentProps> = ({
  isProUser,
  onPurchase,
  onRemoveAds,
  onAddMoves,
  currentMoves = 0,
  userEmail = 'user@example.com',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  /**
   * Gestisce l'acquisto di un prodotto con Stripe
   */
  const handleBuyProduct = async (product: ShopProduct) => {
    setSelectedProduct(product);
    setIsLoading(true);

    try {
      // 1. Crea la sessione di checkout su Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella creazione della sessione di pagamento');
      }

      const { sessionId } = await response.json();

      // 2. Carica Stripe e reindirizza al checkout
      // Ottieni la chiave da una variabile globale o dal localStorage
      const stripeKey = (window as any).__STRIPE_KEY__ || localStorage.getItem('stripe_key') || 'pk_test_YOUR_KEY_HERE';
      const stripe: any = await loadStripe(stripeKey);

      if (!stripe) {
        throw new Error('Stripe non è disponibile');
      }

      // Reindirizza a Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;


    } catch (error: any) {
      console.error('Errore nel pagamento:', error);
      alert(`❌ Errore: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetta il negozio
   */
  const handleReset = () => {
    setIsOpen(false);
    setSelectedProduct(null);
    setPurchaseSuccess(false);
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
                onClick={handleReset}
                className="text-2xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            {/* Messaggio di successo */}
            {purchaseSuccess && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4 rounded">
                <p className="font-bold">✅ Pagamento in elaborazione!</p>
                <p>Grazie per il tuo acquisto. Sarai reindirizzato a Stripe.</p>
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
              <p>💳 I pagamenti sono sicuri e elaborati tramite Stripe</p>
              <p className="mt-2">🔒 Le tue informazioni di pagamento non vengono mai salvate</p>
              <p className="mt-2">📧 Per supporto: support@sweetdream-match3.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopComponentStripe;
