# Authentify : a Cognito Federated Sign-in Demo

## What is Authentify?

Authentify is an effort to develop and document the best way to handle federated logins using AWS Cognito.

I got started on this because I needed to add **Sign in with Apple** to a React Native app. This documentation currently covers React only, but I may add React Native later. Most of the basic concepts are the same.

Authentify supports federated sign-in with Apple and Google via AWS Cognito.

💵 **_Setting up [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/) requires an [Apple Developer](https://developer.apple.com/) account, which costs money. Using AWS services also costs money, but it's pay as you go, and you'll probably stay within th free tier if just testing Authentify out_**

Authentify was created with the following:

- [AWS Amplify](https://aws-amplify.github.io/docs/js/start?platform=purejs)
- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
- [Redux](https://redux.js.org/)

## What does Authentify do?

Authentify demonstrates how an app can use AWS Cognito to allow users to sign in with third-party credentials (e.g. Amazon, Apple, Facebook, & Google), which then allows the user to access both Authentify "private pages" (those requiring the user to be signed in to see) and its backend AWS resources, like cloud databases, serverless functions, etc.

### Here's the abbreviated flow:

1. A user accesses Authentify.
2. If they have not already signed up, they will need to click "New User" and follow the sign up process, before they can sign in.
3. If they are not already signed in, they'll see the Sign-in page, where they are presented with Sign-in buttons.
4. If they are already signed in, they'll be sent to the Home page, with a brief Loading intermission.

🤔 What I mean by "already signed in", is that a user can return to Authentify, having already signed in prior, and be considered signed in.

5. When the (signed up) user clicks on a Sign-in button, the auth process starts for the respective provider (e.g. Apple or Google).
6. Upon successful authentication, they are returned to Authentify.
7. There is a loading process, and then the Home page is shown.
8. If an error occurs in the authentication process, the user is returned to the Authentify Sign-in page.
9. When the user clicks the Sign out button, they are shown the Sign-in screen.

### Here's a few rules:

1. While the user is signed in, they can access the Home page and open pages (i.e 404, Loading, etc.).
2. While the user is not signed in, they can access the Sign-in page and open pages.
3. When the user signs out, all user data should be removed from Authentify's Redux state.

Sounds pretty simple, right?

🏗️️ _Below this point is a work in progress._

## This is the part that's too long to read

🛠️ To work with this repo with your own AWS backend follow the instructions [here](#how-to-clone-this-repo-and-use-it-for-yourself-with-your-own-aws-backend).

### Some basic setup detail

There are five pages in Authentify: Home, Loading, Not Found (404), and Sign-in. The fifth page is AuthCallback, which is used when receiving an auth response from an auth provider (i.e. Apple, Google, etc.)

When the user visits Authentify, the **Sign-in** page is displayed.

### Signing Up

The user must sign up, before they can sign in, so they click on `New User`, which displays a Sign Up Form.

Upon successful submittal of the form (there is client and server validation via Pre sign-up lambda trigger function), the user is shown a screen where they are to enter a verification code. This code is sent from Cognito via email.

Once the user succesfully submits the code, they are shown a success message and a button that takes them back to the Sign In page. Here they can choose to: Sign in without Password, Sign in with Apple, or Sign in with Google.

TODO: Talk about the Apple and Google email addresses.

TODO: Talk about Access Code (Challenge) or remove it if not implementing.

TODO: Talk about error handling.

### Signing In

TODO: describe Sign in without Password (not implemented yet)

When the user clicks one of the **Sign in with...** buttons for Apple or Google, a federated sign-in process is initiated.

The user is navigated away from Authenitfy to an authorization site, where they can enter their credentials for Apple or Google.

Upon successful third-party authorization, a Pre sign-up lambda function will attempt to match the Apple or Google email with that of the now existing Cognito user. If it is successful, it will link the `EXTERNAL_PROVIDER` account with the user's Cognito (username based) account.

TODO: the known bugs link below doesn't work on Github (prolly a bug)
There are a few quirks to this implmentation. See the [Known Bugs section](#known-bugs-🐛) for more info.

### The Redirect URL (redirect_url)

Upon a successful third-party authentication, the user is returned to Authenitfy by way of a **redirect_url**.

These are different animals in web browsers than they are in native apps. The below covers behavior specific to working in a web browser.

TODO: Create a separate section/repo for React Native.

The **redirect_url** is configured in the associated **Cognito User Pool** in the AWS Console. Authentify's user pool (and identity pool) was created with Amplify, using `amplify auth add`. See [here](#to-rebuild-amplify-project) for details on that.

In Authentify's development environment, the **redirect_url** is set to <https://localhost:3000/auth-callback.>

💁🏽‍♀️ **_`npm start` in `package.json` is configured to launch this app using HTTPS on port 3000. The reason for this is because HTTPS is required in order for federatedSignIn to work. The port 3000 is just the default for a Create React App. You can change this as desired. If you're on windows see [here](#windows)._**

When the user is returned to Authenitfy, after successfuly authenticating with Apple or Amazon, the URL in the address bar is the **redirect_uri** with some parameters tacked on:

```console
https://localhost:3000/auth-callback/?code=[somecode]&state=[somestate]
```

Note the **auth-callback** in the above. This will navigate to the AuthCallback page of the app, as defined in the Authentify's [router configuration](https://github.com/kimfucious/authentify/blob/master/src/router/AppRouter.js#L14).

The **AuthCallback** page will do one of three things:

TODO: Add other logic for other errors related to Authorization code and "User already exists" bug.

1. If there is no error in the **redirect_url**, it will navigate the user to the **Loading** page.
2. If there is an error in the **redirect_url**, it will show an error message if the error does not include the word "cancelled".
3. If there is an error in the **redirect_url** and the error includes the word "cancelled", it will navigate the user back to the **Sign-in** page.

☝️ **_The error handling above is my personal preference, as I feel the user knows they just clicked cancel, and they don't need to see an error message about what they just did._**

At this point a few things can have happened:

1. The user has successfully authenticated via a third party.
2. The user has cancelled the authetication process.
3. There was an error during the authentication process.

If we did nothing else in Authentify at this point, the user would be stuck on either AuthCallback, Loading, or Sign-in.

Both the AuthCallback page (which only shows if there is an error that does not included "cancelled") and the Sign-in pages have buttons to take an action. But the Loading page just sits and spins.

✔️ Checkpoint: The successfully authenticated user is sitting on the Loading page, per the above. How to they get to the Home page?

### Bring out the Hub 🎡

To get Authentify to perform specific actions when certain authentication events happen, we need to setup listeners.

[Amplify Hub](https://aws-amplify.github.io/docs/js/hub) allows us to do with relative ease.

🚀 **_When using Authentication with AWS Amplify, you don’t need to refresh Amazon Cognito tokens manually. The tokens are automatically refreshed by the library when necessary._**

Authentify's main [index.js](https://github.com/kimfucious/authentify/blob/master/src/index.js#L36) file is where the Hub is configured and listens for two key events: **configured** and **signIn**.

Let's talk about **signIn** first.

When a user successfully signs into Authentify with Apple or Google via Cognito, the **signIn** event is "heard" by Hub, because of the **auth** listener, and it executes the code in the **switch case** matching **"signIn"**.

This does one thing: it calls the **handleSignIn** function, which looks like this:

```js
const handleSignin = async (userInfo) => {
  try {
    if (!userInfo) {
      userInfo = await Auth.currentAuthenticatedUser();
    }
    console.log("🚚 Dispatching user data to Redux...");
    store.dispatch(signInCognitoUser(userInfo));
  } catch (error) {
    console.warn(error);
  }
};
```

In brief, this function uses the Amplify Auth method, **currentAuthenticatedUser** to get information from the user in Cognito. As this function may receive `userInfo` from other callers, it's only used if the supplied argument, `userInfo`, is falsy.

This **userInfo** data is then set to a Redux action creator, [signInCognitoUser](https://github.com/kimfucious/authentify/blob/master/src/actions/authActions.js), where it gets dispatched to Redux state, after some massaging.

✔️ **_Checkpoint: The user is successfully signed in. They are on the Loading page. How do they get to the Home page?_**

### The Loading Page

Because there are some async actions that take place, like getting user data from Cognito with **Auth.currentAuthenticatedUser()**, there will likely be a brief moment of time where the user is waiting for said actions to finish. Rather than have the app sit there looking like it's not doing anything, we send the user to the **Loading** page during such times.

In the auth event **signIn** case, the user is sent to the **Loading** page from the AuthCallback page as mentioned prior. There is one other case where the user is sent to the **Loading** page: when Hub listener "hears" the **configured** auth event, which is covered [a bit later on](#the-configuration-auth-event).

The [Loading page](https://github.com/kimfucious/authentify/blob/master/src/pages/Loading.js) is configured to read Redux state, using a **useSelector** hook (from the react-redux library).

It's looking specifically for the **username**:

```js
const { username } = useSelector((state) => state.auth);
```

The Loading page also uses a React **useEffect** hook to "watch" the **username** in the aforementioned selector.

```js
useEffect(() => {
  if (username) {
    console.log(
      "👀 Loading page sees user data in state.  🏠 Redirecting to home."
    );
    history.replace("/home");
  }
}, [history, username]);
```

**username** will be _undefined_ until the following things have occurred:

1. User successfully authenticates with Apple or Google
2. Hub "hears" the auth event, **"signIn"**
3. Hub runs the **handleSignIn** function
4. The **handleSignIn** function dispatches the user data to state (via the signInCognitoUser action creator)

Once **username** appears in state, the useEffect hook will navigate the user to the Home page.

✔️ Checkpoint: So that's all good for when a user signs on, but what about the **configuration** auth event?

### The Configuration Auth Event

Once a user has successfully authenticated with a third-party auth provider in Authentify, that login lasts for 30 days. That's the default setting in the **Refresh token expiration (days)** setting found in the **App Client** configuration in the **AWS Cognito User Pool**.

The upshot of this is that when a user returns to Authentify, before 30 days have elapsed, without having logged out, they will skip the third party auth process.

Strangely, for me at least, the auth event, **signIn** does not occur, which means that Hub will not trigger the **handleSignIn** function. And thus, we handle this scenario with a case block, matching **"configured"** in the Hub auth listener.

```js
    case "configured":
      try {
        if (history.location.pathname.includes("auth-callback")) {
          console.log("🔍 AuthCallback detected!");
        } else {
          const userInfo = await Auth.currentAuthenticatedUser();
          console.log("✔️ User is already signed in", userInfo);
          if (history.location.pathname === "/") {
            console.log("🚦 User coming from sign in. Pushing to loading...");
            history.push("/loading");
          }
          handleSignin();
        }
      } catch (error) {
        if (error === "not authenticated") {
          console.log("👮 User is not signed in");
        } else {
          console.warn("💣 Error in Hub:", error);
        }
        // Auth.currentAuthenticatedUser() throws an error if not signed in
        // We don't push from here as the redirect will be handled by protected routing
      }
      break;
```

#### Explaining the above:

1. When the Hub "hears" the auth event, **"configured"** the above block of code is run.
2. `history.location.pathname` is checked for the inclusion of `auth-callback`, which will be the case when the user has triggered federatedSignIn by clicking on a button on the Sign-in page. This is **_not_** the case when a user is returning to Authentify, having successfully signed in prior, so we hit the `else` clause.
3. The `else` clause calls the async method, `Auth.currentAuthenticatedUser`, which will return an error if the user is not authenticated. In the case, where the user is returning to Authentify, having already authenticated prior (within 30 days of having done so), `Auth.currentAuthenticatedUser` will return the user data, and not throw and error.
4. If the user is coming from `history.location.pathname === "/"`, which is to say, the **Sign-in** page, they will get redirected to the **Loading page**, and the **handleSignin** function will get called.
5. If the user is coming from a `history.location.pathname` of something other than `"/"`, it means that they're following a link to a page in Authentify, rather than coming from the **Sign-in** page. This could be them typing something in the address bar, following an old bookmark, or whatever. In this case, they'll be directed to the page they are looking for, or--more likely--they will hit the **Page Not Found (404)** page.
6. If the user is not authenticated, an error will be thrown. We catch this in the catch block, and if the `error === "not authenticated"`, we handle it quietly with a `console.log`. If the error is something else, we handle it loudly with a `console.warn`. TODO: setup better handling for non "not authorized" errors.

TODO: Talk about protected routes.

TODO: How to prevent unwanted users from signing up i.e. custom auth flow/pre signup lambda trigger.

TODO: Talk about unexplained flash on signout. <== moot point, remove animation on div.

TODO: Talk about Pre sign-up lambda trigger, including adding read access to "auth" and adding "cognito-idp:AdminLinkProviderForUser" to lambda-execution-policy. Also explain that I'm cheating with custom attributes, because they are not searchable.

TODO: Why, when the user is logged in and the user navigates (via the address bar) to a page that does not exist, does the app lose it's state?

## How to clone this repo and use it for yourself with your own AWS backend

### Prerequisites

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
2. [AWS Amplify CLI](https://aws-amplify.github.io/docs/cli-toolchain/quickstart)
3. [Google OAuth setup](https://aws-amplify.github.io/docs/js/cognito-hosted-ui-federated-identity#google-sign-in-instructions)
4. [Apple OAuth setup](https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple#create-an-app-id)

### Use this Repo As-is

You can use this repo as-is and create your own AWS backend by running `amplify init` from within the cloned directory. Should you go this route, you'll accept how things are currently named.

You'll be asked a couple of questions that are specific to you, including the Google OAuth client ID and secret key, for example, but it should "just work" 🙏🏽

If you want to start fresh, follow the instructions below.

### To Rebuild Amplify project

When you clone this repo, it comes down with an Amplify directory. While you can probably edit this information and get things running that way, I've always found it easier to wipe out the `amplify` directory and start from scratch on simple projects like this. If working on a larger project, with a lot of backend resources, that might be a different story.

1. Delete the `amplify` directory from the cloned project
2. Follow the below process, changing values according to your requirements

#### Run: `amplify init`

```console
$ amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project Authentify
? Enter a name for the environment dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start
Using default provider  awscloudformation

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html

? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use default
Adding backend environment dev to AWS Amplify Console app: di00wqe7newuh <== auto generated
⠋ Initializing project in the cloud...
```

#### Run: `amplify auth add`

```console
$ amplify auth add
Using service: Cognito, provided by: awscloudformation

 The current configured provider is Amazon Cognito.

 Do you want to use the default authentication and security configuration? Default configuration with Social Provider (Federation)
 Warning: you will not be able to edit these selections.
 How do you want users to be able to sign in? Username
 Do you want to configure advanced settings? Yes, I want to make some additional changes.
 Warning: you will not be able to edit these selections.
 What attributes are required for signing up? Email
 Do you want to enable any of the following capabilities?
 What domain name prefix you want us to create for you? authentify61179086-61179086
 Enter your redirect signin URI: https://localhost:3000/auth-callback/
? Do you want to add another redirect signin URI No
 Enter your redirect signout URI: https://localhost:3000/
? Do you want to add another redirect signout URI No
 Select the social providers you want to configure for your user pool: Google

 You've opted to allow users to authenticate via Google.  If you haven't already, you'll need to go to https://developers.google.com/identity and create an App ID.

 Enter your Google Web Client ID for your OAuth flow: [your ID goes here]
 Enter your Google Web Client Secret for your OAuth flow:  [your key goes here]
Successfully added resource authentify61179086 locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud
```

#### Run: `amplify function add`

```console
$ amplify function add
Using service: Lambda, provided by: awscloudformation
? Provide a friendly name for your resource to be used as a label for this category in the project: authentifyPreSignUp
? Provide the AWS Lambda function name: authentifyPreSignUp
? Choose the function runtime that you want to use: NodeJS
? Choose the function template that you want to use: Hello World
? Do you want to access other resources created in this project from your Lambda function? Yes
? Select the category auth
Auth category has a resource called authentify12345678
? Select the operations you want to permit for authentify12345678 read

You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAuthentify12345678UserPoolId = process.env.AUTH_AUTHENTIFY12345678?_USERPOOLID

? Do you want to invoke this function on a recurring schedule? No
? Do you want to edit the local lambda function now? No
Successfully added resource authentifyPreSignUp locally.
```

Once complete paste the code from the repo at `amplify/backend/function/authentifyPreSignUp/src/index.js` into the same location in this project locally.

#### Run: `amplify push`

```console
$ amplify push
✔ Successfully pulled backend environment dev from the cloud.

Current Environment: dev

| Category | Resource name       | Operation | Provider plugin   |
| -------- | ------------------- | --------- | ----------------- |
| Auth     | authentify12345678  | Create    | awscloudformation |
| Function | authentifyPreSignUp | Create    | awscloudformation |
? Are you sure you want to continue? (Y/n)
⠧ Updating resources in the cloud. This may take a few minutes...

Lots of stuff happens, and then...

Hosted UI Endpoint: ... <== your endpoint here
Test Your Hosted UI Endpoint: ... <== your enpoint test URL here
```

#### Configure Pre sign-up lambda trigger

Note that if you have multiple environments (e.g. "dev", "prod", etc.), you'll need to do this for each one.

##### Enable Pre sign-up trigger in Cognito User Pool

1. Open Cognito in AWS Console.
2. Click on Manage User Pools
3. Click on the User Pool that looks like `authentifya6e66045_userpool_12345678-dev`
4. On the left, under "General Settings", click on Triggers
5. In the top left section, labeled Pre sign-up, select the function that looks like `amplifyPreSignUp-dev` from the Lambda Function drop down menu.
6. Click Save Changes

##### Edit execution policy for IAM role

In order for the Pre sign-in function to link federated accounts to existing user accounts, you'll need to update the execution policy of the lambda role associated with this project

1. Open IAM Management in AWS Console
2. Click Roles in the left menu
3. Search for authentify <== this can be different if you've changed the name in the above steps
4. Find the role that looks like `authentifyLambdaRole6637e7e0-dev` and click on it.
5. On the Permissions tab, expand the item in the table named, `amplify-lambda-execution-policy`
6. Click the Edit Policy button
7. Click the JSON tab
8. Add the entry `"cognito-idp:AdminLinkProviderForUser,"` inside the `Action` array
9. Click the Review Policy Button
10. Click Save changes (you can safely ignore the yellow warning) near Summary

🎉 At this point you have your own working dev setup of Authentify! Run `npm start` in the project root directory to see it in action.

### Edit current configuration method (not sure how to do this quite yet)

You could probably do this, but it seems like more hassle than it's worth, because Amplify makes things so easy.

## Notes

### Apple

1. The icon on the Apple authentication pages will only show if you have an iOS app in the App Store. Dave Moore says so [here](https://stackoverflow.com/questions/58475605/how-can-i-set-a-logo-in-the-sign-in-with-apple-consent-screen). I _believe_ the reason behind this is that web apps are considered supplemental to iOS apps in the Apple mindset. Thus there is no reason to add Sign in with Apple to a website that does not have an iOS app for which it is supplementing.

### Amplify

1. Be sure to exclude amplify/team-provider-info.json from public repositories, .esp when doing federated sign-in with Cognito. This file will expose your secret keys from the third party auth providers.
2. At present, the **Amplify CLI** does not handle adding Apple as an authentication provider. The set for this is all manual. Luckily, since we've added Google as an auth provider, Amplify does do most of the legwork for us, like creating the **User Pool** and **Identity Pool**.

### Windows

1. Running npm on Windows requires the modifcation of **package.json** scripts in order for them to work:

- add `.cmd` to the script names
- change the start script so that it will run the project using HTTP

```json
  "scripts": {
    "build": "react-scripts.cmd build",
    "eject": "react-scripts.cmd eject",
    "levelUp": "standard-version.cmd",
    "levelUpDry": "standard-version.cmd --dry-run",
    "levelUpMajor": "standard-version.cmd --release-as major",
    "levelUpMajorDry": "standard-version.cmd --release-as major --dry-run",
    "levelUpMinor": "standard-version.cmd --release-as minor",
    "levelUpMinorDry": "standard-version.cmd --release-as minor --dry-run",
    "levelUpPatch": "standard-version.cmd --release-as patch",
    "levelUpPatchDry": "standard-version.cmd --release-as patch --dry-run",
    "pushDevelop": "git push --follow-tags origin develop",
    "pushMaster": "git push --follow-tags origin master",
    "start-nossl": "react-scripts.cmd start",
    "start": "set HTTPS=true&&set PORT=3000&&react-scripts.cmd start",
    "test": "react-scripts test"
  },
```

## Known Bugs 🐛

### "Already found an entry for username" error on first federated sign-in

The first time a user signs in with Apple or Google after succesfully signing up Cognito will throw an error.

The second time around, this error does not occur. No app refresh is required for the second attempt to work.

### Federated sign-in changes Cognito user email

It is not uncommon for users to have multiple email addresses. For example, their Apple email may differ from their Google email, and each of those may differ from the email they use to sign up with Cognito.

In an attempt to handle this scenario, Authentify uses custom user attributes in the Cognito User Pool: `custom:appleEmail` and `custom:googleEmail`.

There is some logic in the Pre sign-up lambda function to do the following:

If the provider email matches an existing Cognito user's email or the custom attribute for the provider, the external provider account will be created and linked to the existing Cognito user account

For example, say the Cognito user's email is ada@example.com and their `custom:googleEmail` is set to ada@gmail.com. When they click `Sign in with Google` and authenticate using the email address ada@gmail.com, the Cognito account and the Google external account will be linked.

The bug is that, due to attribute mapping, the Cognito user's email will be overwritten with the Google email address.

TODO: Describe how email gets overwritten when `adminLinkProviderForUser` is run.

This means that when another user, attempts to sign up with ada@example.com, using a different username (e.g. AdaX), they will not be prevented from doing so.

#### Workaround

The above is not an ideal situation, and neither is this work-around.

To get around the aforementioned problem in Authentify, I bascially cheat the system. It's not quite the Kobayashi Maru, but it does kinda work to a point.

In brief, when the user first signs up, I populate the `preferred_username` attribute in the User Pool with the user's original Cognito email address. And when the Pre sign-up function runs, I check all four attributes (email, custom:appleEmail, custom:googleEmail, and preferred_username) before allowing/preventing the creation of the external provider account.

This is obviously hacky, but it works. What doesn't work is this: custom attributes are not searchable.

Why does that matter? Because, in the Pre sign-up lambda function, if we want to do what Authentify actually does, we need to check the custom attributes of `custom:appleEmail` and `custom:googleEmail`. And because we cannot search or use the [ListUsers](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html) API with a filter using custom attributes, we need to list **all** users and work with them.

This is not at all good practice, .esp when the number of users grows. I've only left Authentify the way it is from demonstration purposes.

TODO: write about how "Sign in without Password" is affected by this.

In real life, I believe another solution would be required, such as only allowing "Sign in with..." users that have external provider accounts with emails that match the email address that was used to sign up with to sign in.

## References

- [AWS Amplify Javascript Authentication (official)](https://aws-amplify.github.io/docs/js/authentication)
- [AWS Amplify Javascript Hub (official)](https://aws-amplify.github.io/docs/js/hub)
- [AWS Cognito Developerguide (official)](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [Social Provider Setup Docs (Amazon, Facebook, Google) by Amplify](https://aws-amplify.github.io/docs/js/cognito-hosted-ui-federated-identity#social-provider-setup)
- [The Complete React Native Guide to User Authentication with the Amplify Framework by Nader Dabit](https://dev.to/aws/the-complete-react-native-guide-to-user-authentication-with-the-amplify-framework-ib2)
- [Making setInterval Declarative with React Hooks by Dan Abramov](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
