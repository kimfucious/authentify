/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAuthentifya6e66045UserPoolId = process.env.AUTH_AUTHENTIFYA6E66045_USERPOOLID

Amplify Params - DO NOT EDIT */

exports.handler = (event, context, callback) => {
  console.log("EVENT:", event);
  if (
    event.request.privateChallengeParameters.secretLoginCode ===
    event.request.challengeAnswer
  ) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }

  // Return to Amazon Cognito
  callback(null, event);
};
