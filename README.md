# संस्कृतभारती मालवा न्यास पोर्टल (Sanskrit Bharati Malwa Portal)

A web portal for donations, automated Sanskrit receipt generation, and automated PDF email delivery for **Sanskrit Bharati Malwa Nyas**.

---

## 🌟 Key Features

1. **Sacred Sanatani UI/UX**:
   - Immersive saffron and royal maroon aesthetic with traditional decorative ornaments.
   - 3-step intuitive workflow: Home Overview → UPI/QR Payment → Receipt Form & Instant Generation.

2. **Smart Sanskrit Numerals & Words Conversion**:
   - Converts numeric amounts in real-time to Devanagari digits (e.g. `१२,५००`) and full Sanskrit monetary word forms (e.g. `द्वादशसहस्रपञ्चशतम् रूप्यकाणि`).
   - Handles numbers ranging from single digits up to crores with traditional grammatical forms.

3. **High-Fidelity Receipt Generation**:
   - Precise client-side HTML5 Canvas preview overlaid on official Sanskrit Bharati Malwa letterhead receipt templates.
   - Server-side PDF rendering with embedded receipt number tracking and 80G tax exemption details.

4. **Instant Email Delivery**:
   - Automated email dispatch via Nodemailer delivering receipt PDFs directly to the donor.

5. **Integrated Payment Details**:
   - Official QR Code scanner support.
   - Quick one-tap copy button for Trust UPI ID (`boism-9755445677@boi`).
   - Quick one-tap copy button for Trust Bank Account Number (`880420110000376`).

---

## 📁 Project Architecture

```
payment-mail/
├── public/
│   ├── assets/
│   │   ├── logo.png           # Sanskrit Bharati logo
│   │   ├── QR-code.png        # Official UPI QR code
│   │   └── receipt.png        # High-res receipt template
│   ├── app.js                 # Frontend interactions & live preview controller
│   ├── index.html             # Multi-view responsive portal interface
│   ├── receipt-canvas.js      # Canvas renderer for receipt overlay
│   ├── sanskrit-numbers.js    # Number-to-Sanskrit numeral/word translation logic
│   └── style.css              # Custom Sanatani theme styles and animations
├── data/
│   ├── counter.json           # Sequential receipt numbering counter
│   └── receipts.json          # Persistent receipt record store
├── coords-reference.js        # Coordinate alignment mapping for template
├── server.js                  # Express backend & Nodemailer PDF dispatch
├── test-e2e.js                # End-to-end receipt generation & email test
└── test-sanskrit.js           # Unit test suite for Sanskrit number converter
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or newer recommended)
- npm

### 2. Installation
```bash
npm install
```

### 3. Running the Server
```bash
npm start
```
By default, the server runs on [http://localhost:3000](http://localhost:3000).

### 4. Running Tests
- **Sanskrit Converter Unit Test**:
  ```bash
  node test-sanskrit.js
  ```
- **End-to-End Flow Test**:
  ```bash
  node test-e2e.js
  ```

---

## 📄 License
ISC
