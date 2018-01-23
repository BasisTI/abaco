#!groovy

@Library('basis-pipeline-library@BASIS-24357') _

pipelineBuildFrontendJavascript {
    agentLabel = 'docker-engine'
    gitRepositoryUrl = 'ssh://git@gogs-ssh.basis.com.br:10022/Basis/abaco_primeng_codigo_fonte.git'
    gitBranch = 'master'
    dockerRegistry = 'basis-registry.basis.com.br'
    builderImageName = 'basis-registry.basis.com.br/basis/builder-image'
    builderImageTag = 'node-8.9.3'
    buildScriptPath = 'docker/nginx/build.sh'
    dockerContext = 'docker/nginx'
    frontendImageName = 'abaco/abaco-ui'
    frontendImageTag = 'desenvolvimento-basis-24357'
    doDeploy = true
    rancherInfo = [
        url: 'rancher.basis.com.br',
        environment: 'Basis-TST',
        stack: 'abaco',
        service: 'abaco-ui'
    ]
    rocketChannel = ''
    recipientList = ''
    sendSuccessNotification = false
}
