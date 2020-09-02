@Library('pipeline-library@master') _

webappPipeline {
    slaveLabel = 'dev_v2'
    projectName = 'purecloud-skype'
    manifest = directoryManifest('./dist')
    buildType = { env.BRANCH_NAME == 'master' ? 'MAINLINE' : 'FEATURE' }
    publishPackage = {}

    cmConfig = {
        return [
            managerEmail: 'omar.estrella@genesys.com',
            rollbackPlan: 'Rollback to previous version.',
            testResults: 'https://jenkins.ininica.com/job/web-pipeline-skype-integration/job/master/'
        ]
    }

    buildStep = {
      env.CDN_VERSION = (env.BRANCH_NAME == 'master' && env.VERSION != null) ? env.VERSION : env.BRANCH_NAME

      sh("""
        export CLIENT_ID=e47d28c7-9b4c-4d94-bf1e-09fd1e20d92c
        export CDN_URL="\$(npx cdn --ecosystem pc --name \$APP_NAME --build \$BUILD_ID --version ${CDN_VERSION})"
        yarn --pure-lockfile
        yarn test
        yarn run build
      """)
    }
}
