import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate,} from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { BuildConfig } from '../common_config/build_config';

export class FrontEndStack extends Stack {
  constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: StackProps) {
    super(scope, id, props);

    const prefix = `${buildConfig.environment}-${buildConfig.project}`;
    const forntEndParam = buildConfig.stacks.frontEnd;

    //S3 BUCKET
    
    const bucket = new Bucket(this, 's3Bucket', {
      bucketName: `${prefix}-s3`,
      versioned: forntEndParam.s3.versioned,
      publicReadAccess: forntEndParam.s3.publicReadAccess,
    });

    //CLOUDFRONT

    //Certificate
    let myCertificate;
    if (forntEndParam.cloudfront.certificate.enableCertification) {
      myCertificate = Certificate.fromCertificateArn(this, 'domainCertfromArn', forntEndParam.cloudfront.certificate.certificateArn);
    }

    //Domain Names
    let domainList: string[] = [];
    if (forntEndParam.cloudfront.certificate.enableCertification) {
      forntEndParam.cloudfront.domainNames.forEach((domain) => {
        domainList.push(domain)
      });
    };

    const CFDistribution = new Distribution(this, 'CloudFrontrDistribution', {
      defaultBehavior: {
        origin: new S3Origin(bucket)
      },
      defaultRootObject: forntEndParam.cloudfront.defaultRootObject,
      domainNames: domainList,
      certificate: myCertificate,
    });

  }
}
