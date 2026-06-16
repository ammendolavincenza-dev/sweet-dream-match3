# 💳 Guida Integrazione Stripe

Questa guida ti aiuterà a configurare Stripe per ricevere pagamenti reali sul tuo conto.

## 📋 Indice

1. [Registrazione Stripe](#registrazione-stripe)
2. [Ottenere le Chiavi API](#ottenere-le-chiavi-api)
3. [Configurare le Variabili d'Ambiente](#configurare-le-variabili-dambiente)
4. [Testare i Pagamenti](#testare-i-pagamenti)
5. [Passare a Produzione](#passare-a-produzione)
6. [Webhook Setup](#webhook-setup)

---

## 🔐 Registrazione Stripe

1. Vai a [stripe.com](https://stripe.com)
2. Clicca **"Registrati"** o **"Sign Up"**
3. Compila il modulo con:
   - Email
   - Password
   - Nome completo
   - Paese (Italia)
4. Verifica l'email
5. Completa il profilo aziendale

---

## 🔑 Ottenere le Chiavi API

1. Accedi al [Dashboard di Stripe](https://dashboard.stripe.com)
2. Vai a **Developers** → **API Keys** (in alto a destra)
3. Assicurati di essere in **Test Mode** (interruttore in alto a sinistra)
4. Copia:
   - **Publishable Key** (inizia con `pk_test_`) → `VITE_STRIPE_PUBLIC_KEY`
   - **Secret Key** (inizia con `sk_test_`) → `STRIPE_SECRET_KEY`

### ⚠️ Importante

- **Publishable Key**: Può essere pubblica (nel frontend)
- **Secret Key**: DEVE rimanere segreta (solo nel backend)
- **NON** condividere la Secret Key con nessuno

---

## ⚙️ Configurare le Variabili d'Ambiente

### Localmente (per sviluppo)

Crea un file `.env.local` nella root del progetto:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

### Su Vercel (per produzione)

1. Vai al [Dashboard di Vercel](https://vercel.com/dashboard)
2. Seleziona il progetto `sweet-dream-match3`
3. Vai a **Settings** → **Environment Variables**
4. Aggiungi le tre variabili:
   - `VITE_STRIPE_PUBLIC_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testare i Pagamenti

### Numeri di Carta di Test

Stripe fornisce numeri di carta per testare:

| Tipo | Numero | Scadenza | CVC |
|------|--------|----------|-----|
| Visa (successo) | 4242 4242 4242 4242 | 12/25 | 123 |
| Visa (fallimento) | 4000 0000 0000 0002 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |

### Passi per Testare

1. Avvia il gioco localmente: `npm run dev`
2. Clicca su 🛍️ (Negozio)
3. Seleziona un prodotto e clicca "Acquista"
4. Usa uno dei numeri di carta di test
5. Completa il pagamento

---

## 🚀 Passare a Produzione

### Passo 1: Ottenere le Chiavi di Produzione

1. Nel Dashboard di Stripe, disattiva **Test Mode**
2. Vai a **Developers** → **API Keys**
3. Copia:
   - **Publishable Key** (inizia con `pk_live_`)
   - **Secret Key** (inizia con `sk_live_`)

### Passo 2: Aggiornare le Variabili su Vercel

1. Nel Dashboard di Vercel, aggiorna le variabili:
   - `VITE_STRIPE_PUBLIC_KEY` → `pk_live_...`
   - `STRIPE_SECRET_KEY` → `sk_live_...`
2. Redeploy il progetto

### ⚠️ Attenzione

- Le chiavi di produzione riceveranno **veri pagamenti**
- Assicurati che il tuo conto bancario sia collegato
- Testa sempre in modalità test prima di passare a produzione

---

## 🔔 Webhook Setup

I webhook permettono a Stripe di notificare il tuo server quando un pagamento è completato.

### Configurare il Webhook

1. Nel Dashboard di Stripe, vai a **Developers** → **Webhooks**
2. Clicca **"Add endpoint"**
3. Inserisci l'URL: `https://sweet-dream-match3.vercel.app/api/webhook`
4. Seleziona gli eventi:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Clicca **"Add endpoint"**
6. Copia il **Signing Secret** (inizia con `whsec_`)
7. Aggiungi a Vercel come `STRIPE_WEBHOOK_SECRET`

### Testare il Webhook Localmente

```bash
# Installa Stripe CLI
brew install stripe/stripe-cli/stripe

# Accedi
stripe login

# Ascolta gli eventi
stripe listen --forward-to localhost:3000/api/webhook

# Copia il webhook secret e aggiungilo a .env.local
```

---

## 📊 Monitorare i Pagamenti

### Nel Dashboard di Stripe

1. Vai a **Payments** per vedere tutte le transazioni
2. Clicca su una transazione per i dettagli
3. Vedi lo stato, l'importo, la data, ecc.

### Nel Tuo Conto Bancario

I pagamenti vengono trasferiti al tuo conto bancario secondo la pianificazione di Stripe:
- **Modalità test**: Nessun trasferimento
- **Modalità produzione**: Trasferimenti giornalieri o settimanali (configurabile)

---

## 🆘 Risoluzione Problemi

### "Stripe non è disponibile"

- Verifica che `VITE_STRIPE_PUBLIC_KEY` sia impostato
- Controlla la console del browser per errori

### "Pagamento fallito"

- Verifica che `STRIPE_SECRET_KEY` sia impostato nel backend
- Controlla i log di Vercel: `vercel logs`

### "Webhook non ricevuto"

- Verifica che l'URL del webhook sia corretto
- Controlla i log nel Dashboard di Stripe → **Webhooks** → **Events**

---

## 📚 Risorse Utili

- [Documentazione Stripe](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

## ✅ Checklist Finale

- [ ] Account Stripe creato
- [ ] Chiavi API ottenute
- [ ] Variabili d'ambiente configurate
- [ ] Pagamenti testati in modalità test
- [ ] Webhook configurato
- [ ] Chiavi di produzione ottenute
- [ ] Variabili di produzione impostate su Vercel
- [ ] Primo pagamento reale ricevuto ✨

---

**Congratulazioni! Il tuo sistema di pagamenti è pronto!** 🎉
