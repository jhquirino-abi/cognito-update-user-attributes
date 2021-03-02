#!/usr/bin/env node
const yargs = require("yargs");
const chalk = require('chalk');
const CognitoClient = require('./services/cognito-client');

const options = yargs
    .usage("Usage: -r <region> -k <accessKeyId> -s <secretAccessKey> -p <userPoolId> -u <username> -a <attr1=value1,attr2=value2,attrN=valueN>")
    .option("r", { alias: "region", describe: "AWS region", type: "string", demandOption: true})
    .option("k", { alias: "accessKeyId", describe: "AWS access key ID", type: "string", demandOption: true})
    .option("s", { alias: "secretAccessKey", describe: "AWS secret access key", type: "string", demandOption: true})
    .option("p", { alias: "userPoolId", describe: "AWS Cognito user pool ID", type: "string", demandOption: true})
    .option("u", { alias: "username", describe: "User name in User Pool", type: "string", demandOption: true})
    .option("a", { alias: "attributes", describe: "Collection of attributes to update, in name=value format and separated with comma", type: "string", demandOption: false})
    .argv;

const cognitoClient = new CognitoClient({
  region: options.region,
  accessKeyId: options.accessKeyId,
  secretAccessKey: options.secretAccessKey,
  userPoolId: options.userPoolId,
});

const getUser = async (username) => {
  console.log(chalk.gray(`Reading user '${username}'...`));
  try {
    const user = await cognitoClient.adminGetUser(username);
    console.log('\t' + chalk.blueBright('Username') + ' : ' + chalk.green(`${user.Username}`));
    if (user.UserAttributes && user.UserAttributes.length) {
      console.log('\t' + chalk.green(`${user.UserAttributes.length}`) + chalk.blueBright(' atributes') + ':');
      for (let index = 0; index < user.UserAttributes.length; index++) {
        const attribute = user.UserAttributes[index];
        console.log('\t\t' + chalk.blueBright(`${attribute.Name}`) + ' : ' + chalk.green(`${attribute.Value}`));
      }
    }
    return user;
  } catch (error) {
    console.error(chalk.red(error.message));
  }
};

const parseAttributes = (attributes) =>{
  if (attributes && attributes.length) {
    console.log(chalk.gray('Parsing attributes to update...'));
    const attributesArray = options.attributes.split(',');
    if (attributesArray && attributesArray.length) {
      let parsedAttributes = [];
      for (let index = 0; index < attributesArray.length; index++) {
        const attributeItem = attributesArray[index];
        const attributeParts = attributeItem.split('=');
        if (!attributeParts || attributeParts.length != 2) {
          console.log(chalk.redBright(`Invalid attribute format on position ${index}: '${attributeItem}'.`));
          parsedAttributes = undefined;
          break;
        }
        parsedAttributes.push({
          Name: attributeParts[0],
          Value: attributeParts[1],
        });
      }
      if (parsedAttributes) console.log(parsedAttributes);
      return parsedAttributes;
    } else {
      console.log(chalk.redBright('Empty list of attributes to update.'));
    }
  }
  return undefined;
};

const updateUserAttributes = async (username, attributes) => {
  console.log(chalk.gray(`Updating attributes for user '${username}'...`));
  try {
    const response = await cognitoClient.adminUpdateUserAttributes(username, attributes);
    console.log('\thttpStatusCode: ' + chalk.blueBright(`${response['$metadata'].httpStatusCode}`));
    console.log('\tattempts: ' + chalk.blueBright(`${response['$metadata'].attempts}`));
    console.log('\trequestId: ' + chalk.blueBright(`${response['$metadata'].requestId}`));
    return response;
  } catch (error) {
    console.error(chalk.red(error.message));
  }
}

getUser(options.username)
  .then((user) => {
    if(!user) return;
    const attributes = parseAttributes(options.attributes);
    if (attributes) {
      updateUserAttributes(user.Username, attributes)
        .then((response) => {
          if (!response) return;
          getUser(user.Username);
        });
    }
  });
