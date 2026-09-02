// app.js - Sanskrit Bharati Malwa Nyas Portal Controller

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const views = {
    home: document.getElementById('view-home'),
    payment: document.getElementById('view-payment'),
    form: document.getElementById('view-form'),
    success: document.getElementById('view-success')
  };

  // Nav buttons
  const btnGotoPay = document.getElementById('btn-goto-pay');
  const btnGotoReceipt = document.getElementById('btn-goto-receipt');
  const btnBackFromPay = document.getElementById('btn-back-from-pay');
  const btnBackFromForm = document.getElementById('btn-back-from-form');
  const btnPaymentDoneProceed = document.getElementById('btn-payment-done-proceed');
  const btnHomeReturn = document.getElementById('btn-home-return');

  // UPI & Bank interactions
  const btnCopyUpi = document.getElementById('btn-copy-upi');
  const upiIdString = document.getElementById('upi-id-string');
  const copyBtnText = document.getElementById('copy-btn-text');
  const btnCopyAcc = document.getElementById('btn-copy-acc');
  const accNoString = document.getElementById('acc-no-string');
  const copyAccBtnText = document.getElementById('copy-acc-btn-text');

  // Receipt Form elements
  const receiptForm = document.getElementById('receipt-form');
  const inputName = document.getElementById('input-name');
  const inputAddress = document.getElementById('input-address');
  const inputPhone = document.getElementById('input-phone');
  const inputEmail = document.getElementById('input-email');
  const inputAmount = document.getElementById('input-amount');
  const inputPan = document.getElementById('input-pan');
  const selectPaymentMode = document.getElementById('select-payment-mode');
  const inputTxnId = document.getElementById('input-txnid');
  const inputBank = document.getElementById('input-bank');
  const inputDate = document.getElementById('input-date');

  // Live conversion & preview elements
  const liveDevanagariDigits = document.getElementById('live-devanagari-digits');
  const liveSanskritWords = document.getElementById('live-sanskrit-words');
  const receiptCanvas = document.getElementById('receipt-canvas');
  const btnRefreshPreview = document.getElementById('btn-refresh-preview');
  const receiptNoDisplay = document.getElementById('receipt-no-display');

  // Submit button
  const btnSubmitReceipt = document.getElementById('btn-submit-receipt');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitBtnText = document.getElementById('submit-btn-text');

  // Success view elements
  const finalReceiptImg = document.getElementById('final-receipt-img');
  const btnDownloadReceipt = document.getElementById('btn-download-receipt');
  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  const emailStatusText = document.getElementById('email-status-text');

  // State
  let currentReceiptNumber = 001;
  let currentReceiptNumberDev = '००१';
  let lastGeneratedReceiptData = null;
  let generatedDataUrl = null;

  // Initialize
  init();

  async function init() {
    setupTodayDate();
    setupEventListeners();
    await fetchNextReceiptNumber();
    updateLivePreview();
  }

  function setupTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formatted = `${day}/${month}/${year}`;
    if (inputDate && !inputDate.value) {
      inputDate.value = formatted;
    }
  }

  async function fetchNextReceiptNumber() {
    try {
      const res = await fetch('/api/next-receipt-number');
      if (res.ok) {
        const data = await res.json();
        currentReceiptNumber = data.nextNumber || 1;
        currentReceiptNumberDev = data.nextNumberDevanagari || SanskritNumbers.toDevanagariDigits(currentReceiptNumber);
        if (receiptNoDisplay) {
          receiptNoDisplay.textContent = `क्रमाङ्कः ${currentReceiptNumberDev}`;
        }
      }
    } catch (e) {
      console.warn('Could not fetch next receipt number from server, using local fallback:', e);
    }
  }

  function showView(viewKey) {
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.remove('active');
      }
    });

    if (views[viewKey]) {
      views[viewKey].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (viewKey === 'form') {
      fetchNextReceiptNumber().then(() => updateLivePreview());
    }
  }

  function setupEventListeners() {
    // Navigation
    if (btnGotoPay) {
      btnGotoPay.addEventListener('click', () => showView('payment'));
    }

    if (btnGotoReceipt) {
      btnGotoReceipt.addEventListener('click', () => showView('form'));
    }

    if (btnBackFromPay) {
      btnBackFromPay.addEventListener('click', () => showView('home'));
    }

    if (btnBackFromForm) {
      btnBackFromForm.addEventListener('click', () => showView('home'));
    }

    if (btnPaymentDoneProceed) {
      btnPaymentDoneProceed.addEventListener('click', () => {
        showView('form');
        // Pre-select UPI mode
        if (selectPaymentMode) {
          selectPaymentMode.value = 'UPI / QR Code';
        }
      });
    }

    if (btnHomeReturn) {
      btnHomeReturn.addEventListener('click', () => {
        resetForm();
        showView('home');
      });
    }

    // UPI ID Copy
    if (btnCopyUpi && upiIdString) {
      btnCopyUpi.addEventListener('click', () => {
        const text = upiIdString.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          if (copyBtnText) copyBtnText.textContent = 'प्रतिलिपिः कृता (Copied!)';
          showToast('UPI ID प्रतिलिपिः सफला!');
          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = 'कॉपी कुर्वन्तु';
          }, 2500);
        }).catch(err => {
          showToast('प्रतिलिपि-करणे त्रुटिः');
        });
      });
    }

    // Account Number Copy
    if (btnCopyAcc && accNoString) {
      btnCopyAcc.addEventListener('click', () => {
        const text = accNoString.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          if (copyAccBtnText) copyAccBtnText.textContent = 'प्रतिलिपिः कृता (Copied!)';
          showToast('खाता-सङ्ख्या प्रतिलिपिः सफला!');
          setTimeout(() => {
            if (copyAccBtnText) copyAccBtnText.textContent = 'कॉपी कुर्वन्तु';
          }, 2500);
        }).catch(err => {
          showToast('प्रतिलिपि-करणे त्रुटिः');
        });
      });
    }

    // Amount input change -> Live Sanskrit conversion
    if (inputAmount) {
      inputAmount.addEventListener('input', handleAmountChange);
    }

    // Form inputs change -> live canvas update
    const previewInputs = [inputName, inputAddress, inputPhone, inputEmail, inputPan, inputTxnId, inputBank, inputDate, selectPaymentMode];
    previewInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', debounce(updateLivePreview, 250));
      }
    });

    if (btnRefreshPreview) {
      btnRefreshPreview.addEventListener('click', updateLivePreview);
    }

    // Form Submit
    if (receiptForm) {
      receiptForm.addEventListener('submit', handleFormSubmit);
    }

    // Downloads & Prints
    if (btnDownloadReceipt) {
      btnDownloadReceipt.addEventListener('click', handleDownloadReceipt);
    }

    if (btnPrintReceipt) {
      btnPrintReceipt.addEventListener('click', handlePrintReceipt);
    }
  }

  function handleAmountChange() {
    const val = inputAmount.value ? parseInt(inputAmount.value, 10) : 0;
    if (val > 0) {
      const devDigits = SanskritNumbers.formatIndianCurrencyDevanagari(val);
      const sanskritWords = SanskritNumbers.numberToSanskritReceiptText(val);
      if (liveDevanagariDigits) liveDevanagariDigits.textContent = devDigits;
      if (liveSanskritWords) liveSanskritWords.textContent = sanskritWords;
    } else {
      if (liveDevanagariDigits) liveDevanagariDigits.textContent = '₹०/-';
      if (liveSanskritWords) liveSanskritWords.textContent = '-';
    }
    updateLivePreview();
  }

  function getFormData() {
    const rawAmount = inputAmount ? parseFloat(inputAmount.value) : 0;
    const sanskritWords = rawAmount > 0 ? SanskritNumbers.numberToSanskritReceiptText(rawAmount) : '';

    return {
      receiptNo: currentReceiptNumber,
      name: inputName ? inputName.value.trim() : '',
      address: inputAddress ? inputAddress.value.trim() : '',
      phone: inputPhone ? inputPhone.value.trim() : '',
      email: inputEmail ? inputEmail.value.trim() : '',
      pan: inputPan ? inputPan.value.trim().toUpperCase() : '',
      amount: rawAmount,
      amountSanskrit: sanskritWords,
      paymentMode: selectPaymentMode ? selectPaymentMode.value : 'UPI',
      txnId: inputTxnId ? inputTxnId.value.trim() : '',
      bankName: inputBank ? inputBank.value.trim() : '',
      date: inputDate ? inputDate.value.trim() : ''
    };
  }

  async function updateLivePreview() {
    if (!receiptCanvas || !window.ReceiptCanvas) return;
    try {
      const data = getFormData();
      await window.ReceiptCanvas.renderReceipt(data, receiptCanvas);
    } catch (e) {
      console.error('Error rendering receipt preview:', e);
    }
  }

  function validateForm() {
    let isValid = true;
    const errors = {};

    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });

    const data = getFormData();

    if (!data.name) {
      errors['name'] = 'कृपया स्वनाम (श्रीमान् / श्रीमती) लिखन्तु।';
      isValid = false;
    }

    if (!data.address) {
      errors['address'] = 'कृपया पत्रसङ्केतः (स्थानम् / नगरम्) लिखन्तु।';
      isValid = false;
    }

    if (!data.phone) {
      errors['phone'] = 'कृपया दूरभाष-सङ्ख्यां लिखन्तु।';
      isValid = false;
    } else if (!/^[0-9+ ]{10,14}$/.test(data.phone.replace(/[\s-]/g, ''))) {
      errors['phone'] = 'कृपया मान्या १० अङ्कीया दूरभाष-सङ्ख्या लिखन्तु।';
      isValid = false;
    }

    if (!data.email) {
      errors['email'] = 'कृपया ई-मेल सङ्केतं लिखन्तु।';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors['email'] = 'कृपया मान्यम् ई-मेल सङ्केतं लिखन्तु।';
      isValid = false;
    }

    if (!data.amount || data.amount <= 0) {
      errors['amount'] = 'कृपया समर्पणराशिं (₹) लिखन्तु।';
      isValid = false;
    }

    if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(data.pan)) {
      errors['pan'] = 'कृपया मान्यं PAN (१० वर्णाः) लिखन्तु।';
      isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
      const errEl = document.getElementById(`error-${field}`);
      if (errEl) {
        errEl.textContent = errors[field];
        errEl.classList.add('visible');
      }
    });

    return isValid;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      showToast('कृपया आवश्यकाणि क्षेत्राणि यथार्थं पूरयन्तु।', 'error');
      return;
    }

    // Set loading state
    setLoadingState(true);

    try {
      const formData = getFormData();

      // Render high-res receipt on canvas and get data URL
      const highResDataUrl = await window.ReceiptCanvas.generateReceiptDataUrl(formData);
      generatedDataUrl = highResDataUrl;

      // Prepare request payload for backend
      const payload = {
        ...formData,
        receiptImageBase64: highResDataUrl
      };

      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'प्राप्तिपत्र-जनने विघ्नः जातः');
      }

      // Update state with assigned receipt number from server
      currentReceiptNumber = result.receiptNo;
      currentReceiptNumberDev = result.receiptNoDev;
      lastGeneratedReceiptData = result.receiptRecord;

      // Re-render with assigned receipt number
      formData.receiptNo = currentReceiptNumber;
      generatedDataUrl = await window.ReceiptCanvas.generateReceiptDataUrl(formData);

      // Display in success view
      if (finalReceiptImg) {
        finalReceiptImg.src = generatedDataUrl;
      }

      if (emailStatusText) {
        if (result.emailSent) {
          emailStatusText.textContent = `प्राप्तिपत्रं भवतः ई-मेल सङ्केते (${formData.email}) तथा sbmalva@gmail.com प्रति साफल्येन प्रेषितम्।`;
        } else {
          emailStatusText.textContent = `प्राप्तिपत्रं निर्मितम्। (ई-मेल प्रेषणे विघ्नः अभवत्, भवन्तः अधः प्राप्तिपत्रम् अवतरणं कर्तुं शक्नुवन्ति)`;
        }
      }

      showToast('प्राप्तिपत्रं साफल्येन निर्मितम्!', 'success');
      showView('success');

    } catch (err) {
      console.error('Submission error:', err);
      showToast(err.message || 'त्रुटिः सञ्जाता, कृपया पुनः प्रयतताम्।', 'error');
    } finally {
      setLoadingState(false);
    }
  }

  function setLoadingState(isLoading) {
    if (btnSubmitReceipt) {
      btnSubmitReceipt.disabled = isLoading;
      if (submitSpinner) submitSpinner.style.display = isLoading ? 'inline-block' : 'none';
      if (submitBtnText) submitBtnText.textContent = isLoading ? 'प्राप्तिपत्रं निर्मीयते एवं ई-मेल प्रेष्यते...' : 'प्राप्तिपत्रं जनयतु एवं ई-मेल प्रेषयतु';
    }
  }

  function handleDownloadReceipt() {
    if (!generatedDataUrl) return;
    const a = document.createElement('a');
    a.href = generatedDataUrl;
    a.download = `Sanskrit_Bharati_Receipt_${currentReceiptNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('प्राप्तिपत्रं अवतरितम् (Downloaded)!', 'success');
  }

  function handlePrintReceipt() {
    if (!generatedDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>संस्कृतभारती प्राप्तिपत्रम् - ${currentReceiptNumber}</title>
        <style>
          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
          img { max-width: 100%; height: auto; box-shadow: none; }
          @media print {
            body { padding: 0; }
            img { width: 100%; }
          }
        </style>
      </head>
      <body>
        <img src="${generatedDataUrl}" alt="प्राप्तिपत्रम्" onload="window.print();">
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function resetForm() {
    if (receiptForm) receiptForm.reset();
    setupTodayDate();
    handleAmountChange();
    fetchNextReceiptNumber().then(() => updateLivePreview());
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
});
