pipeline {
    agent {
        docker {
            image 'node:6.12.1-alpine'
            args '-u root:root'
            label 'dev_shared'
        }
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

    stages {
        stage('Setup Environment') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"

                script {
                    currentBuild.description = env.BRANCH_NAME
                    env.DEFAULT_NODE_PATH = sh script: 'which node', returnStdout: true
                    env.DEFAULT_NODE_VERSION = sh script: 'npm --version', returnStdout: true
                    env.WEB_APP_OUTPUT_DIR = "${env.WORKSPACE}/skype-for-business-purecloud-app/dist"
                    env.WEB_APP_VERSION = env.BRANCH_NAME.replace('origin/', '')
                }

                checkout scm

                sh 'printenv'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'apk add --no-cache git openssh'

                    sh 'rm -rf npm-utils && git clone git@bitbucket.org:inindca/npm-utils.git'
                    sh 'source ./npm-utils/scripts/jenkins-pre-build.sh ${NODE_VERSION} -m'

                    sh 'yarn install --pure-lockfile'
                    sh 'yarn add bower'
                    sh 'yarn run bower install'

                    // sh '''
                    //     rm -rf npm-utils && git clone git@bitbucket.org:inindca/npm-utils.git
                    //     source ./npm-utils/scripts/jenkins-pre-build.sh ${NODE_VERSION} -m
                    //     npm install yarn

                    //     yarn install --pure-lockfile
                    //     yarn add bower
                    //     yarn run bower install
                    // '''
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'yarn run ember test'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'yarn run ember build --environment=production'
                }
            }
        }
    }
}