// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3ffcesius8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-nprun7v8.auth0.com',            // Auth0 domain
  clientId: 'nwSgbwANp9mSGkXIoho2Ruwj3r1ics7H',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
