const SanskritNumbers = require('./public/sanskrit-numbers.js');

const testCases = [
  1, 5, 10, 21, 51, 100, 200, 500, 1000, 1200, 1500, 2100, 2500, 5000, 5100, 11000, 25000, 50000, 100000, 500000, 1000000
];

console.log('--- SANSKRIT NUMBERS CONVERSION TESTS ---');
testCases.forEach(num => {
  const words = SanskritNumbers.numberToSanskritWords(num);
  const dev = SanskritNumbers.formatIndianCurrencyDevanagari(num);
  const full = SanskritNumbers.numberToSanskritReceiptText(num);
  console.log(`₹${num.toLocaleString('en-IN')} -> ${dev} | अक्षरेषु: ${words} | पूर्णम्: ${full}`);
});
