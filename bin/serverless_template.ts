import { App, Stack, Tags } from 'aws-cdk-lib';
//import 'source-map-support/register';
import { getConfig } from '../common_config/get_config';
import { APIGatewayStack } from '../lib/apiGateway';
import { CognitoStack } from '../lib/cognito';
import { DynamoStack } from '../lib/dynamo';
import { FrontEndStack } from '../lib/frontEnd';
import { LambdaStack } from '../lib/lambda';

function addTagsToStack(stack: Stack, name: string): void {
  Tags.of(stack).add("Project", buildConfig.project);
  Tags.of(stack).add("Environment", buildConfig.environment);
}

const app = new App();
const buildConfig = getConfig(app);
const envDetails = {
  account: buildConfig.account,
  region: buildConfig.region
};

const prefix = `${buildConfig.environment}-${buildConfig.project}`;

//FrontEnd stack( Cloudfront + s3 )
const feStackName = `${prefix}-frontend-stack`;
const FEStack = new FrontEndStack(app, feStackName, buildConfig, {
  stackName: feStackName,
  env: envDetails
});
addTagsToStack(FEStack as FrontEndStack, feStackName);

//Cognito Stack
const cognitoStackName = `${prefix}-cognito-stack`;
const cognitoStack = new CognitoStack(app, cognitoStackName, buildConfig, {
  stackName: cognitoStackName,
  env: envDetails
});
addTagsToStack(cognitoStack as CognitoStack, cognitoStackName);

//DynamoDB
const dynamoStackName = `${prefix}-dynamodb-stack`;
const dynamoDbStack = new DynamoStack(app, dynamoStackName, buildConfig, {
  stackName: dynamoStackName,
  env: envDetails,
});
addTagsToStack(dynamoDbStack as DynamoStack, dynamoStackName);

//Lambda
const lambdaStackName = `${prefix}-lambda-stack`;
const lambdaStack = new LambdaStack(app, lambdaStackName, buildConfig, dynamoDbStack, {
  stackName: lambdaStackName,
  env: envDetails
});
addTagsToStack(lambdaStack as LambdaStack, lambdaStackName);

//API Gateway
const apiGatewayStackName = `${prefix}-api-stack`;
const apiGatewayStack = new APIGatewayStack(app, apiGatewayStackName, buildConfig, cognitoStack, lambdaStack, {
  stackName: apiGatewayStackName,
  env: envDetails,
});
addTagsToStack(apiGatewayStack as APIGatewayStack, apiGatewayStackName);

