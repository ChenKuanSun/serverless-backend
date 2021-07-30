import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { SERVICE_PREFIX } from '../helper/helper';

export class APIGatewayStack extends Stack {
  public readonly apiGatewayv2!: HttpApi;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Add Authorizer
    // const userPoolArn = '';
    // const userPoolClientId = '';
    // const userPool = UserPool.fromUserPoolArn(
    //   this,
    //   id + 'UserPool',
    //   userPoolArn,
    // );
    // const userPoolClient = UserPoolClient.fromUserPoolClientId(
    //   this,
    //   id + 'UserPoolClient',
    //   userPoolClientId,
    // );
    // const authorizer = new HttpUserPoolAuthorizer({
    //   userPool,
    //   userPoolClient,
    // });

    // Add Custom Domain
    // const certArn = '';
    // const domainName = 'xxx.xxxx.com.tw';
    // const certificate = Certificate.fromCertificateArn(
    //   this,
    //   id + 'Certificate',
    //   certArn,
    // );
    // const customDomainWithCertificate = new DomainName(this, id + 'CustomDomain', {
    //   domainName,
    //   certificate,
    // });

    this.apiGatewayv2 = new HttpApi(this, id + 'Http-API', {
      apiName: SERVICE_PREFIX + 'Http_API',

      // Add Authorizer
      // defaultAuthorizer: authorizer,
      // defaultAuthorizationScopes: ['aws.cognito.signin.user.admin'], // uncomment for Oauth2 scope

      // Add Custom Domain
      // defaultDomainMapping: {
      //   domainName: customDomainWithCertificate,
      //   mappingKey: 'v1', // give path to mapping , Your Api url will look like api.xxx.com/{mappingKey}/
      // },

      // CORS
      // corsPreflight: {
      //   allowHeaders: [
      //     'Content-Type',
      //     'X-Amz-Date',
      //     'Authorization',
      //     'X-Api-Key',
      //   ],
      //   allowMethods: [
      //     CorsHttpMethod.OPTIONS,
      //     CorsHttpMethod.GET,
      //     CorsHttpMethod.POST,
      //     CorsHttpMethod.PUT,
      //     CorsHttpMethod.PATCH,
      //     CorsHttpMethod.DELETE,
      //   ],
      //   allowCredentials: false,
      //   allowOrigins: ['*'], // For All Origins
      //   maxAge: Duration.days(10),
      // },
    });
  }
}
