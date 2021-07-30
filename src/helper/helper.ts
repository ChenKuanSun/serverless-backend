import { Runtime } from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';

export const SERVICE_PREFIX = 'Serverless_';

export const XTalentLambdaFunctionDefaultProps = {
  index: 'app.py',
  runtime: Runtime.PYTHON_3_8,
  handler: 'lambda_handler',
  memorySize: 512,
  timeout: Duration.seconds(6),
};