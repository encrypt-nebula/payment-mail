const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const SanskritNumbers = require('./public/sanskrit-numbers.js');

const app = express();
const PORT = process.env.PORT || 3000;
const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';
const SENDER_EMAIL = 'harshah.2312.sharma@gmail.com'; // Verified Brevo sender
const SENDER_NAME = 'संस्कृतभारती, मालवा न्यास';
const ORG_EMAIL = 'sbmalva@gmail.com';

const COUNTER_FILE = path.join(__dirname, 'data', 'counter.json');
const RECEIPTS_FILE = path.join(__dirname, 'data', 'receipts.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get and increment persistent receipt counter
function getNextReceiptNumber() {
  try {
    if (!fs.existsSync(COUNTER_FILE)) {
      fs.writeFileSync(COUNTER_FILE, JSON.stringify({ lastReceiptNumber: 384 }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    const nextNumber = (data.lastReceiptNumber || 384) + 1;
    data.lastReceiptNumber = nextNumber;
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2));
    return nextNumber;
  } catch (err) {
    console.error('Error managing receipt counter:', err);
    return 001;
  }
}

function peekNextReceiptNumber() {
  try {
    if (!fs.existsSync(COUNTER_FILE)) {
      return 001;
    }
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    return (data.lastReceiptNumber || 384) + 1;
  } catch (err) {
    return 001;
  }
}

function saveReceiptRecord(record) {
  try {
    let receipts = [];
    if (fs.existsSync(RECEIPTS_FILE)) {
      receipts = JSON.parse(fs.readFileSync(RECEIPTS_FILE, 'utf8') || '[]');
    }
    receipts.push(record);
    fs.writeFileSync(RECEIPTS_FILE, JSON.stringify(receipts, null, 2));
  } catch (err) {
    console.error('Error saving receipt record:', err);
  }
}

// Brevo email sending function
async function sendReceiptEmail(receiptData, receiptImageBase64) {
  const receiptNoDev = SanskritNumbers.toDevanagariDigits(receiptData.receiptNo);
  const amountDev = SanskritNumbers.formatIndianCurrencyDevanagari(receiptData.amount);
  const dateDev = SanskritNumbers.toDevanagariDigits(receiptData.date);

  // Clean base64 image data (strip data URL prefix if present)
  let cleanBase64 = receiptImageBase64;
  if (cleanBase64 && cleanBase64.includes(',')) {
    cleanBase64 = cleanBase64.split(',')[1];
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fdfaf6; margin: 0; padding: 20px; color: #2b1f1d; }
      .container { max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #ebd9c8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.08); }
      .header { background: linear-gradient(135deg, #c0392b 0%, #d35400 100%); color: #ffffff; padding: 25px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
      .header p { margin: 6px 0 0; font-size: 15px; color: #fcebe6; }
      .content { padding: 30px 25px; line-height: 1.6; }
      .salutation { font-size: 18px; font-weight: 600; color: #8b2500; margin-bottom: 15px; }
      .message { font-size: 15px; color: #3a2e2b; margin-bottom: 20px; text-align: justify; }
      .details-card { background: #faf4ee; border: 1px solid #e8d5c4; border-radius: 8px; padding: 18px; margin: 20px 0; }
      .details-title { font-size: 16px; font-weight: bold; color: #8b2500; border-bottom: 2px solid #e0c8b0; padding-bottom: 8px; margin-bottom: 12px; }
      .details-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
      .details-label { color: #6b574f; font-weight: 600; }
      .details-value { color: #1c1514; font-weight: bold; }
      .shloka-box { background: #fff8f0; border-left: 4px solid #d35400; padding: 12px 16px; margin: 20px 0; font-style: italic; color: #783800; font-size: 15px; text-align: center; }
      .footer { background: #f5ede4; padding: 18px 20px; text-align: center; font-size: 12px; color: #7a685e; border-top: 1px solid #ebd9c8; }
      .badge { display: inline-block; background: #27ae60; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div style="font-size: 28px; margin-bottom: 5px;">ॐ</div>
        <h1>संस्कृतभारती, मालवा न्यास</h1>
        <p>३०५, आराधना अपार्टमेंट, सुभाष मार्ग, इन्दौर | अपुसङ्केतः : sbmalva@gmail.com</p>
      </div>
      <div class="content">
        <div class="salutation">सादरं सस्नेहं च नमोनमः, ${receiptData.name || 'श्रीमन्तः'}!</div>
        <p class="message">
          संस्कृतभारती-मालवा-न्यासस्य संस्कृतसंवर्धनकार्ये तथा राष्ट्रनिर्माणयज्ञे भवतः/भवत्याः अमूल्यं समर्पणं कृतज्ञतापूर्वकं स्वीकृतम्। 
          भवतः समर्पणस्य अधिकृतं प्राप्तिपत्रम् (Receipt) अस्य पत्रस्य सह संयोजितम् अस्ति।
        </p>

        <div class="shloka-box">
          ॥ जयतु संस्कृतम्, जयतु भारतम् ॥<br>
          <span style="font-size: 13px; color: #9c4d00;">भाषासु मुख्या मधुरा दिव्या गीर्वाणभारती।</span>
        </div>

        <div class="details-card">
          <div class="details-title">प्राप्तिपत्र-संक्षेपः (Receipt Summary)</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">क्रमाङ्कः (Receipt No.):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #c0392b;">${receiptNoDev}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">दिनाङ्कः (Date):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${dateDev}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">समर्पकस्य नाम (Name):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${receiptData.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">समर्पणराशिः (Amount):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #27ae60; font-size: 16px;">${amountDev}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">अक्षरेषु (In Words):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #8b2500;">${receiptData.amountSanskrit || SanskritNumbers.numberToSanskritReceiptText(receiptData.amount)}</td>
            </tr>
            ${receiptData.pan ? `
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">PAN:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${receiptData.pan}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #6b574f; font-weight: 600;">व्यवहार क्र. (Txn / Cheque):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${receiptData.txnId || 'UPI/Digital'}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #555; background: #fdf6e2; padding: 10px; border-radius: 6px; border: 1px dashed #d4b16a;">
          <strong>आयकर-सहुलियतः (80G Benefit):</strong> धारा 80G के अंतर्गत आयकर में छूट प्राप्त है।<br>
          PAN: AAPTS0068K | NEW: AAPTS0068KF20213 (17-03-2022 From AY 2022-23 to AY 2026-27)
        </p>

        <p style="margin-top: 25px; font-size: 14px; color: #444;">
          संस्कृतमातुः सेवार्थं भवतः सहयोगः चिरस्मरणीयः।<br>
          <strong>संस्कृतभारती, मालवा न्यास परिवारः</strong>
        </p>
      </div>

      <div class="footer">
        पंजीयन क्र. 1239/29.07.2015 | इन्दौर (मध्यप्रदेशः)<br>
        सम्पर्कः : sbmalva@gmail.com | दूरभाषः : 9755445677
      </div>
    </div>
  </body>
  </html>
  `;

  const recipients = [
    { email: receiptData.email, name: receiptData.name || 'समर्पकः' }
  ];

  const payload = {
    sender: {
      name: SENDER_NAME,
      email: SENDER_EMAIL
    },
    to: recipients,
    bcc: [
      { email: ORG_EMAIL, name: 'संस्कृतभारती मालवा न्यास' }
    ],
    replyTo: {
      name: SENDER_NAME,
      email: ORG_EMAIL
    },
    subject: `संस्कृतभारती मालवा न्यास - समर्पण प्राप्तिपत्रम् (क्र. ${receiptNoDev})`,
    htmlContent: htmlContent
  };

  if (cleanBase64) {
    payload.attachment = [
      {
        name: `Praptipatram_${receiptData.receiptNo}.png`,
        content: cleanBase64
      }
    ];
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Brevo API error response:', errorText);
    throw new Error(`Brevo API returned status ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  return result;
}

// API Routes

// 1. Get next available receipt number
app.get('/api/next-receipt-number', (req, res) => {
  const nextNum = peekNextReceiptNumber();
  res.json({
    nextNumber: nextNum,
    nextNumberDevanagari: SanskritNumbers.toDevanagariDigits(nextNum)
  });
});

// 2. Convert number to Sanskrit words and Devanagari numerals
app.post('/api/convert-number', (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }
  const words = SanskritNumbers.numberToSanskritWords(amount);
  const receiptText = SanskritNumbers.numberToSanskritReceiptText(amount);
  const devanagariFormatted = SanskritNumbers.formatIndianCurrencyDevanagari(amount);
  const devanagariDigits = SanskritNumbers.toDevanagariDigits(amount);

  res.json({
    amount: Number(amount),
    devanagariDigits,
    devanagariFormatted,
    sanskritWords: words,
    sanskritReceiptText: receiptText
  });
});

// 3. Generate receipt and dispatch email
app.post('/api/generate-receipt', async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      pan,
      amount,
      paymentMode,
      txnId,
      bankName,
      date,
      receiptImageBase64
    } = req.body;

    if (!name || !email || !amount) {
      return res.status(400).json({ error: 'Name, Email and Amount are mandatory fields.' });
    }

    // Allocate next incremental receipt number
    const receiptNo = getNextReceiptNumber();
    const receiptNoDev = SanskritNumbers.toDevanagariDigits(receiptNo);
    const sanskritWords = SanskritNumbers.numberToSanskritReceiptText(amount);
    const currentDate = date || new Date().toLocaleDateString('en-GB');

    const receiptRecord = {
      receiptNo,
      receiptNoDev,
      name,
      address: address || '',
      phone: phone || '',
      email,
      pan: pan || '',
      amount: Number(amount),
      amountFormatted: SanskritNumbers.formatIndianCurrencyDevanagari(amount),
      amountSanskrit: sanskritWords,
      paymentMode: paymentMode || 'UPI',
      txnId: txnId || '',
      bankName: bankName || '',
      date: currentDate,
      createdAt: new Date().toISOString()
    };

    // Send email via Brevo
    let emailStatus = 'pending';
    let emailResult = null;
    try {
      emailResult = await sendReceiptEmail(receiptRecord, receiptImageBase64);
      emailStatus = 'sent';
      console.log(`Receipt #${receiptNo} email sent successfully via Brevo:`, emailResult);
    } catch (emailErr) {
      console.error(`Failed to send email for receipt #${receiptNo}:`, emailErr);
      emailStatus = 'failed: ' + emailErr.message;
    }

    receiptRecord.emailStatus = emailStatus;
    receiptRecord.emailResult = emailResult;
    saveReceiptRecord(receiptRecord);

    res.json({
      success: true,
      receiptNo,
      receiptNoDev,
      receiptRecord,
      emailSent: emailStatus === 'sent',
      message: emailStatus === 'sent' 
        ? 'प्राप्तिपत्रं साफल्येन निर्मितं तथा ई-मेल द्वारा प्रेषितम्।' 
        : 'प्राप्तिपत्रं निर्मितं किन्तु ई-मेल प्रेषणे विघ्नः जातः।'
    });
  } catch (err) {
    console.error('Error generating receipt:', err);
    res.status(500).json({ error: 'आन्तरिकदोषः: ' + err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`संस्कृतभारती मालवा न्यास पोर्टल`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Next Receipt Number: ${peekNextReceiptNumber()}`);
  console.log(`=========================================`);
});
