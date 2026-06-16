/**
 * api/verify-payment.ts
 * Endpoint per verificare che il pagamento sia stato completato
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, productId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // Recupera la sessione da Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      console.log('✅ Pagamento verificato:', {
        sessionId,
        productId,
        email: session.customer_email,
        amount: session.amount_total,
        timestamp: new Date().toISOString(),
      });

      // TODO: Salva la transazione nel database
      // TODO: Attiva il prodotto per l'utente
      // TODO: Invia email di conferma

      return res.status(200).json({
        success: true,
        message: 'Pagamento verificato',
        productId,
        email: session.customer_email,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Pagamento non completato',
      });
    }
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: error.message });
  }
}
