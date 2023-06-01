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
import * as versions from "../lib/resource/version.json";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as fs from "fs";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
// change the envJSON to point to the correct environment
export const envJSON = envParams["dev"];
const buildDirectory = path.join(__dirname, "../builds");

export class LxpCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // route53
    const zone = route53.HostedZone.fromLookup(this, "hostedzone", {
      domainName: `${envJSON.hostedZone}`,
    });

    // create certificate for the domain
    const lxpCertificate = new Certificate(this, "LxpCertificate", {
      domainName: `${envJSON.hostedZone}`,
      validation: CertificateValidation.fromDns(zone),
    });

    const lxpCertificate2 = new Certificate(this, "LxpCertificate2", {
      domainName: "*." + `${envJSON.hostedZone}`,
      validation: CertificateValidation.fromDns(zone),
    });

    // The code that defines your stack goes here
    // s3 bucket
    const lxpBucket = new Bucket(this, "LxpBucket", {
      versioned: false,
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

    const hstsBehavior = new cf.ResponseHeadersPolicy(this, "HSTSBehavior", {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: Duration.seconds(31536000),
          includeSubdomains: true,
          override: true,
          preload: true,
        },
      },
    });

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
      var fqdn = "";
      var cert;
      var recordName;
      if (dirName === "v3") {
        fqdn = "dev.lxp.optimizoryapps.com";
        cert = lxpCertificate;
        recordName = "";
      } else {
        fqdn = `${dirName}.${envJSON.hostedZone}`;
        cert = lxpCertificate2;
        recordName = "v2-1-0";
      }

      const cloudfront = new cf.Distribution(this, cloud_front_name, {
        defaultRootObject: "issueTreeModuleEntry.html", // default page to load when accessing the website
        defaultBehavior: {
          origin: new S3Origin(lxpBucket, {
            originPath: `/${dirName}`,
            originAccessIdentity,
          }),
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          responseHeadersPolicy: hstsBehavior,
        },
        certificate: cert,
        domainNames: [fqdn],
      });
      // map the domain name to the cloudfront distribution with alias record in route53
      new route53.ARecord(this, `AliasRecord_${dirName}`, {
        zone,
        recordName: recordName,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(cloudfront)
        ),
      });
    });
    // print bucket name
    new cdk.CfnOutput(this, "LxpBucketName", {
      value: lxpBucket.bucketName,
    });
  }
}
