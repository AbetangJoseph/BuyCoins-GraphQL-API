const axios = require('axios');
const DB = require('../utils/db');

async function calculatePrice(args) {
  const { type, margin, exchangeRate } = args;
  const percentageMargin = margin / 100;
  let transactionRate = 0;

  if (type === 'buy' || type === 'sell') {
    const response = await axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .catch(error => console.log(error.message));

    const { rate_float: usdRate } = response.data.bpi.USD;

    switch (type.toLowerCase().trim()) {
      case 'buy':
        transactionRate = usdRate + usdRate * percentageMargin;
        break;

      case 'sell':
        transactionRate = usdRate - usdRate * percentageMargin;
        break;

      default:
        transactionRate = 'invalid type';
        break;
    }

    const rate = {
      id: DB.length + 1,
      type,
      rate: (transactionRate * exchangeRate).toFixed(2),
      date: Date.now()
    };

    DB.push(rate);

    return rate;
  }

  throw new Error('invalid transaction type');
}

module.exports = calculatePrice;
