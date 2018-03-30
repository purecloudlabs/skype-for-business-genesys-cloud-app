pipeline {
    agent {
        label 'dev_shared'
    }

    tools {
        nodejs 'NodeJS 6.12.1'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
    }

    environment {
        NODE_VERSION = "6.9.2"
        WEB_APP_NAME = "purecloud-skype"
        GZIP_WEB_APP = true
        LANG = "en_US.UTF-8"
        LANGUAGE = "en_US:en"
        LC_ALL = "en_US.UTF-8"
        PATH = "./node_modules/.bin:$PATH"
    }

    parameters {
        booleanParam(defaultValue: true, description: 'Build and deploy application to environments?', name: 'DEPLOY_APPLICATION')
        booleanParam(defaultValue: true, description: 'Deploy to dev?', name: 'DEPLOY_TO_DEV')
        booleanParam(defaultValue: false, description: 'Deploy to test?', name: 'DEPLOY_TO_TEST')
        booleanParam(defaultValue: false, description: 'Deploy to production?', name: 'DEPLOY_TO_PROD')
    }

    stages {
        stage('Setup Environment') {
            steps {
                sh 'printenv'

                echo "Building branch: ${env.GIT_BRANCH}"

                script {
                    currentBuild.description = env.GIT_BRANCH.replace('origin/', '')
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'rm -rf npm-utils && git clone git@bitbucket.org:inindca/npm-utils.git'
                    sh 'source ./npm-utils/scripts/jenkins-pre-build.sh ${NODE_VERSION} -m'

                    sh 'yarn install --pure-lockfile'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'yarn run ember test'
                }
            }

            post {
                failure {
                    mail to: 'omar.estrella@genesys.com', subject: "S4B FAILURE: ${currentBuild.displayName}", body: "Skype integration build ${env.BUILD_NUMBER} failed."
                }
            }
        }

        stage('Build') {
            when {
                expression {
                    params.DEPLOY_APPLICATION == true
                }
            }

            steps {
                script {
                    env.CDN_URL = sh script: "cdn --web-app-name purecloud-skype --build-number ${env.BUILD_NUMBER}", returnStdout: true
                    sh 'yarn run ember build --environment=production'
                }
            }
        }

        stage('Upload') {
            when {
                expression {
                    params.DEPLOY_APPLICATION == true
                }
            }

            steps {
                script {
                    if (params.DEPLOY_APPLICATION) {
                        sh "yarn run upload --web-app-name purecloud-skype --source-dir dist --create-manifest true --version 1.0.0 --build-number ${env.BUILD_NUMBER} --no-index-file-copy true"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    params.DEPLOY_APPLICATION == true && getDeployEnvironments().size() > 0
                }
            }

            steps {
                script {
                    def environments = getDeployEnvironments()
                    if (environments.size() > 0) {
                        echo "Deploying to: ${environments}"

                        environments.each {
                            sh "yarn run deploy --web-app-name purecloud-skype --dest-env ${it} --build-number ${env.BUILD_NUMBER}"
                        }
                    }
                }
            }
        }
    }
}

def getDeployEnvironments() {
    def deployMap = [dev: params.DEPLOY_TO_DEV, test: params.DEPLOY_TO_TEST, prod: params.DEPLOY_TO_PROD]
    return ['dev', 'test', 'prod'].findAll { deployMap[it] }
}
