import { App } from '@aws-cdk/core';
import { environment } from './helper/environment';
import { APIGatewayStack } from './stack/api-gateway.stack';
import { DynamoDBStack } from './stack/dynamoDB.stack';
import { UserLambdaStack } from './stack/lambda/user.stack';
import { HelperLayerStack } from './stack/layer/helper-layer.stack';
import { S3Stack } from './stack/s3.stack';

type DeployVersion = 'dev' | 'stage' | 'prod';
const deployVersion: DeployVersion = (process.env.DEPLOY_VERSION || 'dev') as DeployVersion;
const envConfig = environment[deployVersion];
const STACK_PREFIX = 'Serverless_Stack_';

const app = new App();

// Backend Base

// API
const apiGatewayStack = new APIGatewayStack(
  app,
  STACK_PREFIX + 'APIGatewayStack', { ...envConfig },
);
// Database
const dynamoDBStack = new DynamoDBStack(
  app,
  STACK_PREFIX + 'DynamoDBStack',
  { ...envConfig },
);
// Storage
const s3Stack = new S3Stack(
  app,
  STACK_PREFIX + 'S3Stack',
  { ...envConfig },
);

// Before Deploy Lambda, deploy LayerVersion First 'cdk deploy "*LayerStack"' see https://github.com/aws/aws-cdk/issues/1972
new HelperLayerStack(
  app,
  STACK_PREFIX + 'HelperLayerStack',
);

// Functions

// User Module
new UserLambdaStack(app, STACK_PREFIX + 'UserLambdaStack', {
  ...envConfig,
  apiGatewayv2: apiGatewayStack.apiGatewayv2,
  userTable: dynamoDBStack.userTable,
  userResourceBucket: s3Stack.userResourceBucket,
});


app.synth();