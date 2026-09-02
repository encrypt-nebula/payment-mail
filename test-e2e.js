const fetch = global.fetch || require('node-fetch');
const SanskritNumbers = require('./public/sanskrit-numbers.js');

async function testGenerateReceipt() {
  console.log('Testing Receipt Generation API...');
  
  const testPayload = {
    name: 'श्री रमेश शर्मा',
    address: '१०२, साकेत नगर, इन्दौर (म.प्र.)',
    phone: '9876543210',
    email: 'harshah.2312.sharma@gmail.com',
    pan: 'ABCDE1234F',
    amount: 1200,
    paymentMode: 'UPI / QR Code',
    txnId: 'UPI-UTR-987654321012',
    bankName: 'Bank of India',
    date: '01/09/2026'
  };

  try {
    const res = await fetch('http://localhost:3000/api/generate-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });

    const result = await res.json();
    console.log('API Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('SUCCESS: Receipt generated with number:', result.receiptNo, '(', result.receiptNoDev, ')');
      console.log('Email delivery status:', result.emailSent ? 'SENT via Brevo' : 'FAILED');
    } else {
      console.error('FAILED:', result.error);
    }
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

testGenerateReceipt();
