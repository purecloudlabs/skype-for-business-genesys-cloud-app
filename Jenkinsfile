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

    stages {
        stage('Setup Environment') {
            steps {
                sh 'printenv'

                echo "Building branch: ${env.BRANCH_NAME}"

                script {
                    currentBuild.description = env.BRANCH_NAME
                    env.WEB_APP_VERSION = env.BRANCH_NAME.replace('origin/', '')
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
        }

        stage('Build') {
            steps {
                script {
                    env.CDN_URL = sh script: "cdn --web-app-name purecloud-skype --build-number ${env.BUILD_NUMBER}", returnStdout: true
                    sh 'yarn run ember build --environment=production'
                }
            }
        }

        stage('Upload') {
            steps {
                script {
                    sh "yarn run upload --web-app-name purecloud-skype --source-dir dist --create-manifest true --version 1.0.0 --build-number ${env.BUILD_NUMBER} --no-index-file-copy true"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh "yarn run deploy --web-app-name purecloud-skype --dest-env dev --build-number ${env.BUILD_NUMBER}"
                }
            }
        }
    }
}
