/* eslint-disable */
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();
const PRIVATE_KEY_SECRET_VERSION = "projects/930434208308/secrets/google-sheets-private-key/versions/1";
const CLIENT_EMAIL_SECRET_VERSION = "projects/930434208308/secrets/google-sheets-client-email/versions/1";

async function getSecret (secretName) {
    const [accessResponse] = await client.accessSecretVersion({
        name: secretName,
      });
    
      const responsePayload = accessResponse.payload.data.toString('utf8');
      return responsePayload;        
}

module.exports = {
    
    
    getCreds: async () => {
        const client_email = await getSecret(CLIENT_EMAIL_SECRET_VERSION);
        let private_key = await getSecret(PRIVATE_KEY_SECRET_VERSION);
        private_key = private_key.replace(/\\n/g, '\n').slice(1);
        const creds = {"client_email": client_email,
                        "private_key": private_key};
        return creds;
    }
};

/* {
    getSecret: async (secretName) => {
        const [accessResponse] = await client.accessSecretVersion({
            name: secretName,
          });
        
          const responsePayload = accessResponse.payload.data.toString('utf8');
          console.info(`Payload: ${responsePayload}`);
        
    },
    "type": "service_account",
    "project_id": "process.env.GOOGLE_SHEETS_PROJECT_ID",
    "private_key_id": process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
    "private_key": "projects/930434208308/secrets/google-sheets-private-key/versions/1", //process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),//GoogleSheetsPrivateKey,//
    "client_email": "projects/930434208308/secrets/google-sheets-client-email/versions/1", // process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_SHEETS_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.GOOGLE_SHEETS_CERT_URL
};*/