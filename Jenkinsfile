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

    builderImageInfo = [
        registry: 'basis-registry.basis.com.br',
        name: 'basis/builder-image' //'basis-registry.basis.com.br/basis/builder-image',
        tag: 'node-8.9.3',
    ]

    appImageInfo = [
        registry: 'basis-registry.basis.com.br',
        dockerContext: 'docker/nginx',
        buildScriptPath = 'docker/nginx/build.sh',
        name: 'abaco/abaco-ui',
        tag: _frontendImageTag 
    ]

    doDeploy = _doDeploy

    rancherInfo = [
        configName: _rancherConfigName,
        environment: _rancherEnvironment,
        stack: _rancherStack,
        service: _rancherService
    ]

    notificationInfo = [
        rocketChannel = '',
        recipientList = '',
        sendSuccessNotification = false
    ]
}

