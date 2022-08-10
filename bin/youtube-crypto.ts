#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { YoutubeCryptoStack } from '../lib/youtube-crypto-stack';

const app = new cdk.App();
new YoutubeCryptoStack(app, 'YoutubeCryptoStack', {
  env: { account: '985921069399', region: 'ap-northeast-1' },
});