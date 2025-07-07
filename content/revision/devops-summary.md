---
title: "DevOps & Infrastructure - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 12
tags: ["devops", "docker", "kubernetes", "cicd", "aws", "infrastructure", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# DevOps & Infrastructure - Revision Summary

## Docker & Containerization

### Key Concepts
- **Container**: Lightweight, portable runtime environment
- **Image**: Read-only template for creating containers
- **Dockerfile**: Instructions to build an image
- **Registry**: Storage for container images (Docker Hub, ECR)

### Essential Dockerfile Patterns
```dockerfile
# Multi-stage Build for Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]

# Security Best Practices
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Docker Compose for Development
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Interview Points
- **Q**: Difference between containers and VMs?
- **A**: Containers share OS kernel, VMs have separate OS. Containers are lighter and faster.

## Kubernetes & Orchestration

### Key Concepts
- **Pod**: Smallest deployable unit (one or more containers)
- **Service**: Network abstraction for pod access
- **Deployment**: Manages replica sets and rolling updates
- **ConfigMap/Secret**: Configuration and sensitive data management

### Essential Kubernetes Manifests
```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Helm Chart Structure
```yaml
# Chart.yaml
apiVersion: v2
name: web-app
version: 1.0.0
appVersion: "1.0.0"

# values.yaml
replicaCount: 3
image:
  repository: myapp
  tag: v1.0.0
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: myapp.example.com
      paths: ["/"]
  tls:
    - secretName: myapp-tls
      hosts: ["myapp.example.com"]
```

## CI/CD Pipelines

### Key Concepts
- **Continuous Integration**: Automated testing on code changes
- **Continuous Deployment**: Automated deployment to production
- **Pipeline as Code**: Version-controlled pipeline definitions
- **Blue-Green Deployment**: Zero-downtime deployments

### GitHub Actions Pipeline
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run security audit
      run: npm audit --audit-level high

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker build -t ${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }} .
        docker tag ${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }} ${{ secrets.ECR_REGISTRY }}/myapp:latest
    
    - name: Push to ECR
      run: |
        aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
        docker push ${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }}
        docker push ${{ secrets.ECR_REGISTRY }}/myapp:latest
    
    - name: Deploy to EKS
      run: |
        aws eks update-kubeconfig --region us-west-2 --name production-cluster
        kubectl set image deployment/web-app web-app=${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }}
        kubectl rollout status deployment/web-app
```

### Jenkins Pipeline (Jenkinsfile)
```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'myapp'
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
                sh 'npm run lint'
            }
        }
        
        stage('Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    kubectl set image deployment/web-app web-app=${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    kubectl rollout status deployment/web-app
                """
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Check console output at ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

## Cloud Platforms (AWS, Azure, GCP)

### AWS Core Services
```javascript
// AWS SDK Examples
const AWS = require('aws-sdk');

// S3 File Upload
const s3 = new AWS.S3();
const uploadFile = async (file, bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: 'application/octet-stream',
    ServerSideEncryption: 'AES256'
  };
  return s3.upload(params).promise();
};

// Lambda Function
exports.handler = async (event) => {
  const { Records } = event;
  
  for (const record of Records) {
    if (record.eventName === 'INSERT') {
      await processNewRecord(record.dynamodb.NewImage);
    }
  }
  
  return { statusCode: 200, body: 'Processed successfully' };
};

// CloudFormation Template (Infrastructure as Code)
const template = {
  AWSTemplateFormatVersion: '2010-09-09',
  Resources: {
    WebAppBucket: {
      Type: 'AWS::S3::Bucket',
      Properties: {
        BucketName: 'my-web-app-bucket',
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true
        }
      }
    },
    WebAppRole: {
      Type: 'AWS::IAM::Role',
      Properties: {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Principal: { Service: 'ec2.amazonaws.com' },
            Action: 'sts:AssumeRole'
          }]
        },
        Policies: [{
          PolicyName: 'S3Access',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Action: ['s3:GetObject', 's3:PutObject'],
              Resource: { 'Fn::Sub': '${WebAppBucket}/*' }
            }]
          }
        }]
      }
    }
  }
};
```

## Infrastructure as Code

### Terraform Configuration
```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC and Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-${count.index + 1}"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "main-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.24"

  vpc_config {
    subnet_ids = aws_subnet.public[*].id
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy,
  ]
}

# Auto Scaling Group for Worker Nodes
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "main-nodes"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = aws_subnet.public[*].id

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.node_policy,
    aws_iam_role_policy_attachment.cni_policy,
    aws_iam_role_policy_attachment.registry_policy,
  ]
}
```

## Quick Reference Cheat Sheet

| Tool | Purpose | Key Commands |
|------|---------|--------------|
| Docker | Containerization | `docker build -t app .`, `docker run -p 3000:3000 app` |
| Kubernetes | Orchestration | `kubectl apply -f deployment.yaml`, `kubectl get pods` |
| Helm | Package Manager | `helm install myapp ./chart`, `helm upgrade myapp ./chart` |
| Terraform | Infrastructure | `terraform plan`, `terraform apply` |
| AWS CLI | Cloud Management | `aws s3 cp file.txt s3://bucket/`, `aws eks update-kubeconfig` |

## Monitoring & Observability

### Prometheus & Grafana
```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true

# Application Metrics (Node.js)
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

## Common Interview Questions

1. **Container vs VM**: Explain differences and use cases
2. **Kubernetes Architecture**: Components and their roles
3. **CI/CD Pipeline**: Design a complete pipeline from code to production
4. **Blue-Green Deployment**: How to achieve zero-downtime deployments
5. **Infrastructure as Code**: Benefits and tools comparison
6. **Monitoring Strategy**: What metrics to track and alerting strategies
7. **Security**: Container security best practices
8. **Scaling**: Horizontal vs vertical scaling in Kubernetes

## Performance Benchmarks

- **Container Startup**: < 5 seconds for application containers
- **Build Time**: < 10 minutes for typical applications
- **Deployment Time**: < 5 minutes for rolling updates
- **Resource Utilization**: 70-80% CPU/Memory for optimal efficiency
- **Availability**: 99.9% uptime with proper redundancy
- **Recovery Time**: < 5 minutes for automated failover