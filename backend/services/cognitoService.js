import {
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognito } from "../config/aws.js";
import dotenv from "dotenv";
dotenv.config();

const ClientId = process.env.COGNITO_CLIENT_ID;
const UserPoolId = process.env.COGNITO_USER_POOL_ID;

export const registerUser = async (email, password) => {
  await cognito.send(
    new SignUpCommand({
      ClientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    })
  );

  // auto‑confirm for dev
  await cognito.send(
    new AdminConfirmSignUpCommand({
      UserPoolId,
      Username: email,
    })
  );
  return { message: "Signup OK" };
};

export const authenticateUser = async (email, password) => {
  const { AuthenticationResult } = await cognito.send(
    new InitiateAuthCommand({
      ClientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: { USERNAME: email, PASSWORD: password },
    })
  );
  return AuthenticationResult;            // { IdToken, AccessToken, … }
};
