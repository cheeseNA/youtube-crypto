import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class YoutubeCryptoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MainVpc', {
      maxAzs: 2,
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpc,
    });

    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    });

    const taskDef = new ecs.Ec2TaskDefinition(this, 'TaskDefinition');

    const container = taskDef.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    const service = new ecs.Ec2Service(this, 'Service', {
      cluster: cluster,
      taskDefinition: taskDef,
    });
  }
}
