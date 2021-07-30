import { Bucket } from '@aws-cdk/aws-s3';
import {
  Stack,
  Construct,
  StackProps,
  RemovalPolicy,
} from '@aws-cdk/core';

export class S3Stack extends Stack {
  public readonly userResourceBucket!: Bucket;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.userResourceBucket = new Bucket(this, id + 'UserResourceBucket', {
      bucketName: 'user-resource-bucket',

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });
  }
}
