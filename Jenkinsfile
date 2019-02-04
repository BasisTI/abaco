#!groovy

@Library('basis-pipeline-library@master') _

def _frontendImageTag = frontendImageTag
def _doDeploy = doDeploy
def _rancherConfigName = rancherConfigName
def _rancherEnvironment = rancherEnvironment
def _rancherStack = rancherStack
def _rancherService = rancherService
def _jenkinsId = jenkinsId

pipelineBuildFrontendJavascript {
    agentLabel = 'docker-engine'

    builderImageInfo = [
        name: 'basisti/build-frontend-npm',
        tag: 'node-8.9.3',
        buildScriptPath: 'docker/nginx/build.sh'
    ]

    appImageInfo = [
        registry: 'basis-registry.basis.com.br',
        dockerContext: 'docker/nginx',
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
        rocketChannel: '#abaco',
        recipientList: '',
        sendSuccessNotification: false
    ]
    
    jenkinsId = _jenkinsId
}

