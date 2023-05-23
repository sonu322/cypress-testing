import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Bucket,
  BlockPublicAccess,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import * as envParams from "../lib/resource/env.json";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as fs from "fs";
import * as path from "path";
export const envJSON = envParams["dev"];
const buildDirectory = path.join(__dirname, "builds");

export class LxpCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificatearn = `${envJSON.certificate}`;
    const certifiate_lxpdev = Certificate.fromCertificateArn(
      this,
      "Certificate",
      certificatearn
    );
    // route53
    const zone = route53.HostedZone.fromLookup(this, "hostedzone", {
      domainName: `${envJSON.hostedZone}`,
    });

    // The code that defines your stack goes here
    // s3 bucket
    const lxpBucket = new Bucket(this, "LxpBucket", {
      bucketName: `${envJSON.S3bucket}`,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });
    // origin access identity
    const originAccessIdentity = new cf.OriginAccessIdentity(
      this,
      "LxpOriginAccessIdentity",
      {
        comment: "LxpOriginAccessIdentity",
      }
    );
    // read the directory and deploy the build to s3 bucket
    fs.readdirSync(buildDirectory).forEach((dirName) => {
      const fullPath = path.join(buildDirectory, dirName + `/lxp-cloud/dist/`);
      const deployment_name = dirName + `-deployment`;
      const cloud_front_name = dirName + `-CF`;
      new BucketDeployment(this, deployment_name, {
        sources: [Source.asset(fullPath)],
        destinationBucket: lxpBucket,
        destinationKeyPrefix: dirName,
      });
      // cloudfornt diployment for the version
      const cloudfront = new cf.Distribution(this, cloud_front_name, {
        defaultRootObject: "issueTreeModuleEntry.html", // default page to load when accessing the website
        defaultBehavior: {
          origin: new S3Origin(lxpBucket, {
            originPath: `/${dirName}`,
            originAccessIdentity,
          }),
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
        certificate: certifiate_lxpdev,
        domainNames: [`${dirName}.dev.lxp.optimizoryapps.com`],
      });
      // map the domain name to the cloudfront distribution with alias record in route53
      new route53.ARecord(this, `AliasRecord_${dirName}`, {
        zone,
        recordName: dirName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(cloudfront)
        ),
      });
    });
  }
}
