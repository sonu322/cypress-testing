import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket,BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as envParams from '../lib/resource/env.json'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as fs from 'fs';
import * as path from 'path';
export const Envjson = envParams["dev"];
//const buildDirectory = path.resolve('C:/Users/pulkit/Desktop/lxp-c');
// return the path where this file is located
const buildDirectoryBase = path.basename(__dirname);
const buildDirectory = path.join(__dirname, 'builds');


console.log(buildDirectory);

// select builds driectory


export class LxpCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    

    
     const certificatearn = `${Envjson.certificate}`;
     const certifiate_lxpdev = Certificate.fromCertificateArn(this, 'Certificate', certificatearn);
     // route53
    const zone = route53.HostedZone.fromLookup(this,'hostedzone',{
      domainName: `${Envjson.hostedZone}`
    });




    // The code that defines your stack goes here
    // s3 bucket
    const lxpBucket = new Bucket(this, 'LxpBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      // set puclib access to true for testing
    });
    const originAccessIdentity = new cf.OriginAccessIdentity(this, 'LxpOriginAccessIdentity', {
      comment: 'LxpOriginAccessIdentity',
    });
    fs.readdirSync(buildDirectory).forEach((dirName) => {
      console.log(dirName);
      const fullPath = path.join(buildDirectory, dirName+`/lxp-cloud/dist/`);
      console.log(fullPath);
      const deployment_name = dirName+`-deployment`;
      const cloud_front_name  = dirName+`-CF`;
      new BucketDeployment(this, deployment_name, {
        sources: [Source.asset(fullPath)],
        destinationBucket: lxpBucket,
        destinationKeyPrefix: dirName,
      })
      // cloud fornt diployment for the version 
      const cloudfront = new cf.Distribution(this, cloud_front_name,{
        defaultRootObject : 'issueTreeModuleEntry.html',  // default page to load when accessing the website
        defaultBehavior: {
          origin: new S3Origin(lxpBucket,{originPath: `/${dirName}`,originAccessIdentity}),
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          //viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
      },
      certificate : certifiate_lxpdev,
      domainNames: [`${dirName}.dev.lxp.optimizoryapps.com`],
    })
    new route53.ARecord(this, `AliasRecord_${dirName}`, {
      zone,
      recordName: dirName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudfront)),
    });

    });        

    // // s3 bucket deployment
    // new BucketDeployment(this, 'LxpBucketDeployment', {
    //   sources: [Source.asset('C:/Users/pulkit/Desktop/lxp/lxp-cloud/dist')], // have to replace with app data app_test is for testing
    //   destinationBucket: lxpBucket,
    //   destinationKeyPrefix: 'v1',
    // });
    // // origin access identity
    // // const originAccessIdentity = new cf.OriginAccessIdentity(this, 'LxpOriginAccessIdentity', {
    // //   comment: 'LxpOriginAccessIdentity',
    // // });
    // lxpBucket.grantRead(originAccessIdentity);
    // const s3Origin_v1 = new S3Origin(lxpBucket, { originPath: `/v1`,originAccessIdentity },);

    // // cloudfront distribution
    // const distribution = new cf.Distribution(this, 'LxpDistribution',{
    //   defaultRootObject : 'issueTreeModuleEntry.html',  // default page to load when accessing the website
    //   defaultBehavior: {
    //     origin: s3Origin_v1,
    //     //origin: new S3Origin(lxpBucket,{originAccessIdentity}),
    //     viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     allowedMethods: cf.AllowedMethods.ALLOW_ALL,
    //     //viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
    //     cachedMethods: cf.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        
    //   },
    //   certificate : certifiate_lxpdev,
    //   domainNames: ['v1.dev.lxp.optimizoryapps.com'],
      
    //   enabled:true,
    //   });

    //   const distribution_1 = new cf.Distribution(this, 'LxpDistribution_1',{
    //     defaultRootObject : 'issueTreeModuleEntry.html',  // default page to load when accessing the website
    //     defaultBehavior: {
    //       origin: new S3Origin(lxpBucket,{originAccessIdentity}),
    //       viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //       allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    //       //viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
          
    //     },
    //     certificate : certifiate_lxpdev,
    //     domainNames: ['v3.dev.lxp.optimizoryapps.com'],
        
    //     enabled:true,
    //     });

    
    

    // new route53.ARecord(this, 'AliasRecord', {
    //   zone,
    //   recordName: 'v1',
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    // });

    // new route53.ARecord(this, 'AliasRecord_1', {
    //   zone,
    //   recordName: 'v3',
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution_1)),
    // });

    }
}
