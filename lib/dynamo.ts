import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { BuildConfig } from "../common_config/build_config";

export class DynamoStack extends Stack{
    public dynamoTable: Table;
    constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: StackProps) {
        super(scope, id, props);

        const prefix = `${buildConfig.environment}-${buildConfig.project}`;

        this.dynamoTable = new Table(this, 'DynamoDBTable', {
            tableName: `${prefix}-dynamodb`,
            partitionKey: {name: 'id', type: AttributeType.STRING}
        });

        
}
    }

    