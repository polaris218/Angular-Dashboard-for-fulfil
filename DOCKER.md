# **<center>DOCKER</center>**

## **Prerequisites**

To play with docker the bare minimum requirement is docker should be installed on your local system.

Here is the [link](https://docs.docker.com/v17.09/engine/installation/) where you can find information like **how to install docker** and **system requirement** etc.

Install docker in windows [Windows](https://docs.docker.com/docker-for-windows/install/)

Install docker in linux [Linux](https://runnable.com/docker/install-docker-on-linux)

Install docker in Mac [MAC](https://docs.docker.com/docker-for-mac/install/)

> **NOTE: Highly recomandation is to use docker for mac, docker for linux or docker for windows instead of `docker toolbox`. if you use `docker toolbox` then some features dosen't work. example: volume mapping in windows.**

## **Introduction**

#### What is docker?

- Docker is a container management service. The keywords of Docker are develop, ship and run anywhere. The whole idea of Docker is for developers to easily develop applications, ship them into containers which can then be deployed anywhere.

#### What is docker Hub?

- Docker hub is registry for docker images where you can store docker images and connect with github, bitbucket for auto build.
- Docker hub is providing feature to create public and private repository on docker hub.

#### What is docker Image?

- Docker image is a file. Docker Image used to execute code in docker container and docker image contains multiple containers in it.

#### What is docker container?

- Basically docker container contains code or our application with required configuration like environment that we need to run our application.

## **Basic Docker command**

All docker command start with `docker`.

- Check list of docker images: `docker images`
- Run docker image: `docker run {{imageName}}`
- Pull Image from docker Hub: `docker pull {{userName}}/{{imageName}}:{{tagName}}`
- Push Image from docker Hub: `docker push {{userName}}/{{imageName}}:{{tagName}}`
- Remove docker images: docker `rmi {{ImageID}}`
- Get list of running containers: `docker ps`
- Check history of image: `docker history {{ImageID}}`
- Start container: `docker start {{containerID}}`
- Stop container: `docker Stop {{containerID}}`
- Remove container: `docker rm {{containerID }}`
- Pause container: `docker pause {{containerID}}`
- Unpause container: `docker unpause {{containerID}}`
- Kill process of container: `docker kill {{containerID}}`
- Get statistics of running container: `docker stats {{containerID}}`
- Help regarding to docker command: `docker --help`, `docker container --help`, `docker images --help`, `docker-compose --help`

> **NOTE** : All names inside curly braces are placeholder.

## **Play with docker Images**

- To play with docker image on your local system then first step is to create new dockerfile with name `Dockerfile`
- Second step is to write configuation that understand by docker.

  Example:

  ```
  FROM node:12.13.0-alpine
  WORKDIR /usr/src/app
  COPY ./package.json ./
  RUN npm install
  COPY ./ ./
  EXPOSE 4200
  CMD npm start
  ```

- Third step is to build docker images for that we need to fire `docker build -t {{imageName}}:{{tagName}} -f {{specifyPathOfDockerfile}}`. if docker file is exists on root level then fire up command `docker build -t {{imageName}}:{{tagName}} .`

- Fourth step is to run docker container for that we need to fire command `docker run -p 80:4200 {{imageName}}:{{tagName}}`.
  - To check running docker container using `docker ps` command.
  - To check log of particular container using `docker logs {{containerId}}`.
  - To check file system inside running container `docker exec -it {{containerId}} sh` this command is used to attach terminal with your running container.
  - To restart container, pause running container, remove container for this command are specify above.
  - Here in `docker run` command we have specify `-p` flag. That flag is used to do port mapping of our application's port that is running inside container with our virtual machines port. So by using that port we can access application.
  - In `docker run` we have specify inline command like port mapping and also specify dockerfile context. To avoid this inline command in docker and if we want to build mutiple container and ifmultiple containers are tightly coupled with each other. To handle this kind of situation we used another command like `docker-compose`. Lets talk more about `docker-compose`.

## Play with docker compose

In our application we have used `docker-compose` to avoid writing inline commands.

- To start work with docker-compose then first step is to create new file with name `docker-compose.yml` at root level of the project.
- Second step is to write configuation.

  example:

  ```
  version: '3'

  services:
    dashboard:
      image: gcr.io/fulfil-web/dashboard
      build:
        context: ./
        dockerfile: ./environment/production/Dockerfile
      ports:
        - 80:80

    dashboard-development:
      image: gcr.io/fulfil-web/dashboard:development
      build:
        context: ./
        dockerfile: ./environment/development/Dockerfile
      ports:
        - 8080:4200
      volumes:
        - /usr/src/app/node_modules
        - .:/usr/src/app
  ```

  - Third step is to build and run multiple container. we can do it by using `docker-compose up --build .` here `up` and `--build` is used to build our container and make it running.
    - To build specific service then we need to run command `docker-compose build dashboard-development`.
    - To start specific service then we need to run command `docker-compose up -d dashboard-development`
    - in our project we have set command in package.json file.
      ```
      "docker:development:build": "docker-compose build dashboard-development"
      ```
      ```
      "docker:development:build": "docker-compose build dashboard"
      ```

## **Docker In Local Enviroment**

#### Why we use docker in local development?

- To avoid enviroment dependency (ex: Nodejs, NPM etc).

#### How we can start local development using docker?

- Below are the steps that you need to follow.

  1.  (You need to perform) Bare minimum requirement is to install docker in your local system. for that kindly visit prerequisite section and install docker in your system then continue with next point.

  2.  (You need to perform) Once docker installed then simply you need to go to the your project directory.

      If you already install npm in your local system then fire up command `npm run docker:development:run` in terminal. This command is start building image locally. once image gets build then it will run application on `8080` port (http://localhost:8080). we have setup couple of commands for development and other enviroment in `package.json` file.

      If you have't install npm in your local system then fire up command `docker-compose up --build fulfil-dashboard-development` in terminal. This command is start building image locally. once image gets build then it will run application on `8080` port (http://localhost:8080).

**_docker-compose.yml_**

```
dashboard-development:
    image: gcr.io/fulfil-web/dashboard:development
    build:
      context: ./
      dockerfile: ./environment/development/Dockerfile
    ports:
      - 8080:4200
    volumes:
      - /usr/src/app/node_modules
      - .:/usr/src/app
```

## Deployment

we use google cloud to host our docker image.

To host our image we have setup semaphoreCI pipeline to build docker image, run test on top of the docker container and host our applicatio non google container registry (GCR).

- Semahpore CI Pipeline (Build):
  ```
  npm Install
  ```
- Semaphore CD Pipeline (Deployment)

  ```
  curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-254.0.0-linux-x86_64.tar.gz
  tar zxf
  google-cloud-sdk-254.0.0-linux-x86_64.tar.gz
  source google-cloud-sdk/path.bash.inc
  source google-cloud-sdk/completion.bash.inc
  gcloud --version
  gcloud auth activate-service-account --key-file /home/runner/auth.json --project fulfil-web
  npm run image-cleanup
  npm run docker:production:build
  npm run docker:production:push
  ```

  - `npm run image-cleanup` command is used to delete previous published images from GCR.

## Google Cloud

**How to publish docker image on Google Cloud?**

- We can publish docker image three ways.

  - First one is Just go to `Goggle container registry` push your image to GCR using `docker push {{hostName}}/{{projectName}}/{{imageName}}:{{tagName}}` To know more about pull, push image from GCR plese follow [Link](https://cloud.google.com/container-registry/docs/pushing-and-pulling).

  - Second way is to push image using some CI/CD tool like semaphore. we are using semaphoreCI to build, push image to GCR. Above first step is the manual process to push image to GCR and connect deploy to the **Instace template** or **VM (Virtual Machine)**.

  - Third way is to create cluster and push that cluster to kubernetes engine. Cluster approach is used when we have multiple containers in same application.

#### We are using second approch to push image to GCR.

- We have setup CD pipeline to deploy our image. In CD pipeline we push our image to GCR. In our project we used **Instace template** to run our container and expose our application to the out side the world. when we push our image to the GCR first time then we need to create Instace template and connect it with our image. We can create **Instace template** using `Cli` and `Gui` that is provided by Google cloud. for more detail about creation of instace template. please follow [Link](https://cloud.google.com/compute/docs/instance-templates/create-instance-templates). After creation of instace template we need to connect it with **Instance Group**. For more detail about **Instance Group** please follow [Link](https://cloud.google.com/compute/docs/containers/deploying-containers).

- Above creation and connect with each other of **Instance template** and **Instance Group** is one time process.

- In our project we are using CD pipeline to push image. When we push image to GCR our **Instace Group** is not updated with latest image automatically. We need to trigger rolling action to run latest image. We can trigger below command to restart our **Instace Group**. To know more about rolling action please follow [Link](https://cloud.google.com/compute/docs/instance-groups/rolling-out-updates-to-managed-instance-groups).
  We used below command to restart our instance group.

```
gcloud compute instance-groups managed rolling-action restart fulfil-dashboard-docker-instance-group
--zone us-central1-a
```

> **NOTE:** We can use same command on Google Cloud that we used in our environment To restart container, stop container, check logs of container, check list of images etc.
