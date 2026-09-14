import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { errorResponse } from "../lib/aws/authz.js";
import { json, parseBody } from "../lib/http.js";

const client = new CognitoIdentityProviderClient({});

export async function login(event) {
  try {
    const { email, password } = parseBody(event);
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }));
    return json(200, result.AuthenticationResult);
  } catch (e) {
    if (e.name === "NotAuthorizedException" || e.name === "UserNotFoundException") {
      return json(401, { error: "Incorrect email or password" });
    }
    return errorResponse(e);
  }
}

export async function refresh(event) {
  try {
    const { refreshToken } = parseBody(event);
    const result = await client.send(new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }));
    return json(200, result.AuthenticationResult);
  } catch (e) {
    if (e.name === "NotAuthorizedException") {
      return json(401, { error: "Session expired" });
    }
    return errorResponse(e);
  }
}
