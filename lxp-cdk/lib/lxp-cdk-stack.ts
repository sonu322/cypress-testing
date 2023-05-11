import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket,BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as envParams from '../lib/resource/env.json'
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as route53 from 'aws-cdk-lib/aws-route53';
export const Envjson = envParams["dev"];
export class LxpCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    //const domainName = 'lxpcloud.com';

    // const hostedzone = cdk.aws_route53.HostedZone.fromLookup(this, 'HostedZone', {
    //   domainName: 'lxpcloud.com',
    // });
    
    
     const certificatearn = `${Envjson.certificate}`;
     const certifiate_lxpdev = Certificate.fromCertificateArn(this, 'Certificate', certificatearn);




    // The code that defines your stack goes here
    // s3 bucket
    const lxpBucket = new Bucket(this, 'LxpBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      // set puclib access to true for testing
    });
    // s3 bucket deployment
    new BucketDeployment(this, 'LxpBucketDeployment', {
      sources: [Source.asset('C:/Users/dell/lxp-cloud/app_test')], // have to replace with app data app_test is for testing
      destinationBucket: lxpBucket,
    });
    // origin access identity
    const originAccessIdentity = new cf.OriginAccessIdentity(this, 'LxpOriginAccessIdentity', {
      comment: 'LxpOriginAccessIdentity',
    });
    lxpBucket.grantRead(originAccessIdentity);
    // add custom domain name
   // const domainName = 'lxpcloud.com';

    // const viewerCertificate = cf.ViewerCertificate.fromAcmCertificate({
    //   certificateArn: certificatearn,
    //   env: {
    //     region: 'us-east-1',
    //     account: '950078608654',
    //   },
    //   node: this.node,
    //   stack: this,
    //   applyRemovalPolicy(policy: cdk.RemovalPolicy): void {},
    //   metricDaysToExpiry:() => {
    //     return new cdk.aws_cloudwatch.Metric({
    //       namespace: 'AWS/CertificateManager',
    //       metricName: 'DaysToExpiry',
    //   })
    // }
    // },{
    //   securityPolicy: cf.SecurityPolicyProtocol.TLS_V1_2_2019,
    //   sslMethod: cf.SSLMethod.SNI,
    // });

    // cloudfront distribution
    const distribution = new cf.Distribution(this, 'LxpDistribution',{
      defaultRootObject : 'test2.html',  // default page to load when accessing the website
      defaultBehavior: {
        origin: new S3Origin(lxpBucket,{originAccessIdentity}),
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cf.AllowedMethods.ALLOW_ALL,
        //viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
        
      },
      certificate : certifiate_lxpdev,
      domainNames: ['v1.dev.lxp.optimizoryapps.com'],
      
      enabled:true,
      });

      //distribution.addBehavior('dev.lxp.optimizoryapps.com', new cf.);

    // route53
    const zone = route53.HostedZone.fromLookup(this,'hostedzone',{
      domainName: `${Envjson.hostedZone}`
    });
    

    new route53.ARecord(this, 'AliasRecord', {
      zone,
      recordName: 'v1',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });
    new route53.CnameRecord(this, 'CnameRecord', {
      zone,
      recordName: 'v2',
      domainName: distribution.distributionDomainName,
    });

    }
}
