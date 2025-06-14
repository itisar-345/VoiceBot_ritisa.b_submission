import { ddbDoc } from "../config/aws.js";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "VoiceChatMessages";

export const saveChat = (email, prompt, response) =>
  ddbDoc.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { email, ts: Date.now(), prompt, response },
    })
  );

export const getChats = async (email) => {
  const { Items } = await ddbDoc.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "email = :e",
      ExpressionAttributeValues: { ":e": email },
      ScanIndexForward: false,
      Limit: 50,
    })
  );
  return Items;
};
