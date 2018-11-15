const map = require('lodash/map');
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const dbConnection = require('../knex');
const transport = require('../email/connectors/transport');

const db = dbConnection();

module.exports = async function(req, res) {
  // consider validing a token / jwt before processing.
  // For now, leaving wide open.

  // get response ratings
  const responseRatings = await db('unprocessed_message_rating_buckets').select(
    db.raw('max(response_time_rating) as max_rating'),
    db.raw('sum(count)::numeric as total')
  );

  // end if no need to send responders
  if (responseRatings.length === 0) {
    res.status(200).send('ok');
  }
  const [responseRatingSummary] = responseRatings; // grab the first and only row

  console.log('responseRatings', responseRatings);
  console.log('responseRatingsSummary', responseRatingSummary);

  // if the max rating is 1, then we just want to grab shift assignments equal to 1.
  // if its GT 1 then we need all shit assignments LT max rating
  // this prepares the comparison operator
  const operation = responseRatingSummary.max_rating > 1 ? '<' : '=';
  console.log('operation', operation);
  // get current shift assignments that meet notification threshold
  const needToNotify = await db('current_shift_assignments')
    .join('lt_user', 'current_shift_assignments.user_id', '=', 'lt_user.id')
    .where(
      'current_shift_assignments.rating',
      operation,
      responseRatingSummary.max_rating
    );

  console.log('needToNotify', needToNotify);

  const body = `There are messages that require your attention. Log in at ${
    process.env.FRONTEND_HOST
  }`;

  // map over and notify
  map(needToNotify, async user => {
    if (user.sms_notify) {
      twilioClient.messages
        .create({
          from: process.env.TWILIO_SEND_NUMBER,
          body,
          to: user.mobile,
        })
        .then(message => console.log(message.sid))
        .done();
    }

    if (user.email_notify) {
      // 3. Email them that reset token
      const messageData = {
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject: 'Lets Text messages require your attention!',
        text: body,
        html: body,
      };
      await transport.sendMail(messageData);
    }
  });

  res.status(200).send('ok');
};
