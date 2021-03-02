const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

/**
 * Client to perform AWS Cognito Identity Provider operations.
 */
class CognitoIdPClient {
  /**
   * Cognito Identity Provider configuration.
   * @typedef {Object} CognitoIdPConfig
   * @property {string} region          The AWS region to which this client will send requests.
   * @property {string} accessKeyId     AWS access key ID.
   * @property {string} secretAccessKey AWS secret access key.
   * @property {string} userPoolId      The user pool ID for the user pool where you want to 
   *                                    handle information about the user.
   */

  /**
   * Initializes a new instance of the AWS Cognito Identity Provider client.
   * @param {CognitoIdPConfig} config Cognito Identity Provider configuration.
   */
  constructor(config) {
    this.config = config;
    const cognitoIdPConfig = {
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      }
    };
    this.cognitoIdPClient = new CognitoIdentityProviderClient(cognitoIdPConfig);
  }

  /**
   * Cognito user attribute.
   * @typedef {Object} CognitoUserAttribute
   * @property {string} Name    The name of the attribute.
   * @property {string} Value   The value of the attribute.
   */

  /**
   * Cognito user information.
   * @typedef {Object} CognitoUser
   * @property {string} Username
   *    The user name of the user you wish to retrieve from the get user request.
   * @property {[CognitoUserAttribute]} UserAttributes
   *    An array of name-value pairs representing user attributes.
   */

  /**
   * Gets the specified user by user name in a user pool as an administrator.
   * @param {string} username The user name of the user you wish to retrieve.
   * @returns {CognitoUser} The user attributes and metadata for a user.
   */
  async adminGetUser(username) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.config.userPoolId,
      Username: username,
    });
    const userResponse = await this.cognitoIdPClient.send(command);
    return userResponse;
  }

  async adminUpdateUserAttributes(username, attributes) {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.config.userPoolId,
      Username: username,
      UserAttributes: attributes,
    });
    const updateResponse = await this.cognitoIdPClient.send(command);
    return updateResponse;
  }
}

module.exports = CognitoIdPClient;
