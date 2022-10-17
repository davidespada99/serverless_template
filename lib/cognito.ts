import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClientIdentityProvider, UserPoolEmail, UserPoolOperation } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { BuildConfig } from '../common_config/build_config';


export class CognitoStack extends Stack {
  public pool: UserPool;
  constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: StackProps) {
    super(scope, id, props);

    const prefix = `${buildConfig.environment}-${buildConfig.project}`;
    const cognitoParam = buildConfig.stacks.cognito;

    //Cognito
    this.pool = new UserPool(this, 'Pool', {
      userPoolName: `${prefix}-userpool`,

      selfSignUpEnabled: cognitoParam.selfSignUpEnabled,
      signInAliases: {
        username: true,
        email: true,
      },
      email: UserPoolEmail.withSES({
        fromEmail: cognitoParam.email.fromEmail,
        fromName: cognitoParam.email.fromName,
        replyTo: cognitoParam.email.replyTo,
      }),
      standardAttributes: {
        email: {
          required: cognitoParam.standarsAttribute.emailRequired,
          mutable: cognitoParam.standarsAttribute.emailMutable,
        }
      },
      passwordPolicy: {
        minLength: cognitoParam.passwordPolicy.minLength,
        requireLowercase: cognitoParam.passwordPolicy.requireLowercase,
        requireUppercase: cognitoParam.passwordPolicy.requireUppercase,
        requireDigits: cognitoParam.passwordPolicy.requireDigits,
        requireSymbols: cognitoParam.passwordPolicy.requireSymbols,
        tempPasswordValidity: Duration.days(cognitoParam.passwordPolicy.daysPasswordValidity),
      },
    });

    //addClient
    if (cognitoParam.addClients) {
      cognitoParam.clients.forEach((client) => {
        this.pool.addClient("app-client", {
          userPoolClientName: `${prefix}-${client.clientName}`,
          oAuth: {
            flows: {
              authorizationCodeGrant: client.authorizationCodeGrant,
            },
            callbackUrls: client.callbackUrls,
            logoutUrls: client.logoutUrls,
          },
          authFlows: {
            userPassword: true,
            userSrp: true,
          },
          supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
          generateSecret: client.generateSecret,
          
        }); 
      });
    }

  
  }
}
