const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseURL = process.env.PAYPAL_BASE_URL; // change to api-m.paypal.com for live

// Get access token
router.post('/create-order', async (req, res) => {
    try {
        const { price, currency = "USD" } = req.body;
        const { data: auth } = await axios({
            url: `${baseURL}/v1/oauth2/token`,
            method: 'post',
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: 'grant_type=client_credentials',
        });

        // Billing and shipping address not required, so do not include them in the order payload
        const { data: order } = await axios({
            url: `${baseURL}/v2/checkout/orders`,
            method: 'post',
            headers: {
                Authorization: `Bearer ${auth.access_token}`,
                'Content-Type': 'application/json',
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: parseFloat(price).toFixed(2).toString(),
                    },
                    // No shipping or billing address fields included
                }],
                application_context: {
                    shipping_preference: "NO_SHIPPING" // Explicitly tell PayPal not to require shipping address
                }
            },
        });

        res.json({
            ...order,
            used_currency: currency
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
