'use strict';

var braintree = require('braintree');
var environment, gateway;

//require('dotenv').load();
//environment = process.env.BT_ENVIRONMENT.charAt(0).toUpperCase() + process.env.BT_ENVIRONMENT.slice(1);

/*gateway = braintree.connect({
  environment: braintree.Environment[environment],
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
});*/
gateway = braintree.connect({
  environment: braintree.Environment['Sandbox'],
  merchantId: 'tzbkwkh48ksvsr58',
  publicKey: 'kbzzn7x7gqnwm4nk',
  privateKey: '237e078bd443df34704204bc8a25f8ab'
});

module.exports = gateway;
