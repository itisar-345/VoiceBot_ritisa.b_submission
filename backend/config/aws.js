// config/aws.js  –  ESM‑safe
import {
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SageMakerRuntimeClient } from "@aws-sdk/client-sagemaker-runtime";
import dotenv from "dotenv";
dotenv.config();

const REGION = process.env.AWS_REGION || "us-west-2";

export const cognito = new CognitoIdentityProviderClient({ region: REGION });

export const ddbDoc = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
  { marshallOptions: { removeUndefinedValues: true } }
);

export const sagemaker = new SageMakerRuntimeClient({ region: REGION });
