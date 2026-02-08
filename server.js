require('dotenv').config();
const express = require('express');
const app = express();

if (!process.env.STRIPE_PRIVATE_KEY) {
    console.error("ERREUR FATALE : La clé STRIPE_PRIVATE_KEY est introuvable dans le fichier .env");
    process.exit(1);
} const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(express.static('public'));
app.use(express.json());

// --- LA LISTE DES PRIX (ORIGINALE) ---
const storeItems = new Map([
    // Art de la table
    ['carafe', { priceInCents: 3000, name: 'Carafe Eau' }],
    ['gourde', { priceInCents: 3400, name: 'Gourde Design' }],
    ['poisson', { priceInCents: 4000, name: 'Carafe Poisson' }],

    // Lin
    ['abricot', { priceInCents: 300, name: 'Savon Abricot' }],
    ['original', { priceInCents: 500, name: 'Savon Original' }],
    ['détachant', { priceInCents: 600, name: 'Savon Détachant' }],

    // Lumière
    ['lampe', { priceInCents: 14000, name: 'Lampe Archi' }],
    ['suspension', { priceInCents: 8900, name: 'Suspension Zen' }],

    // Brut
    ['chaise', { priceInCents: 25000, name: 'Chaise Chêne' }],
    ['banc', { priceInCents: 18000, name: 'Banc Entrée' }],

    // Vintage
    ['miroir', { priceInCents: 12000, name: 'Miroir Doré' }],
    ['vase', { priceInCents: 4500, name: 'Vase Orange 70s' }],
]);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.cart.map(item => {
                const storeItem = storeItems.get(item.id);
                if (!storeItem) throw new Error(`Article inconnu : ${item.name}`);
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: { name: storeItem.name },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.qty || 1,
                };
            }),
            // FRAIS DE PORT (5€)
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 500, currency: 'eur' },
                        display_name: 'Livraison Standard',
                        delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 5 } },
                    },
                },
            ],
            success_url: `${process.env.SERVER_URL || 'http://localhost:3000'}/success.html`,
            cancel_url: `${process.env.SERVER_URL || 'http://localhost:3000'}/index.html`,
        });
        res.json({ url: session.url });
    } catch (e) {
        console.error("Erreur Paiement :", e.message);
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Serveur lancé sur http://localhost:3000");
    console.log("💳 Prêt à accepter les paiements (ORIGINAL)");
});