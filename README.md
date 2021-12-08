# Dockerized RedM Server
This repository contains a setup for a dockerized RedM Server that can be fully customized while encuraging git workflow.

# Table of contents
- [Getting Started](#getting-started)

# Getting Started
The following chapter will explain how to install, configure and start the dockerized RedM server.

## Installation
In order to install the dockerized RedM server you will need a copy of this repository. Simply use the following git clone command or download a archive of this repository.
```
git clone https://github.com/bumbummen99/RedM.git
```

## Configuration
It is necessary to configure the server before you start the container. To do so you have to copy the .env.example to .env.
```
cp .env.example .env
```
Open the `.env` file with your favourite text editor and follow the instructions in the comments. Do not forget to save this file. Make sure this file does not get leaked as it will contain your private information.

You can put .cfg files into the `cfg` subfolder. These will be apended to the server.cfg template in the `docker` subfolder in ascending order. **Use this to install plugins and configure them.**

## Starting
In order to start the container you will have to use docker-compose. Simply use the following command to start the containers in the current session.
```
docker-compose up
```

You can also append the `-d` flag to start it daemonized and `docker-compose down` to stop it. It is **absolutely required** that you do understand the basics of docker and docker-compose!

### Service
You can also run the setup as a `systemd` service. To do so simply run the provided maintenance script.
```
./maintenance/install-service.sh
```
This will create and enable a .service file for the docker-compose setup. Make sure that restarting is disabled in the compose as that will be handled by systemd.

## Pro tips
If the default server.cfg does for some reason not accommodate your needs you can provide your own template. Simply copy the `server.cfg` file from the `docker` subfolder and adjust it to your needs. Once done you can link it in the docker-compose.yml.
