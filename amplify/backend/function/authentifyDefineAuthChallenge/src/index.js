/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAuthentifya6e66045UserPoolId = process.env.AUTH_AUTHENTIFYA6E66045_USERPOOLID

Amplify Params - DO NOT EDIT */

exports.handler = (event, context, callback) => {
  console.log("EVENT", event);
  if (
    event.request.session &&
    event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false
  ) {
    // The user provided a wrong answer 3 times; fail auth
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else if (
    event.request.session &&
    event.request.session.length &&
    event.request.session.slice(-1)[0].challengeResult === true
  ) {
    // The user provided the right answer; succeed auth
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // The user did not provide a correct answer yet; present challenge
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }
  // Return to Amazon Cognito
  callback(null, event);
};
