// TODO: Done Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'urff0mjbq9'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Create an Auth0 application and copy values from it into this map
  domain: 'dev-l-27rb3t.us.auth0.com', // Auth0 domain
  clientId: 'uJ35tUtCN9Cla5sYQ0WCoAw3vFFkT6mS', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
