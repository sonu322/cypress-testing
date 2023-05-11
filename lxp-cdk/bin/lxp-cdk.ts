#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LxpCdkStack } from '../lib/lxp-cdk-stack';
import { createTempDirAndBuildApp} from '../lib/filedir';
import * as version from '../lib/resource/version.json';
import * as fs from 'fs';

interface versionData{
  host: string;
  dis: string;
  version: string;
  git: string;
}

const versionfile = fs.readFileSync('../lib/resource/version.json', 'utf8');
const versionjson: versionData = JSON.parse(versionfile);


const app = new cdk.App();
createTempDirAndBuildApp('https://github.com/Optimizory/lxp-cloud.git', 'main');


new LxpCdkStack(app, 'LxpCdkStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */


  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
   //env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
   env: { account: '950078608654', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});