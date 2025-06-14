// middlewares/verifyJwtSocket.js
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";
dotenv.config();

const jwks = jwksRsa({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
});

/**
 * Verify a Cognito IdToken (passed from the client)
 * @param {string} token  raw JWT (no "Bearer " prefix)
 * @returns {Promise<object>} decoded payload
 */
export const verifyJwtSocket = (token) =>
  new Promise((resolve, reject) => {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded?.header?.kid) return reject("Bad token");

    jwks.getSigningKey(decoded.header.kid, (err, key) => {
      if (err) return reject(err);
      jwt.verify(token, key.getPublicKey(), (err, payload) => {
        if (err) return reject(err);
        resolve(payload); // contains .email, .sub, etc.
      });
    });
  });
