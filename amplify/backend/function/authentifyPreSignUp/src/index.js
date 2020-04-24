/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAuthentifya6e66045UserPoolId = process.env.AUTH_AUTHENTIFYA6E66045_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider();
const checkForExistingUser = async (email, userPoolId) => {
  const params = {
    UserPoolId: userPoolId
    // Filter: `email = "${email}"`
  };

  const { Users: allUsers } = await cognito.listUsers(params).promise();

  const matchedUsers = allUsers.filter((user) => {
    const potentialMatches = user.Attributes.filter((attribute) => {
      console.log("Attribute Name: ", attribute.Name);
      return (
        attribute.Name === "email" ||
        attribute.Name === "custom:appleEmail" ||
        attribute.Name === "custom:googleEmail" ||
        attribute.Name === "preferred_username"
      );
    }).map((item) => item.Value);

    console.log("Potential email matches", potentialMatches);

    return potentialMatches.includes(email);
  });

  console.log("Matched Users: ", matchedUsers);
  return Promise.resolve(matchedUsers.length ? true : false);
};
const findUserByEmail = async (providerEmail, username, userPoolId) => {
  const providerName = username.split("_")[0];
  const customEmailAttribute =
    providerName === "SignInWithApple"
      ? "custom:appleEmail"
      : "custom:googleEmail";

  const params = {
    UserPoolId: userPoolId
  };

  // Unfortunately, Cognito does not allow search (including listUsers with a filter)
  // using custom attributes.  I would not do the below in the real world with a lot of users.
  // Alternatives are covered in the README file of this project
  const { Users: allUsers } = await cognito.listUsers(params).promise();

  console.log("All Users: ", allUsers);
  console.log("CusomtEmailAttribute", customEmailAttribute);

  const matchedUsers = allUsers.filter(
    (user) => {
      const existingUserPotentialEmailMatch = user.Attributes.filter(
        (attribute) => {
          console.log("Attribute Name: ", attribute.Name);
          return (
            attribute.Name === "email" ||
            attribute.Name === customEmailAttribute
          );
        }
      ).map((item) => item.Value)[0];

      console.log(
        "User One Custom Email Attribute/Value",
        existingUserPotentialEmailMatch
      );
      console.log("Provider Email", providerEmail);
      return existingUserPotentialEmailMatch === providerEmail;
    }
    // user.Attributes.email =providerEmail ||
  );
  console.log("Matched Users: ", matchedUsers);
  return matchedUsers.length ? matchedUsers[0].Username : null;
};

const linkProviderToUser = async (
  username,
  userPoolId,
  providerName,
  providerUserId
) => {
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: "Cognito"
    },
    SourceUser: {
      ProviderAttributeName: "Cognito_Subject",
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName
    },
    UserPoolId: userPoolId
  };

  const result = await new Promise((resolve, reject) => {
    cognito.adminLinkProviderForUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  return result;
};

exports.handler = async (event, context, callback) => {
  console.log("EVENT TRIGGER SOURCE: ", event.triggerSource);
  console.log("EVENT: ", event);
  if (event.triggerSource === "PreSignUp_ExternalProvider") {
    const foundUser = await findUserByEmail(
      event.request.userAttributes.email,
      event.userName,
      event.userPoolId
    );

    console.log("Found User: ", foundUser);
    if (foundUser) {
      const [providerName, providerUserId] = event.userName.split("_"); // event userName example: "Facebook_12324325436"
      await linkProviderToUser(
        foundUser,
        event.userPoolId,
        providerName,
        providerUserId
      );
      return callback(null, event);
    } else {
      console.log(
        "User does not exist with email " + event.request.userAttributes.email
      );
      return callback(
        "User does not exist with email " + event.request.userAttributes.email
      );
    }
  } else if (event.triggerSource === "PreSignUp_AdminCreateUser") {
    console.log("Trigger Source: ", event.triggerSource);
    console.log("Should be PreSignUp_AdminCreateUser");
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    event.response.autoVerifyPhone = true;
    return callback(null, event);
  } else {
    console.log("Trigger Source: ", event.triggerSource);
    console.log("Other TriggerSource!");
    const existingUser = await checkForExistingUser(
      event.request.userAttributes.email,
      event.userPoolId
    );
    if (existingUser) {
      console.log(
        "A user with email, " +
          event.request.userAttributes.email +
          ", already exists"
      );
      return callback(
        "A user with email, " +
          event.request.userAttributes.email +
          ", already exists"
      );
    } else {
      event.response.autoConfirmUser = false;
      event.response.autoVerifyEmail = false;
      event.response.autoVerifyPhone = false;
      return callback(null, event);
    }
  }
};
