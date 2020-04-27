/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAuthentifya6e66045UserPoolId = process.env.AUTH_AUTHENTIFYA6E66045_USERPOOLID

Amplify Params - DO NOT EDIT */

const digitGenerator = require("crypto-secure-random-digit");
const AWS = require("aws-sdk");

const ses = new AWS.SES();

const sendEmail = async (emailAddress, secretLoginCode, username) => {
  const params = {
    Destination: { ToAddresses: [emailAddress] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
                  <head>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                          "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
                          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                      }
                      .lead-1 {
                        font-size: 1.5rem;
                        font-weight: 300;
                      }
                      .lead-2 {
                        font-size: 1.25rem;
                        font-weight: 300;
                      }
                      .lead-3 {
                        font-size: 1.rem;
                        font-weight: 300;
                      }

                      .display {
                        font-size: 6rem;
                        font-weight: 300;
                        line-height: 1.2;
                        margin: 1rem;
                      }
                    </style>
                  </head>
                  <body>
                    <h2 class="display">Psst! Hey, ${username}.</h2>
                    <h3 class="lead-1">Here's your code to sign in to Authentify: ${secretLoginCode}</h3>
                  </body>
                </html>`
        },
        Text: {
          Charset: "UTF-8",
          Data: `🕵️ Psst!  Hey, ${username}!\nHere's your code to sign in to Authentify: ${secretLoginCode}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "🕵️ Your Authentify sign-in code"
      }
    },
    Source: process.env.SES_FROM_ADDRESS
  };
  await ses.sendEmail(params).promise();
};

exports.handler = async (event, context, callback) => {
  let secretLoginCode;
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session
    // Generate a new secret login code and mail it to the user
    secretLoginCode = digitGenerator.randomDigits(6).join("");
    await sendEmail(
      event.request.userAttributes.email,
      secretLoginCode,
      event.userName
    );
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // then needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode = previousChallenge.challengeMetadata.match(
      /CODE-(\d*)/
    )[1];
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  callback(null, event);
};
