import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Stack, Construct, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { SERVICE_PREFIX } from '../helper/helper';

export class DynamoDBStack extends Stack {
  public readonly userTable!: Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 定義資料庫
    this.userTable = new Table(this, id + 'UserTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: SERVICE_PREFIX + 'User_Table',

      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });
  }
}
