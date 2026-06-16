/**
 * AdBannerComponent.tsx
 * Componente per l'integrazione di Google AdSense
 * Mostra banner pubblicitari reali (top banner e sidebar)
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

    // Lo script di AdSense è già caricato in index.html
    // Qui prova a renderizzare gli ad
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.log('AdSense non è disponibile');
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
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height
      }}
    >
      {/* Google AdSense Banner Reale */}
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        data-ad-client="ca-pub-9477147027356354"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

/**
 * Banner orizzontale (728x90)
 */
export const HorizontalAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="horizontal"
    slot="1234567890"
    isProUser={isProUser}
    className="w-full"
  />
);

/**
 * Banner quadrato (300x250)
 */
export const SquareAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="square"
    slot="0987654321"
    isProUser={isProUser}
  />
);

/**
 * Banner verticale (300x600)
 */
export const VerticalAdBanner: React.FC<{ isProUser?: boolean }> = ({ isProUser = false }) => (
  <AdBannerComponent
    type="vertical"
    slot="5555555555"
    isProUser={isProUser}
  />
);
