import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, BucketDeploymentProps, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as envParams from '../lib/resource/env.json'
export const Envjson = envParams["dev"];
import { buildFromGitBranch } from "./branchBuildScript";
import * as fs from 'fs';





class LxpBucketDeployment extends BucketDeployment {



  constructor(scope: Construct, id: string, props: BucketDeploymentProps) {
    super(scope, id, props);
    const bucketname = `${Envjson.S3bucket}`;
    interface versionData{
      hostname: string;
      description: string;
      version: string;
      git_tag_name: string;
    }
    const versionfile = fs.readFileSync('../lib/resource/version.json', 'utf8');
    const versionjson = JSON.parse(versionfile) as versionData[];
    const bucket  = Bucket.fromBucketName(this, 'LxpBucket', bucketname);

    for (let i = 0; i < versionjson.length; i++) {
      const branchname = versionjson[i].git_tag_name;
      buildFromGitBranch(branchname);
      new BucketDeployment(scope, 'LxpBucketDeployment', {
        sources: [Source.asset('C:/Users/pulkit/Desktop/lxp/lxp-cloud/dist')], // have to replace with app data app_test is for testing
        destinationBucket: bucket,
        });
    }

    
    // const originAccessIdentity = new cf.OriginAccessIdentity(this, 'LxpOriginAccessIdentity', {
    //     comment: 'LxpOriginAccessIdentity',
    //     });
    // bucket.grantRead(originAccessIdentity);          

  }
}