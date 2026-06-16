/**
 * SuccessPage.tsx
 * Pagina di successo dopo il pagamento Stripe
 */

import React, { useEffect, useState } from 'react';

export const SuccessPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const productId = params.get('productId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Sessione di pagamento non trovata');
        setLoading(false);
        return;
      }

      try {
        // Verifica il pagamento con il backend
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, productId }),
        });

        if (!response.ok) {
          throw new Error('Errore nella verifica del pagamento');
        }

        const data = await response.json();
        
        // Salva il prodotto acquistato nel localStorage
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push({
          productId,
          timestamp: new Date().toISOString(),
          sessionId,
        });
        localStorage.setItem('purchases', JSON.stringify(purchases));

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <p className="text-2xl font-bold text-purple-700">Elaborazione pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-400 text-center max-w-md">
          <p className="text-5xl mb-4">❌</p>
          <p className="text-2xl font-bold text-red-600 mb-2">Errore nel Pagamento</p>
          <p className="text-gray-700 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Torna al Gioco
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-green-400 text-center max-w-md">
        <p className="text-6xl mb-4">✅</p>
        <p className="text-3xl font-bold text-green-600 mb-2">Pagamento Riuscito!</p>
        <p className="text-gray-700 mb-2">Grazie per il tuo acquisto!</p>
        <p className="text-sm text-gray-500 mb-6">
          Il tuo prodotto è stato aggiunto al tuo account.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
        >
          Torna al Gioco
        </a>
      </div>
    </div>
  );
};

export default SuccessPage;
