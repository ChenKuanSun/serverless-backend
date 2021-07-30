import { join } from 'path';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { ITable } from '@aws-cdk/aws-dynamodb';
import { LayerVersion } from '@aws-cdk/aws-lambda';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import { IBucket } from '@aws-cdk/aws-s3';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Stack, Construct, StackProps } from '@aws-cdk/core';
import {
  SERVICE_PREFIX,
  XTalentLambdaFunctionDefaultProps,
} from '../../helper/helper';

interface UserLambdaStackDependencyProps extends StackProps {
  apiGatewayv2: HttpApi;
  userTable: ITable;
  userResourceBucket: IBucket;
}
export class UserLambdaStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: UserLambdaStackDependencyProps,
  ) {
    super(scope, id, props);
    // dependencies
    const apiGatewayv2: HttpApi = props.apiGatewayv2;
    const userTable: ITable = props.userTable;
    const userResourceBucket: IBucket = props.userResourceBucket;

    // // fetch the Arn from param store
    const helperLayerArn = StringParameter.valueForStringParameter(
      this,
      '/serverless_cdk/layer/helper',
    );
    // generate layer version from arn
    const helperLayer = LayerVersion.fromLayerVersionArn(
      this,
      id + 'helperLayer',
      helperLayerArn,
    );

    // Create

    // Lambda
    const createUserLambda = new PythonFunction(
      this,
      id + 'CreateUserFunction',
      {
        ...XTalentLambdaFunctionDefaultProps,
        functionName: SERVICE_PREFIX + 'CreateUser',
        environment: {
          DEVELOPER_MODE: 'true',
          USER_TABLE_NAME: userTable.tableName,
          USER_RESOURCE_BUCKET_NAME: userResourceBucket.bucketName,
        },
        layers: [helperLayer],
        entry: join(
          './',
          'source',
          'lambda',
          'function',
          'User',
          'CreateUser',
        ),
      },
    );
    // Resource Premission
    userTable.grantReadWriteData(createUserLambda);
    userResourceBucket.grantReadWrite(createUserLambda);
    userResourceBucket.grantPut(createUserLambda);
    userResourceBucket.grantPutAcl(createUserLambda);

    // Api v2 Integration
    const createUserLambdaIntegration = new LambdaProxyIntegration({
      handler: createUserLambda,
    });
    apiGatewayv2.addRoutes({
      path: '/user',
      methods: [HttpMethod.POST],
      integration: createUserLambdaIntegration,
    });


    // Query

    // Lambda
    const queryUserLambda = new PythonFunction(
      this,
      id + 'QueryUserFunction',
      {
        ...XTalentLambdaFunctionDefaultProps,
        functionName: SERVICE_PREFIX + 'QueryUser',
        environment: {
          DEVELOPER_MODE: 'true',
          USER_TABLE_NAME: userTable.tableName,
        },
        layers: [helperLayer],
        entry: join(
          './',
          'source',
          'lambda',
          'function',
          'User',
          'QueryUser',
        ),
      },
    );
    // Resource Premission
    userTable.grantReadData(queryUserLambda);

    // Api v2 Integration
    const queryUserLambdaIntegration = new LambdaProxyIntegration({
      handler: queryUserLambda,
    });
    apiGatewayv2.addRoutes({
      path: '/user',
      methods: [HttpMethod.GET],
      integration: queryUserLambdaIntegration,
    });

    // Get

    // Lambda
    const getUserLambda = new PythonFunction(this, id + 'GetUserFunction', {
      ...XTalentLambdaFunctionDefaultProps,
      functionName: SERVICE_PREFIX + 'GetUser',
      environment: {
        DEVELOPER_MODE: 'true',
        USER_TABLE_NAME: userTable.tableName,
      },
      layers: [helperLayer],
      entry: join('./', 'source', 'lambda', 'function', 'User', 'GetUser'),
    });
    // Resource Premission
    userTable.grantReadData(getUserLambda);

    // Api v2 Integration
    const getUserLambdaIntegration = new LambdaProxyIntegration({
      handler: getUserLambda,
    });
    apiGatewayv2.addRoutes({
      path: '/user/{userId}',
      methods: [HttpMethod.GET],
      integration: getUserLambdaIntegration,
    });

    // Update

    // Lambda
    const updateUserLambda = new PythonFunction(
      this,
      id + 'UpdateUserFunction',
      {
        ...XTalentLambdaFunctionDefaultProps,
        functionName: SERVICE_PREFIX + 'UpdateUser',
        environment: {
          DEVELOPER_MODE: 'true',
          USER_TABLE_NAME: userTable.tableName,
        },
        layers: [helperLayer],
        entry: join('./', 'source', 'stack', 'lambda', 'function', 'User', 'UpdateUser'),
      },
    );
    // Resource Premission
    userTable.grantReadWriteData(updateUserLambda);
    userResourceBucket.grantReadWrite(createUserLambda);
    userResourceBucket.grantPut(createUserLambda);
    userResourceBucket.grantPutAcl(createUserLambda);

    // Api v2 Integration
    const updateUserLambdaIntegration = new LambdaProxyIntegration({
      handler: updateUserLambda,
    });
    apiGatewayv2.addRoutes({
      path: '/user/{userId}',
      methods: [HttpMethod.PUT],
      integration: updateUserLambdaIntegration,
    });


    // Delete

    // Lambda
    const deleteUserLambda = new PythonFunction(
      this,
      id + 'DeleteUserFunction',
      {
        ...XTalentLambdaFunctionDefaultProps,
        functionName: SERVICE_PREFIX + 'DeleteUser',
        environment: {
          DEVELOPER_MODE: 'true',
          USER_TABLE_NAME: userTable.tableName,
        },
        layers: [helperLayer],
        entry: join(
          './',
          'source',
          'lambda',
          'function',
          'User',
          'DeleteUser',
        ),
      },
    );
    // Resource Premission
    userTable.grantReadWriteData(deleteUserLambda);
    userResourceBucket.grantReadWrite(createUserLambda);
    userResourceBucket.grantPut(createUserLambda);
    userResourceBucket.grantPutAcl(createUserLambda);

    // Api v2 Integration
    const deleteUserLambdaIntegration = new LambdaProxyIntegration({
      handler: deleteUserLambda,
    });
    apiGatewayv2.addRoutes({
      path: '/user/{userId}',
      methods: [HttpMethod.DELETE],
      integration: deleteUserLambdaIntegration,
    });
  }
}
