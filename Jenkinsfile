pipeline {
    agent any

    //tools {nodejs "NodeJS"}
  
    stages {
        stage('Source') {
            steps {
                // Get  code from a GitHub repository
                git 'https://github.com/mdjawad0/estore-enduser.git'

                // Run npm install
                sh "npm install"

                echo 'Source Stage Finished'
            }
        }

        stage('Test') {
            steps {
                // Run ng test command
                //sh "ng test --browsers ChromeHeadless --watch=false"
                echo 'Test Stage Finished'
            }
        }

        stage('Build') {
            steps {
                // Run ng build command
                sh "ng build"
                echo 'Test Stage Finished'
            }
        }

        stage('Containerize') {
            steps {

                // Run docker command to build a container
                sh "docker build -t estore-end-user ."

                echo 'Containerizing the App with Docker'
            }
        }

        stage('Deploy') {
            steps {

                // Run the image in port 9191
                sh "docker run -d -p 9191:80 estore-end-user"

                echo 'Deploy the App with Docker'
            }
        }
    }
}
