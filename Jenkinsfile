#!groovy

@Library('basis-pipeline-library@BASIS-24357') _

def _frontendImageTag = frontendImageTag
def _doDeploy = doDeploy
def _rancherConfigName = rancherConfigName
def _rancherEnvironment = rancherEnvironment
def _rancherStack = rancherStack
def _rancherService = rancherService

pipelineBuildFrontendJavascript {
    agentLabel = 'docker-engine'
    dockerRegistry = 'basis-registry.basis.com.br'
    builderImageName = 'basis-registry.basis.com.br/basis/builder-image'
    builderImageTag = 'node-8.9.3'
    buildScriptPath = 'docker/nginx/build.sh'
    dockerContext = 'docker/nginx'
    frontendImageName = 'abaco/abaco-ui'
    frontendImageTag = _frontendImageTag
    doDeploy = _doDeploy
    rancherInfo = [
        configName: _rancherConfigName,
        environment: _rancherEnvironment,
        stack: _rancherStack,
        service: _rancherService
    ]
    rocketChannel = ''
    recipientList = ''
    sendSuccessNotification = false
}

