# Local Demo Setup Guide

## Table of Contents

- [Local Demo Setup Guide](#local-demo-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Purpose of this guide](#purpose-of-this-guide)
  - [Components](#components)
  - [Quick Setup](#quick-setup)
    - [1. System Requirements](#1-system-requirements)
    - [2. Obtain Value Set Authority Center (VSAC) API key](#2-obtain-value-set-authority-center-vsac-api-key)
    - [3. Run](#3-run)
    - [4. Verify everything is working](#4-verify-everything-is-working)
  - [Cleanup and Useful Options](#cleanup-and-useful-options)
    - [Remove the Docker Compose containers to free up resources](#remove-the-docker-compose-containers-to-free-up-resources)
    - [Cleanup Docker resources](#cleanup-docker-resources)
    - [Updating Docker Compose application images](#updating-docker-compose-application-images)
    - [Setting Environment Variables](#setting-environment-variables)
    - [Running with SSL](#running-with-ssl)

## Purpose of this guide

This document details instructions on how to quickly get up and running with a local demo deployment of the full-stack
REMS Integration Prototype environment. This is primarily meant for non-technical users interested in exploring the
prototype on their own machine.

_Note:_ If you are looking to contribute or make code changes, please see the full
[Developer Environment Setup](DeveloperSetupGuide.md).

_Note:_ If you are looking to just have more control or configuration options with Docker in your local environment, see
[the configurable install](#docker-compose-without-porter).

## Components

The following REMS components will be deployed in Docker locally:

1. [test-ehr](https://github.com/mcode/test-ehr)
2. [request-generator](https://github.com/mcode/request-generator)
3. [rems-admin](https://github.com/mcode/rems-admin.git)
4. [rems-setup](https://github.com/mcode/rems-setup.git)
5. [pims (Pharmacy Information Management System)](https://github.com/mcode/pims)
6. [rems-smart-on-fhir](https://github.com/mcode/rems-smart-on-fhir)

## Quick Setup

### 1. System Requirements

See [this section](DeveloperSetupGuide.md/#minimum-system-requirements) from the developer setup guide for more information.

### 2. Obtain [Value Set Authority Center (VSAC)](https://vsac.nlm.nih.gov/) API key

See [this section](DeveloperSetupGuide.md/#obtain-value-set-authority-center-vsac-api-key) from the developer setup guide for more information.

### 3. Run

1. [Install git](https://www.atlassian.com/git/tutorials/install-git).
2. Use git to clone or download and extract the zip of the [rems-setup repository](https://github.com/mcode/rems-setup.git).
3. In your terminal, navigate to the rems-setup directory.

   ```bash
   cd rems-setup
   ```

4. Set up your local environment with your VSAC credentials (`VSAC_API_KEY`) and Docker Compose project name (`COMPOSE_PROJECT_NAME`). See the [setting environment variables section](#setting-environment-variables) for more information.

5. Start Docker Compose application

   ```bash
   cd rems-setup # Need to execute commands in directory with corresponding docker-compose.yml file located in the REMS repository
   docker compose up
   ```

   Note, if you are using an M1/M2 mac, you'll need to prepend `docker compose` commands with
   `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 DOCKER_DEFAULT_PLATFORM=linux/arm64`.

   ```bash
   cd rems-setup # Need to execute commands in directory with corresponding docker-compose.yml file located in the REMS repository
   COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 DOCKER_DEFAULT_PLATFORM=linux/arm64 docker compose up
   ```

### 4. Verify everything is working

See [this guide](Verify-REMS-Integration-Prototype-Works.md) to generate a test request.

## Cleanup and Useful Options

### Remove the Docker Compose containers to free up resources

```bash
docker compose down
```

or if on M1/M2 Mac use

```bash
docker compose -f docker-compose-m1.yml down
```

### Cleanup Docker resources

To remove all images, volumes, and artifacts set up during the install, run the following commands

```bash
docker image prune -a
docker volume prune
docker network prune
```

### Updating Docker Compose application images

```bash
docker compose build --no-cache --pull [<service_name1> <service_name2> ...]
docker compose --force-recreate  [<service_name1> <service_name2> ...]
# Options:
#   --force-recreate                        Recreate containers even if their configuration and image haven't changed.
#   --build                                 Build images before starting containers.
#   --pull                                  Pull published images before building images.
#   --no-cache                              Do not use cache when building the image.
#   [<service_name1> <service_name2> ...]   Services to recreate, not specifying any service will rebuild and recreate all services
```

### Setting Environment Variables

See [this section](DeveloperSetupGuide.md/#setting-environment-variables-and-system-path) from the developer setup guide for more information.

> At this point, you should have credentials to access VSAC. If not, please refer to step 2 of [quick setup](#quick-setup) for how to create these credentials and return here after you have confirmed you can access VSAC. If this is not configured, you will get `org.hl7.davinci.endpoint.vsac.errors.VSACValueSetNotFoundException: ValueSet 2.16.840.1.113762.1.4.1219.62 Not Found` errors.

> While this step is optional, we **highly recommend** that you do it so that REMS will have the ability to dynamically load value sets from VSAC.

> Be aware that if you have chosen to skip this step, you will be required to manually provide your VSAC credentials
> at <http://localhost:8090/data> and hit **Reload Data** every time you want REMS to use new or updated value sets.

Note: How you set environment and path variables may vary depending on your operating system and terminal used.

### Running with SSL

See the documentation [here](SSLSetupGuide.md).
