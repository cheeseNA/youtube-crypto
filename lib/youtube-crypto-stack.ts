import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'


const EPHEMERAL_PORT_RANGE = ec2.Port.tcpRange(32768, 65535);

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

    const loadBalancedEc2Service = new ecs_patterns.NetworkLoadBalancedEc2Service(this, 'NLBEc2Service', {
      cluster: cluster,
      memoryLimitMiB: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    loadBalancedEc2Service.service.connections.allowFromAnyIpv4(EPHEMERAL_PORT_RANGE);
    loadBalancedEc2Service.service.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    new CfnOutput(this, 'networkLoadBalancerURL', {
      value: 'https://'+loadBalancedEc2Service.loadBalancer.loadBalancerDnsName,
      description: 'Network LoadBalancer URL',
    });
  }
}
