import { InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime";
import { sagemaker } from "../config/aws.js";
import dotenv from "dotenv";
dotenv.config();

export const askModel = async (prompt) => {
  const { Body } = await sagemaker.send(
    new InvokeEndpointCommand({
      EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
      ContentType: "application/json",
      Accept: "application/json",
      Body: JSON.stringify({ prompt }),
    })
  );
  const text = await Body.transformToString("utf-8");
  return JSON.parse(text).response;
};
