/**
 * api/create-checkout-session.ts
 * Endpoint serverless per creare una sessione di checkout Stripe
 * 
 * Utilizzo:
 * POST /api/create-checkout-session
 * Body: { productId: string, productName: string, price: number, email: string }
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface CheckoutRequest {
  productId: string;
  productName: string;
  price: number;
  email: string;
}

export default async function handler(req: any, res: any) {
  // Accetta solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, productName, price, email }: CheckoutRequest = req.body;

    // Validazione input
    if (!productId || !productName || !price || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: `Acquisto per Sweet & Dream Match-3`,
              images: ['https://via.placeholder.com/400x400?text=Sweet+Dream'],
            },
            unit_amount: Math.round(price * 100), // Stripe usa centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&productId=${productId}`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/cancel`,
      customer_email: email,
      metadata: {
        productId,
        productName,
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
