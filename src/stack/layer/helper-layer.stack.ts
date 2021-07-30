import { join } from 'path';
import { Code, LayerVersion } from '@aws-cdk/aws-lambda';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { SERVICE_PREFIX } from '../../helper/helper';

export class HelperLayerStack extends Stack {
  public readonly HelperLayer: LayerVersion;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    //  The code that defines your stack goes here;
    this.HelperLayer = new LayerVersion(
      this,
      id + 'HelperLayer',
      {
        layerVersionName: SERVICE_PREFIX + 'HelperLayer',
        code: Code.fromAsset(
          join('./', 'source', 'lambda', 'layer', 'helper'),
        ),
        /**
         *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
         * the new table, and it will remain in your account until manually deleted. By setting the policy to
         * DESTROY, cdk destroy will delete the table (even if it has data in it)
         */
        removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      },
    );

    // Because of [lambda] deployment failure on updates to cross-stack layers https://github.com/aws/aws-cdk/issues/1972
    // Record the versionArn into SSM
    new StringParameter(this, 'VersionArn', {
      parameterName: '/serverless_cdk/layer/helper',
      stringValue: this.HelperLayer.layerVersionArn,
    });
  }
}
