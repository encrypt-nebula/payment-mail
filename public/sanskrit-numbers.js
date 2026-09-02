// sanskrit-numbers.js - Comprehensive Sanskrit Number Conversion Library

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SanskritNumbers = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Devanagari digit mapping
  const devanagariDigits = {
    '0': '०',
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९'
  };

  function toDevanagariDigits(input) {
    if (input === null || input === undefined) return '';
    const str = String(input);
    return str.split('').map(char => devanagariDigits[char] || char).join('');
  }

  function formatIndianCurrencyDevanagari(num) {
    if (num === null || num === undefined || num === '' || isNaN(Number(num))) return '';
    const n = Math.floor(Math.abs(Number(num)));
    const s = n.toString();
    let formatted = '';
    if (s.length <= 3) {
      formatted = s;
    } else {
      const last3 = s.substring(s.length - 3);
      const other = s.substring(0, s.length - 3);
      let formattedOther = '';
      for (let i = other.length - 1, count = 0; i >= 0; i--, count++) {
        if (count > 0 && count % 2 === 0) {
          formattedOther = ',' + formattedOther;
        }
        formattedOther = other[i] + formattedOther;
      }
      formatted = formattedOther + ',' + last3;
    }
    return '₹' + toDevanagariDigits(formatted) + '/-';
  }

  // 1 to 99 in Sanskrit
  const onesTo99 = {
    1: 'एकम्',
    2: 'द्वे',
    3: 'त्रीणि',
    4: 'चत्वारि',
    5: 'पञ्च',
    6: 'षट्',
    7: 'सप्त',
    8: 'अष्ट',
    9: 'नव',
    10: 'दश',
    11: 'एकादश',
    12: 'द्वादश',
    13: 'त्रयोदश',
    14: 'चतुर्दश',
    15: 'पञ्चदश',
    16: 'षोडश',
    17: 'सप्तदश',
    18: 'अष्टादश',
    19: 'नवदश',
    20: 'विंशतिः',
    21: 'एकविंशतिः',
    22: 'द्वाविंशतिः',
    23: 'त्रयोविंशतिः',
    24: 'चतुर्विंशतिः',
    25: 'पञ्चविंशतिः',
    26: 'षड्विंशतिः',
    27: 'सप्तविंशतिः',
    28: 'अष्टाविंशतिः',
    29: 'नवविंशतिः',
    30: 'त्रिंशत्',
    31: 'एकत्रिंशत्',
    32: 'द्वात्रिंशत्',
    33: 'त्रयस्त्रिंशत्',
    34: 'चतुस्त्रिंशत्',
    35: 'पञ्चत्रिंशत्',
    36: 'षट्त्रिंशत्',
    37: 'सप्तत्रिंशत्',
    38: 'अष्टात्रिंशत्',
    39: 'नवत्रिंशत्',
    40: 'चत्वारिंशत्',
    41: 'एकचत्वारिंशत्',
    42: 'द्विचत्वारिंशत्',
    43: 'त्रिचत्वारिंशत्',
    44: 'चतुश्चत्वारिंशत्',
    45: 'पञ्चचत्वारिंशत्',
    46: 'षट्चत्वारिंशत्',
    47: 'सप्तचत्वारिंशत्',
    48: 'अष्टाचत्वारिंशत्',
    49: 'नवचत्वारिंशत्',
    50: 'पञ्चाशत्',
    51: 'एकपञ्चाशत्',
    52: 'द्विपञ्चाशत्',
    53: 'त्रिपञ्चाशत्',
    54: 'चतुःपञ्चाशत्',
    55: 'पञ्चपञ्चाशत्',
    56: 'षट्पञ्चाशत्',
    57: 'सप्तपञ्चाशत्',
    58: 'अष्टापञ्चाशत्',
    59: 'नवपञ्चाशत्',
    60: 'षष्टिः',
    61: 'एकषष्टिः',
    62: 'द्विषष्टिः',
    63: 'त्रिषष्टिः',
    64: 'चतुःषष्टिः',
    65: 'पञ्चषष्टिः',
    66: 'षट्षष्टिः',
    67: 'सप्तषष्टिः',
    68: 'अष्टाषष्टिः',
    69: 'नवषष्टिः',
    70: 'सप्ततिः',
    71: 'एकसप्ततिः',
    72: 'द्विसप्ततिः',
    73: 'त्रिसप्ततिः',
    74: 'चतुःसप्ततिः',
    75: 'पञ्चसप्ततिः',
    76: 'षट्सप्ततिः',
    77: 'सप्तसप्ततिः',
    78: 'अष्टासप्ततिः',
    79: 'नवसप्ततिः',
    80: 'अशीतिः',
    81: 'एकाशीतिः',
    82: 'द्व्यशीतिः',
    83: 'त्र्यशीतिः',
    84: 'चतुरशीतिः',
    85: 'पञ्चाशीतिः',
    86: 'षडशीतिः',
    87: 'सप्ताशीतिः',
    88: 'अष्टाशीतिः',
    89: 'नवाशीतिः',
    90: 'नवतिः',
    91: 'एकनवतिः',
    92: 'द्विनवतिः',
    93: 'त्रिनवतिः',
    94: 'चतुर्नवतिः',
    95: 'पञ्चनवतिः',
    96: 'षण्णवतिः',
    97: 'सप्तनवतिः',
    98: 'अष्टानवतिः',
    99: 'नवनवतिः'
  };

  // Combining prefix forms for 1-99
  const prefixForms = {
    1: 'एक',
    2: 'द्वि',
    3: 'त्रि',
    4: 'चतुर्',
    5: 'पञ्च',
    6: 'षट्',
    7: 'सप्त',
    8: 'अष्ट',
    9: 'नव',
    10: 'दश',
    11: 'एकादश',
    12: 'द्वादश',
    13: 'त्रयोदश',
    14: 'चतुर्दश',
    15: 'पञ्चदश',
    16: 'षोडश',
    17: 'सप्तदश',
    18: 'अष्टादश',
    19: 'नवदश',
    20: 'विंशति',
    21: 'एकविंशति',
    22: 'द्वाविंशति',
    23: 'त्रयोविंशति',
    24: 'चतुर्विंशति',
    25: 'पञ्चविंशति',
    26: 'षड्विंशति',
    27: 'सप्तविंशति',
    28: 'अष्टाविंशति',
    29: 'नवविंशति',
    30: 'त्रिंशत्',
    31: 'एकत्रिंशत्',
    32: 'द्वात्रिंशत्',
    33: 'त्रयस्त्रिंशत्',
    34: 'चतुस्त्रिंशत्',
    35: 'पञ्चत्रिंशत्',
    36: 'षट्त्रिंशत्',
    37: 'सप्तत्रिंशत्',
    38: 'अष्टात्रिंशत्',
    39: 'नवत्रिंशत्',
    40: 'चत्वारिंशत्',
    41: 'एकचत्वारिंशत्',
    42: 'द्विचत्वारिंशत्',
    43: 'त्रिचत्वारिंशत्',
    44: 'चतुश्चत्वारिंशत्',
    45: 'पञ्चचत्वारिंशत्',
    46: 'षट्चत्वारिंशत्',
    47: 'सप्तचत्वारिंशत्',
    48: 'अष्टाचत्वारिंशत्',
    49: 'नवचत्वारिंशत्',
    50: 'पञ्चाशत्',
    51: 'एकपञ्चाशत्',
    52: 'द्विपञ्चाशत्',
    53: 'त्रिपञ्चाशत्',
    54: 'चतुःपञ्चाशत्',
    55: 'पञ्चपञ्चाशत्',
    56: 'षट्पञ्चाशत्',
    57: 'सप्तपञ्चाशत्',
    58: 'अष्टापञ्चाशत्',
    59: 'नवपञ्चाशत्',
    60: 'षष्टि',
    61: 'एकषष्टि',
    62: 'द्विषष्टि',
    63: 'त्रिषष्टि',
    64: 'चतुःषष्टि',
    65: 'पञ्चषष्टि',
    66: 'षट्षष्टि',
    67: 'सप्तषष्टि',
    68: 'अष्टाषष्टि',
    69: 'नवषष्टि',
    70: 'सप्तति',
    71: 'एकसप्तति',
    72: 'द्विसप्तति',
    73: 'त्रिसप्तति',
    74: 'चतुःसप्तति',
    75: 'पञ्चसप्तति',
    76: 'षट्सप्तति',
    77: 'सप्तसप्तति',
    78: 'अष्टासप्तति',
    79: 'नवसप्तति',
    80: 'अशीति',
    81: 'एकाशीति',
    82: 'द्व्यशीति',
    83: 'त्र्यशीति',
    84: 'चतुरशीति',
    85: 'पञ्चाशीति',
    86: 'षडशीति',
    87: 'सप्ताशीति',
    88: 'अष्टाशीति',
    89: 'नवाशीति',
    90: 'नवति',
    91: 'एकनवति',
    92: 'द्विनवति',
    93: 'त्रिनवति',
    94: 'चतुर्नवति',
    95: 'पञ्चनवति',
    96: 'षण्णवति',
    97: 'सप्तनवति',
    98: 'अष्टानवति',
    99: 'नवनवति'
  };

  const hundreds = {
    1: 'एकशतम्',
    2: 'द्विशतम्',
    3: 'त्रिशतम्',
    4: 'चतुःशतम्',
    5: 'पञ्चशतम्',
    6: 'षट्शतम्',
    7: 'सप्तशतम्',
    8: 'अष्टशतम्',
    9: 'नवशतम्'
  };

  const hundredPrefixes = {
    1: 'एकशत',
    2: 'द्विशत',
    3: 'त्रिशत',
    4: 'चतुःशत',
    5: 'पञ्चशत',
    6: 'षट्शत',
    7: 'सप्तशत',
    8: 'अष्टशत',
    9: 'नवशत'
  };

  function getPrefix(n) {
    if (prefixForms[n]) return prefixForms[n];
    return onesTo99[n] || '';
  }

  function numberToSanskritWords(num) {
    if (num === null || num === undefined || isNaN(num) || num <= 0) {
      return '';
    }
    const n = Math.floor(Number(num));
    if (n === 0) return 'शून्यम्';

    // Breakdown into Indian system units
    const crores = Math.floor(n / 10000000);
    let rem = n % 10000000;

    const lakhs = Math.floor(rem / 100000);
    rem = rem % 100000;

    const thousands = Math.floor(rem / 1000);
    rem = rem % 1000;

    const h = Math.floor(rem / 100);
    const below100 = rem % 100;

    const parts = [];

    if (crores > 0) {
      if (crores === 1) {
        parts.push({ prefix: 'एककोटि', base: 'एककोटिः', type: 'crore' });
      } else {
        parts.push({ prefix: getPrefix(crores) + 'कोटि', base: getPrefix(crores) + 'कोटिः', type: 'crore' });
      }
    }

    if (lakhs > 0) {
      if (lakhs === 1) {
        parts.push({ prefix: 'एकलक्ष', base: 'एकलक्षम्', type: 'lakh' });
      } else {
        parts.push({ prefix: getPrefix(lakhs) + 'लक्ष', base: getPrefix(lakhs) + 'लक्षम्', type: 'lakh' });
      }
    }

    if (thousands > 0) {
      if (thousands === 1) {
        parts.push({ prefix: 'एकसहस्र', base: 'एकसहस्रम्', type: 'thousand' });
      } else {
        parts.push({ prefix: getPrefix(thousands) + 'सहस्र', base: getPrefix(thousands) + 'सहस्रम्', type: 'thousand' });
      }
    }

    if (h > 0) {
      parts.push({ prefix: hundredPrefixes[h], base: hundreds[h], type: 'hundred' });
    }

    if (below100 > 0) {
      parts.push({ prefix: getPrefix(below100), base: onesTo99[below100], type: 'ones' });
    }

    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].base;

    // When combining two or more parts:
    // Format: "एकसहस्राधिक-द्विशतम्" (as specified in prompt: "₹1,200 -> एकसहास्राधिक-द्विशतम्")
    let result = '';
    for (let i = 0; i < parts.length; i++) {
      const isLast = (i === parts.length - 1);
      const current = parts[i];

      if (i === 0) {
        // First element
        if (parts.length === 2 && current.type === 'thousand') {
          result += current.prefix + 'ाधिक-'; // सहस्राधिक-
        } else if (parts.length === 2 && current.type === 'lakh') {
          result += current.prefix + 'ाधिक-'; // लक्षाधिक-
        } else if (parts.length === 2 && current.type === 'hundred') {
          result += current.prefix + 'ाधिक-'; // शताधिक-
        } else {
          result += current.prefix + '-';
        }
      } else if (isLast) {
        result += current.base;
      } else {
        result += current.prefix + '-';
      }
    }

    // Clean up double hyphens if any
    result = result.replace(/-+/g, '-');
    return result;
  }

  function numberToSanskritReceiptText(num) {
    const sanskritWords = numberToSanskritWords(num);
    if (!sanskritWords) return '';
    return sanskritWords + ' रूप्यकाणि मात्रम्';
  }

  return {
    toDevanagariDigits,
    formatIndianCurrencyDevanagari,
    numberToSanskritWords,
    numberToSanskritReceiptText
  };
}));
