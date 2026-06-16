/**
 * AdBannerComponent.tsx
 * Componente segnaposto per l'integrazione di Google AdSense
 * Simula banner pubblicitari (top banner e sidebar)
 * 
 * Per attivare le vere pubblicità:
 * 1. Registrati su Google AdSense (https://www.google.com/adsense/)
 * 2. Sostituisci 'ca-pub-xxxxxxxxxxxxxxxx' con il tuo ID editore
 * 3. Aggiungi il tag script di AdSense nell'index.html
 * 4. Rimuovi la simulazione e usa i veri tag AdSense
 */

import React, { useEffect } from 'react';

interface AdBannerComponentProps {
  type: 'horizontal' | 'vertical' | 'square';
  slot?: string; // Google AdSense slot ID
  isProUser?: boolean; // Se true, non mostra gli ad
  className?: string;
}

/**
 * Componente per banner pubblicitari
 * Supporta tre tipi: horizontal (728x90), vertical (300x600), square (300x250)
 */
export const AdBannerComponent: React.FC<AdBannerComponentProps> = ({
  type = 'horizontal',
  slot = '1234567890',
  isProUser = false,
  className = ''
}) => {
  useEffect(() => {
    // Se l'utente è un utente PRO, non caricare gli ad
    if (isProUser) return;

    // Carica lo script di Google AdSense se non è già caricato
    if (window.adsbygoogle === undefined) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Prova a renderizzare gli ad
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log('AdSense non è disponibile in modalità sviluppo');
    }
  }, [isProUser]);

  // Se l'utente è PRO, non mostrare nulla
  if (isProUser) {
    return null;
  }

  // Dimensioni dei banner
  const dimensions = {
    horizontal: { width: '728px', height: '90px' },
    vertical: { width: '300px', height: '600px' },
    square: { width: '300px', height: '250px' }
  };

  const { width, height } = dimensions[type];

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${className}`}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height
      }}
    >
      {/* Simulazione di banner pubblicitario (per sviluppo) */}
      <div className="text-center p-4">
        <div className="text-xs text-gray-500 mb-2">📢 Spazio Pubblicitario</div>
        <div className="text-sm font-semibold text-gray-600">
          Google AdSense
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Slot: {slot}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {width} × {height}
        </div>
      </div>

      {/* Tag reale di Google AdSense (commentato, attiva quando pronto) */}
      {/* 
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slot}
        data-ad-format={type === 'horizontal' ? 'horizontal' : type === 'vertical' ? 'vertical' : 'rectangle'}
        data-full-width-responsive="true"
      ></ins>
      */}
    </div>
  );
};

/**
 * Componente per banner pubblicitario orizzontale (728x90)
 * Tipicamente posizionato in alto o in basso
 */
export const HorizontalAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="horizontal"
    slot="1234567890"
    isProUser={isProUser}
    className="my-4"
  />
);

/**
 * Componente per banner pubblicitario quadrato (300x250)
 * Tipicamente posizionato nella sidebar
 */
export const SquareAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="square"
    slot="0987654321"
    isProUser={isProUser}
    className="mx-4"
  />
);

/**
 * Componente per banner pubblicitario verticale (300x600)
 * Tipicamente posizionato nella sidebar
 */
export const VerticalAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="vertical"
    slot="5555555555"
    isProUser={isProUser}
    className="mx-4"
  />
);

export default AdBannerComponent;
