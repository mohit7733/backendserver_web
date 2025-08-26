const express = require('express');
const axios = require('axios');
const router = express.Router();

const getAccessToken = async () => {

    try {
        const response = await axios({
            url: `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`,
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

        const data = response.data;
        const newAccessToken = data.access_token;
        return newAccessToken;

    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

const createOrder = async (req, res) => {
    const { amount, currency = "USD" } = req.body;
    try {
        // Validate amount parameter
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ error: 'Invalid amount. Amount must be a positive number.' });
        }
        const accessToken = await getAccessToken();
        const formattedAmount = parseFloat(amount).toFixed(2);
        const response = await axios({
            url: `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`,
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [{
                    items: [{
                        name: 'Web Guru Awards',
                        description: 'Web Guru Awards',
                        quantity: 1,
                        unit_amount: {
                            currency_code: currency,
                            value: formattedAmount,
                        },
                    }],
                    amount: {
                        currency_code: currency,
                        value: formattedAmount,
                        breakdown: {
                            item_total: {
                                currency_code: currency,
                                value: formattedAmount,
                            },
                        },
                    },
                }],
                payment_source: {
                    paypal: {
                        experience_context: {
                            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                            payment_method_selected: 'PAYPAL',
                            brand_name: 'Web Guru Awards',
                            shipping_preference: 'NO_SHIPPING',
                            locale: 'en-US',
                            landing_page: 'LOGIN',
                            user_action: 'PAY_NOW',
                            return_url: `${process.env.PAYPAL_REDIRECT_BASEURL}/paypal/success`,
                            cancel_url: `${process.env.PAYPAL_REDIRECT_BASEURL}/paypal/failed`,
                        },
                    },
                },
            },
        });
        const orderId = response.data.id;
        res.status(200).json({ orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
}



router.post('/createorder', createOrder);


module.exports = router;