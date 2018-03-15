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
        booleanParam(defaultValue: true, description: 'Build and deploy application to environments?', name: 'deployApplication')
        booleanParam(defaultValue: true, description: 'Deploy to dev?', name: 'deployToDev')
        booleanParam(defaultValue: false, description: 'Deploy to test?', name: 'deployToTest')
        booleanParam(defaultValue: false, description: 'Deploy to production?', name: 'deployToProd')
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
                    sh 'yarn add bower phantomjs-prebuilt'
                    sh 'yarn run bower install'
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
                    mail to: 'omar.estrella@genesys.com', subject: "FAILURE: ${currentBuild.displayName}", body: "Build ${env.BUILD_NUMBER} failed."
                }
            }
        }

        stage('Build') {
            when {
                expression {
                    params.deployApplication == true
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
                    params.deployApplication == true
                }
            }

            steps {
                script {
                    if (params.deployApplication) {
                        sh "yarn run upload --web-app-name purecloud-skype --source-dir dist --create-manifest true --version 1.0.0 --build-number ${env.BUILD_NUMBER} --no-index-file-copy true"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    params.deployApplication == true && getDeployEnvironments().size() > 0
                }
            }

            steps {
                script {
                    def environments = getDeployEnvironments()
                    if (environments.size() > 0) {
                        echo "Deploying to: ${environments}"

                        def environmentsParam = environments.join(',')
                        sh "yarn run deploy --web-app-name purecloud-skype --dest-env ${environmentsParam} --build-number ${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }
}

def getDeployEnvironments() {
    def deployMap = [dev: params.deployToDev, test: params.deployToTest, prod: params.deployToProd]
    return ['dev', 'test', 'prod'].findAll { deployMap[it] }
}
