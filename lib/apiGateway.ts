import { Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { BuildConfig } from "../common_config/build_config";
import { CognitoStack } from "./cognito";
import { addResourcesRecursive } from "./gatewayFn/recursiveResource";
import { LambdaStack } from "./lambda";


export class APIGatewayStack extends Stack {
    constructor(scope: Construct, id: string, buildConfig: BuildConfig, cognito: CognitoStack, lambda: LambdaStack, props?: StackProps) {
        super(scope, id, props);

        const prefix = `${buildConfig.environment}-${buildConfig.project}`;
        const apiConfig = buildConfig.stacks.apigateway;
        //authorizer
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'PoolAuthorizer', {
            cognitoUserPools: [cognito.pool]
        });


        //Rest API
        const apiGateway = new RestApi(this, 'myApi', {
            restApiName: `${prefix}-RestApi`,
        });

        //add all resources and methods to all Lambdas
        apiConfig.forEach((lambdasResources, index) =>{
            lambdasResources.resources.forEach((resource) => {
                const rootRes = apiGateway.root.addResource(resource.resourceName);
                resource.methods.forEach((meth) => {
                    rootRes.addMethod(meth, new LambdaIntegration(lambda.lambdaFunction[index]), {
                        authorizer: authorizer,
                        authorizationType: AuthorizationType.COGNITO,
                    })
                })
                if(resource.child.length > 0){
                    addResourcesRecursive(rootRes, resource.child, index, authorizer, lambda)
                }

            })
        })

        
    }
}

/*

            */