import { AuthorizationType, Resource, LambdaIntegration, CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { ResourcesConfig } from "../../common_config/build_config";
import { LambdaStack } from "../lambda";

//recursive function

export function addResourcesRecursive(parent: Resource, child: ResourcesConfig[], index: number,auth: CognitoUserPoolsAuthorizer, lambda: LambdaStack): void {
    child.forEach((res) => {
        const childResource = parent.addResource(res.resourceName);
        res.methods.forEach((meth) => { childResource.addMethod(meth, new LambdaIntegration(lambda.lambdaFunction[index]), {
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO,
        }) })
        if (res.child.length > 0) {
            addResourcesRecursive(childResource, res.child, index, auth, lambda)
        }
    });
}
