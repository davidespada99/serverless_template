import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BuildConfig } from "../common_config/build_config";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DynamoStack } from "./dynamo";
const path = require('path');

export class LambdaStack extends Stack {
  public lambdaFunction: Function[] = [];

  constructor(scope: Construct, id: string, buildConfig: BuildConfig, dynamoStack: DynamoStack, props?: StackProps) {
    super(scope, id, props);

    const prefix = `${buildConfig.environment}-${buildConfig.project}`;
    const lambdaConfig = buildConfig.stacks.lambda;

    lambdaConfig.forEach((lambda) => {
      const newLambda= new Function(this, lambda.id, {
        functionName: `${prefix}-${lambda.id}`,
        runtime: new Runtime(lambda.runtime),
        handler: lambda.handler,
        code: Code.fromAsset(path.join(__dirname, lambda.codePath)),
      })

      this.lambdaFunction.push(newLambda);

      if(lambda.grantReadToDynamo){
        dynamoStack.dynamoTable.grantReadData(newLambda)
      }
      if(lambda.grantWriteToDynamo){
        dynamoStack.dynamoTable.grantWriteData(newLambda)
      }
  })




}
    
}