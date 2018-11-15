const moment = require('moment-timezone');
const parse = require('urlencoded-body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { encrypt, hashPhone } = require('./cryptoHelpers');
const dbConnection = require('../knex');

const db = dbConnection();

module.exports = async function(req, res) {
  const timestamp = moment().tz('America/Chicago');

  // parse payload into json
  const data = await parse(req);
  console.log('data!', data);

  // calculate phone hmac
  // eslint-disable-next-line camelcase
  const phone_hmac = hashPhone(data.From);

  // find or create contact based on phone_hmac
  let patronId;
  const dbPatron = await db('patron')
    .where({ phone_hmac })
    .first();
  if (!dbPatron) {
    // eslint-disable-next-line camelcase
    const encrypted_phone = encrypt(data.From);
    const [newPatron] = await db('patron')
      .insert({ phone_hmac, encrypted_phone })
      .returning('*');
    patronId = newPatron.id;
  } else {
    patronId = dbPatron.id;
  }

  // find or create servicing_ltl_phone_num_id
  let servicingPhoneId;
  const dbServicePhone = await db('lt_phone_number')
    .where({ phone_number: data.To })
    .first();
  if (!dbServicePhone) {
    const [newServicePhone] = await db('lt_phone_number')
      .insert({ phone_number: data.To })
      .returning('*');
    servicingPhoneId = newServicePhone.id;
  } else {
    servicingPhoneId = dbServicePhone.id;
  }

  // construct write payload
  // eslint-disable-next-line camelcase
  const raw_twilio_meta = {
    fromZip: data.FromZip,
    messageSid: data.MessageSid,
    numMedia: data.NumMedia,
    fromCountry: data.FromCountry,
    fromState: data.FromState,
    fromCity: data.FromCity,
    accountSid: data.AccountSid,
    numSegments: data.NumSegments,
  };

  // if after hours send auto responder
  let afterHours = false;
  if (timestamp.hour() <= 8 || timestamp.hour() >= 20) {
    afterHours = true;
  }

  // send num media auto responder
  let hasMedia = false;
  if (
    data.NumMedia !== undefined &&
    data.NumMedia !== null &&
    data.NumMedia !== '0'
  ) {
    hasMedia = true;
  }

  const writePayload = {
    patron_id: patronId,
    body: data.Body,
    servicing_ltl_phone_num_id: servicingPhoneId,
    direction: 'in',
    raw_twilio_meta,
    has_media: hasMedia,
  };

  // write to db
  await db('message').insert(writePayload);

  // initiate twiml response
  const twiml = new MessagingResponse();

  let returnMessage = null;
  if (afterHours && hasMedia) {
    returnMessage =
      "Let's Text is staffed from 8am to 8pm, we'll answer as soon as we can! Also, this is a text-only service that doesn't support images or other media.";
  } else if (afterHours) {
    returnMessage =
      "Let's Text is staffed from 8am to 8pm, we'll answer as soon as we can!";
  } else if (hasMedia) {
    returnMessage =
      "Let's Text is a text-only service that doesn't support images or other media.";
  }

  if (returnMessage) {
    twiml.message(returnMessage);
  }
  // otherwise send empty response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};
