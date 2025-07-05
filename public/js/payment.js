let paystackPublicKey = null;

async function getPaystackKey() {
  if (!paystackPublicKey) {
    try {
      const response = await fetch('/api/giving/paystack-key');
      const data = await response.json();
      
      if (data.success) {
        paystackPublicKey = data.public_key;
      } else {
        throw new Error('Failed to get payment key');
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      messageAlert(
        'Payment initialization failed:',
        'Unable to initialize payment. Please refresh and try again.',
        false,
        'text-warning',
        'btn-warning'
    );
      throw error;
    }
  }
  return paystackPublicKey;
}

function showPaymentSection() {
    document.querySelector('.payment-section').classList.remove('hidden');
    document.querySelector('.transfer-section').classList.add('hidden');
    document.querySelectorAll('.toggle-btn')[0].classList.add('active');
    document.querySelectorAll('.toggle-btn')[1].classList.remove('active');
}

function showTransferSection() {
    document.querySelector('.payment-section').classList.add('hidden');
    document.querySelector('.transfer-section').classList.remove('hidden');
    document.querySelectorAll('.toggle-btn')[0].classList.remove('active');
    document.querySelectorAll('.toggle-btn')[1].classList.add('active');
}


async function payWithPaystack() {
  try {
    const publicKey = await getPaystackKey();

    const paymentType = document.getElementById("paymentType").value;
    const amount = document.getElementById("amount").value;
    const email = document.getElementById("email").value;

    if (!paymentType || !amount || !email) {

        messageAlert(
            title = "Please Fill All Fields",
            message = 'all fields are required!',
            redirectTo = false,
            classType = "text-warning",
            btnType = "btn-warning",
        )
        //alert("Please fill all fields");
        return;
    }

    // Determine payment reference based on type
    let refPrefix = "GCMI-";
    switch (paymentType) {
        case "tithe": refPrefix += "TITHE-"; break;
        case "partnership": refPrefix += "PARTNER-"; break;
        case "project": refPrefix += "PROJECT-"; break;
        case "seed": refPrefix += "SEED-"; break;
    }

    const payload = {
        key: publicKey, // Replace with your Paystack public key
        email: email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: refPrefix + Date.now(),
        metadata: {
            custom_fields: [
                {
                    display_name: "Payment Type",
                    variable_name: "payment_type",
                    value: paymentType
                }
            ]
        }
    }
    
    const handler = PaystackPop.setup({
      ...payload,
      callback: function (response) {
        // Verify payment on server
        handlePaymentResponse(response);
      },
      onClose: function() {
        handlePaymentCancel();
      }
    });
    
    handler.openIframe();
  } catch (error) {
    console.error('Payment error:', error);
  }
}





function handlePaymentCancel() {
    messageAlert(
        'Payment Incomplete',
        'You closed the payment window. Try again?',
        false,
        'text-warning',
        'btn-warning'
    );
}

async function handlePaymentResponse(response) {
    try {
        const verification = await fetch(`/api/giving/verify-payment?reference=${response.reference}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await verification.json();

        if (data.success) {
            messageAlert(
                'Payment Successful',
                'Payment confirmed! Check your email for details.',
                false,
                'text-success',
                'btn-success'
            );
        } else {
          console.log(data.error)
            throw new Error(data.message || data.error || 'Verification failed');
        }
    } catch (error) {
        messageAlert(
            'Payment Error',
            error.message,
            false,
            'text-danger',
            'btn-danger'
        );
    }
}