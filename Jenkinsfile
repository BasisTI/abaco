#!groovy

@Library('basis-pipeline-library@BASIS-24357') _

def doDeploy = env.doDeploy
def frontendImageTag = env.frontendImageTag
def rancherConfigName = env.rancherConfigName
def rancherEnvironment = env.rancherEnvironment
def rancherStack = env.rancherStack
def rancherService = env.rancherService

pipelineBuildFrontendJavascript {
    agentLabel = 'docker-engine'
    dockerRegistry = 'basis-registry.basis.com.br'
    builderImageName = 'basis-registry.basis.com.br/basis/builder-image'
    builderImageTag = 'node-8.9.3'
    buildScriptPath = 'docker/nginx/build.sh'
    dockerContext = 'docker/nginx'
    frontendImageName = 'abaco/abaco-ui'
    frontendImageTag = frontendImageTag 
    doDeploy = doDeploy
    rancherInfo = [
        configName: rancherConfigName, 
        environment: rancherEnvironment,
        stack: rancherStack,
        service: rancherService 
    ]
    rocketChannel = ''
    recipientList = ''
    sendSuccessNotification = false
}
