import dotenv from 'dotenv';
import axios from 'axios';
import nodemailer from 'nodemailer';
import * as service from '../../services/Giving.service.js';

dotenv.config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''
const PAGE_LOGO =  process.env.PAGELOGO || ''

export const verify_paystack_transaction_view = async (req, res) => {
    const { reference } = req.query;

    try {

        // Verify Payment with Paystack
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }, // Replace with your secret key
        });

        const paymentData = response.data.data;

        const data = {
            reference: paymentData.reference,
            paystack_reference: paymentData.id,
            email: paymentData.customer.email,
            first_name: paymentData.first_name || paymentData.metadata?.first_name || null,
            last_name: paymentData.last_name|| paymentData.metadata?.last_name || null,
            phone: paymentData.customer.phone || paymentData.metadata?.phone || null,
            amount: paymentData.amount / 100, //convert to naira
            status: paymentData.status,
            payment_channel: paymentData.channel,
            currency: paymentData.currency,
            payment_type: getPaymentType(paymentData)
        }


        // Create giving record
        const result = await service.create(data);

        if (result) {


            // Dynamically generate base URL from the request
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            // Send tracking email
            await sendTrackingEmail(result, baseUrl);

            res.status(200).json({ success: true, message: 'Payment received Successfully! You can also check your e-mail for comfimation' });
        } else {
            res.status(400).json({ success: false, error: result.error.message });
        }
    } catch (error) {
        console.log(error)
        console.error('Error verifying transaction:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getPayStackPublicKey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            public_key: process.env.PAYSTACK_PUBLIC_KEY
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payment configuration'
        });
    }
};

//HELPER
function getPaymentType(paymentData) {
    try {
        // 1. Check if payment_type is directly in metadata (some implementations)
        if (paymentData.metadata?.payment_type) {
            return paymentData.metadata.payment_type;
        }

        // 2. Check custom_fields array (your current implementation)
        if (Array.isArray(paymentData.metadata?.custom_fields)) {
            const paymentTypeField = paymentData.metadata.custom_fields.find(
                field => field.variable_name === 'payment_type'
            );
            if (paymentTypeField?.value) {
                return paymentTypeField.value;
            }
        }

        // 3. Fallback to Paystack's channel (card, bank, ussd, etc.)
        return paymentData.channel || 'unknown';
    } catch (error) {
        console.error('Error extracting payment type:', error);
        return 'unknown';
    }
}

async function sendTrackingEmail(result, baseUrl) {
    try {
        // Configure Nodemailer transport for Zoho Mail
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465, // Use 587 for TLS, or 465 for SSL
            secure: true, // Set true for SSL, false for TLS
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD,
            },

        });

        // Generate tracking link dynamically
        const trackingLink = `${baseUrl}/giving/giving-status?ref_id=${result.id}`;

        // Email content
        const mailOptions = {
            from: `"Glory Carriers Ministry Int'l" <${process.env.ZOHO_EMAIL}>`,
            to: result.email,
            subject: 'Your Giving Receipt & Tracking Information',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                        <h2 style="color: #2c3e50;">Thank You for Your Generosity</h2>
                        <img src="${PAGE_LOGO}" alt="Glory Carriers Logo" style="height: 80px;">
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear ${result.first_name || 'Beloved'},</p>
                        
                        <p>We have successfully received your giving of <strong>₦${result.amount}</strong> to Glory Carriers Ministry International.</p>
                        
                        <div style="background-color: #f1f8fe; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Giving Details</h3>
                            <p><strong>Reference Number:</strong> ${result.reference}</p>
                            <p><strong>Paystack Transaction ID:</strong> ${result.paystack_reference || 'Not available'}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <!--<p>You can track your giving status here: 
                            <a href="${trackingLink}" style="color: #3498db; text-decoration: none;">
                                Track My Giving
                            </a>
                        </p>-->
                        
                        <h3>Need Help?</h3>
                        <p>If you have any questions about your giving:</p>
                        <ul>
                            <li>For payment issues, contact Paystack support at <a href="mailto:support@paystack.com">support@paystack.com</a> with your transaction ID</li>
                            <li>For ministry-related questions, contact us at <a href="mailto:support@glorycarriersministryintl.org">support@glorycarriersministryintl.org</a></li>
                        </ul>
                        
                        <p style="font-style: italic;">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."<br>
                        - 2 Corinthians 9:7</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d;">
                        <p>Glory Carriers Ministry International</p>
                        <p>${new Date().getFullYear()} © All Rights Reserved</p>
                    </div>
                </div>
            `};

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Tracking email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending tracking email:', error.message);
    }
}