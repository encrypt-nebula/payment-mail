// receipt-canvas.js - High resolution canvas renderer for official receipt

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./sanskrit-numbers.js'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./sanskrit-numbers.js'));
  } else {
    root.ReceiptCanvas = factory(root.SanskritNumbers);
  }
}(typeof self !== 'undefined' ? self : this, function (SanskritNumbers) {

  let templateImage = null;
  let imageLoadingPromise = null;

  function loadTemplateImage(src) {
    if (templateImage && templateImage.complete) {
      return Promise.resolve(templateImage);
    }
    if (imageLoadingPromise) {
      return imageLoadingPromise;
    }
    imageLoadingPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        templateImage = img;
        resolve(img);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = src || '/assets/receipt.png';
    });
    return imageLoadingPromise;
  }

  // Pre-load font if document.fonts exists
  async function ensureFontsLoaded() {
    if (document.fonts && document.fonts.load) {
      try {
        await Promise.all([
          document.fonts.load('bold 36px "Noto Sans Devanagari"'),
          document.fonts.load('600 28px "Noto Sans Devanagari"'),
          document.fonts.load('bold 32px "Yatra One"')
        ]);
      } catch (e) {
        console.warn('Font preload exception:', e);
      }
    }
  }

  async function renderReceipt(data, targetCanvas) {
    const img = await loadTemplateImage(data.templateSrc || '/assets/receipt.png');
    await ensureFontsLoaded();

    const canvas = targetCanvas || document.createElement('canvas');
    canvas.width = 1558;
    canvas.height = 1010;
    const ctx = canvas.getContext('2d');

    // 1. Draw base receipt template
    ctx.drawImage(img, 0, 0, 1558, 1010);

    // 2. Mask the default "384" static number on the template
    // Clear area around X: 340, Y: 265, Width: 120, Height: 55
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(340, 268, 115, 52);

    // 3. Draw Incremental Receipt Number in Red Bold
    const receiptNo = data.receiptNo ? SanskritNumbers.toDevanagariDigits(data.receiptNo) : '००१';
    ctx.fillStyle = '#c00';
    ctx.font = 'bold 40px "Noto Sans Devanagari", "Rozha One", "Yatra One", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(receiptNo, 310, 290);

    // 4. Draw Date (दिनाङ्कः)
    const dateStr = data.date ? SanskritNumbers.toDevanagariDigits(data.date) : '';
    ctx.fillStyle = '#112244';
    ctx.font = '600 24px "Noto Sans Devanagari", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(dateStr, 1240, 280);

    // 5. Draw Donor Name (श्रीमान् / श्रीमती)
    const nameStr = data.name || '';
    ctx.fillStyle = '#0a2240';
    ctx.font = 'bold 26px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(nameStr, 330, 355);

    // 6. Draw Address (पत्रसङ्केतः :)
    const addressStr = data.address || '';
    ctx.font = '500 24px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(addressStr, 260, 440);

    // 7. Draw Contact Details: Phone, Email, PAN
    // Phone (दूरभाषः)
    const phoneStr = data.phone ? SanskritNumbers.toDevanagariDigits(data.phone) : '';
    ctx.font = '600 23px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(phoneStr, 220, 520);

    // Email
    const emailStr = data.email || '';
    ctx.font = '500 22px "Inter", "Segoe UI", sans-serif';
    ctx.fillText(emailStr, 640, 518);

    // PAN
    const panStr = data.pan || '';
    ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
    ctx.fillText(panStr, 1170, 520);

    // 8. Sanskrit Sewartham Amount Box
    // Amount in Devanagari inside the box
    if (data.amount) {
      const devAmount = SanskritNumbers.formatIndianCurrencyDevanagari(data.amount);
      ctx.fillStyle = '#8b0000';
      ctx.font = 'bold 40px "Noto Sans Devanagari", "Yatra One", sans-serif';
      ctx.textAlign = 'center';
      // Center of box X: (325 + 585)/2 = 455, Y: 595
      ctx.fillText(devAmount, 442, 612);
    }

    // 9. Amount in Words (अक्षरेषु)
    ctx.fillStyle = '#0a2240';
    ctx.textAlign = 'left';
    const sanskritWords = data.amountSanskrit || (data.amount ? SanskritNumbers.numberToSanskritReceiptText(data.amount) : '');
    // Adjust font size if text is long
    let wordsFontSize = 23;
    if (sanskritWords.length > 35) {
      wordsFontSize = 30;
    } else if (sanskritWords.length > 25) {
      wordsFontSize = 30;
    }
    ctx.font = `600 ${wordsFontSize}px "Noto Sans Devanagari", sans-serif`;
    ctx.fillText(sanskritWords, 723, 610);

    // 10. Payment Reference & Bank: (क्र. ____________ बैंक ____________ )
    const txnStr = data.txnId || data.utr || data.chequeNo || 'UPI/Online';
    const bankStr = data.bankName || 'ऑनलाइन / डिजिटल';

    ctx.font = '500 22px "Noto Sans Devanagari", "Inter", sans-serif';
    // Txn No after (क्र.
    ctx.fillText(txnStr, 480, 700);
    // Bank name after बैंक
    ctx.fillText(bankStr, 750, 700);

    return canvas;
  }

  async function generateReceiptDataUrl(data) {
    const canvas = document.createElement('canvas');
    await renderReceipt(data, canvas);
    return canvas.toDataURL('image/png', 0.95);
  }

  return {
    loadTemplateImage,
    renderReceipt,
    generateReceiptDataUrl
  };
}));
