export const API_URL = process.env.REACT_APP_API_URL;
export const AUTH_CONFIG = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  callbackUrl: process.env.REACT_APP_CB_URL,
  apiUrl: process.env.REACT_APP_AUDIENCE,
  editScope: process.env.REACT_APP_AUTH0_HLPC_EDIT_SCOPE
};
