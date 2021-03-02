# Cognito - User Attributes Update

This is a simple command line client to setup user attributes on AWS Cognito User Pool.

## Prerequisites

* AWS Account must be setup with access key, ensure the account has authorized to perform `cognito-idp:AdminGetUser` and `cognito-idp:AdminUpdateUserAttributes` operations on User Pool.
  * `region`: This is where your AWS resources are [allocated](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/).
  * `accessKeyId`: This must be provided by your administrator, see [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).
  * `secretAccessKey`: This must be provided by your administrator, see [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).
* AWS Cognito User Pool must be setup with attributes and existing user(s).
  * `userPoolId`: On [Amazon Cognito](https://console.aws.amazon.com/cognito/home) > Manage User Pools > Select your user pool > General Settings > Pool Id
  * `username`: On [Amazon Cognito](https://console.aws.amazon.com/cognito/home) > Manage User Pools > Select your user pool > General Settings > Users and groups > Users > Username
  * `attributes`: On [Amazon Cognito](https://console.aws.amazon.com/cognito/home) > Manage User Pools > Select your user pool > General Settings > Attributes

## Getting Started

1. Clone current repository:

    ```bash
    git clone https://github.com/jhquirino-zx/cognito-update-user-attributes.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Execute:

    ```bash
    node .
    ```

    This should return something like:

    ```bash
    Usage: -r <region> -k <accessKeyId> -s <secretAccessKey> -p <userPoolId> -u <username> -a <attr1=value1,attr2=value2,attrN=valueN>

    Options:
        --help             Show help                                     [boolean]
        --version          Show version number                           [boolean]
    -r, --region           AWS region                          [string] [required]
    -k, --accessKeyId      AWS access key ID                   [string] [required]
    -s, --secretAccessKey  AWS secret access key               [string] [required]
    -p, --userPoolId       AWS Cognito user pool ID            [string] [required]
    -u, --username         User name in User Pool              [string] [required]
    -a, --attributes       Collection of attributes to update, in name=value
                            format and separated with comma                [string]

    Missing required arguments: r, k, s, p, u
    ```

    To update attributes execute the command in this way:
    > Remember to replace the parameters by your own values.

    ```bash
    node . -r us-east-1 -k ABCD12EFGH34IJKLMNOP -s 12345abcdefghi67890jklmnopqrstuvwxyz12ab -p us-east-1_abcDEF123 -u abcdef12-3456-abcde-f789-0abcdef12345 -a name=Test,custom:Other=test
    ```

    If executed properly, it should return something like:

    ```bash
    Reading user 'abcdef12-3456-abcde-f789-0abcdef12345'...
            Username : abcdef12-3456-abcde-f789-0abcdef12345
            3 atributes:
                    sub : abcdef12-3456-abcde-f789-0abcdef12345
                    name : User
                    email : email_address@domain.com
    Parsing attributes to update...
    [
        { Name: 'name', Value: 'Test' },
        { Name: 'custom:Other', Value: 'test' },
    ]
    Updating attributes for user 'abcdef12-3456-abcde-f789-0abcdef12345'...
            httpStatusCode: 200
            attempts: 1
            requestId: 00000000-0000-0000-0000-000000000000
    Reading user 'abcdef12-3456-abcde-f789-0abcdef12345'...
            Username : abcdef12-3456-abcde-f789-0abcdef12345
            4 atributes:
                    sub : abcdef12-3456-abcde-f789-0abcdef12345
                    name : Test
                    email : email_address@domain.com
                    custom:Other : test
    ```
