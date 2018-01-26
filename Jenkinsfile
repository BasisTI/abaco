#!groovy

@Library('basis-pipeline-library@BASIS-24357') _

pipelineBuildFrontendJavascript {
    agentLabel = 'docker-engine'
    dockerRegistry = 'basis-registry.basis.com.br'
    builderImageName = 'basis-registry.basis.com.br/basis/builder-image'
    builderImageTag = 'node-8.9.3'
    buildScriptPath = 'docker/nginx/build.sh'
    dockerContext = 'docker/nginx'
    frontendImageName = 'abaco/abaco-ui'
    frontendImageTag = 'desenvolvimento-basis-24357'
    doDeploy = env.doDeploy
    rancherInfo = [
        configName: env.rancherConfigName, 
        environment: env.rancherEnvironment,
        stack: env.rancherStack,
        service: env.rancherService 
    ]
    rocketChannel = ''
    recipientList = ''
    sendSuccessNotification = false
}
