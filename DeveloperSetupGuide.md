# Docker Developer Setup Guide

Follow this guide if you would like to use [Docker](https://docs.docker.com/get-started/overview/) for running REMS (Risk Evaluation and Mitigation Strategies) Integration Prototype for Local Development.

## Table of Contents

- [Docker Developer Setup Guide](#docker-developer-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Purpose of this guide](#purpose-of-this-guide)
    - [Expected Functionality](#expected-functionality)
  - [Prerequisites](#prerequisites)
    - [Minimum system requirements:](#minimum-system-requirements)
    - [Obtain Value Set Authority Center (VSAC) API key](#obtain-value-set-authority-center-vsac-api-key)
    - [Setting Environment Variables and System Path](#setting-environment-variables-and-system-path)
  - [Install core tools](#install-core-tools)
    - [Install Docker Desktop](#install-docker-desktop)
    - [Install Visual Studio Code and Extensions](#install-visual-studio-code-and-extensions)
    - [Install Ruby](#install-ruby)
    - [Install docker-sync](#install-docker-sync)
  - [Clone REMS repositories](#clone-rems-repositories)
  - [Open REMS as VS Code workspace](#open-rems-as-vs-code-workspace)
    - [Pre-configured settings in the VS Code workspace](#pre-configured-settings-in-the-vs-code-workspace)
    - [Add VSAC credentials to your development environment](#add-vsac-credentials-to-your-development-environment)
  - [Run REMS Integration Prototype](#run-rems-integration-prototype)
    - [Start application using docker-sync](#start-application-using-docker-sync)
    - [Debugging docker-sync application](#debugging-docker-sync-application)
    - [Stop docker-sync application and remove all containers/volumes/images](#stop-docker-sync-application-and-remove-all-containersvolumesimages)
    - [Rebuilding Images and Containers](#rebuilding-images-and-containers)
    - [Useful docker-sync commands](#useful-docker-sync-commands)
- [Verify the REMS Integration Prototype is working](#verify-the-rems-integration-prototype-is-working)
  - [Running with SSL](#running-with-ssl)

## Purpose of this guide

This document details the installation process for the Dockerized version of the **REMS Integration Prototype**
environment for Local Development. Be aware that each component has its own README where you will find
more detailed documentation. This document **is not designed to replace those individual READMEs**.

This document is designed to take you through the entire setup process for the **REMS Integration Prototype** using [Docker containers](https://www.docker.com/resources/what-container/).

This guide will take you through the development environment setup for each of the following REMS components:

1. [test-ehr](https://github.com/mcode/test-ehr)
2. [request-generator](https://github.com/mcode/request-generator)
3. [rems-admin](https://github.com/mcode/rems-admin.git)
4. [rems-setup](https://github.com/mcode/rems-setup.git)
5. [pims (Pharmacy Information Management System)](https://github.com/mcode/pims)
6. [rems-smart-on-fhir](https://github.com/mcode/rems-smart-on-fhir)
7. [rems-intermediary](https://github.com/mcode/rems-intermediary.git)
8. [rems-directory](https://github.com/mcode/rems-directory.git)

### Expected Functionality

1. File Synchronization between local host system and Docker containers
2. Automatic Server Reloading whenever source file is changed
3. Automatic Dependency Installation whenever package.json, package-lock.json, or build.gradle are changed
4. Automatic Data Loader in test-ehr whenever the fhirResourcesToLoad directory is changed

## Prerequisites

### Minimum system requirements:

- x86_64 (64-bit) or equivalent processor
  - Follow these instructions to verify your machine's compliance:
    <https://www.macobserver.com/tips/how-to/mac-32-bit-64-bit/>
- At least 16 GB of RAM (12 GB recommended minimum for Docker Desktop)
- At least 256 GB of storage
- Internet access
- [Chrome browser](https://www.google.com/chrome/)
- [Git installed](https://www.atlassian.com/git/tutorials/install-git)

### Obtain [Value Set Authority Center (VSAC)](https://vsac.nlm.nih.gov/) API key

1. [Click here](https://www.nlm.nih.gov/research/umls/index.html) to read about UMLS.
2. Click 'Request a license' under 'Get Started'.
3. If you already have a key you can click 'Visit Your Profile' under 'UTS Profile' in the right hand side-bar. The API key will be listed under your username.
4. If you do not have a key, click 'Generate an API Key'.
5. Sign in using one of the providers (Login.gov recommended).
6. Agree to terms of service.
7. Fill out request form for VSAC API Key - you'll need to provide some basic information for the NIH to get your account approved.
8. Generating the key is an automated process, you should be approved via e-mail fairly quickly. If not, use the contact information in the first link to reach out to the office (this is not managed by our team / system).
9. Once approved, loop back to steps 1-3.

### Setting Environment Variables and System Path

The following instructions are for Mac and Linux.

You can see a list of your pre-existing environment variables on your machine by running `env` in your Terminal. To add to `env`:

1. `cd ~/`
2. Open your `.zshrc` (Mac) or `.bash_profile` (Linux) and add the following line at the very bottom:

   ```bash
   export VSAC_API_KEY=vsac_api_key
   ```

3. Save `.bash_profile` and complete the update to `env`:

   ```bash
   source .bash_profile
   ```

How you set environment and path variables may vary depending on your operating system and terminal used. For instance, for zsh on MacOS you typically need to modify .zshrc instead of .bash_profile. To figure out how to set environment variables for your system, consult the guides below or google
`how to permanently set environment/path variables on [insert operating system] [insert terminal type]`.

For more information on how to set environment variables consult these following guides:

- https://chlee.co/how-to-setup-environment-variables-for-windows-mac-and-linux/
- https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html
- https://unix.stackexchange.com/questions/117467/how-to-permanently-set-environmental-variables

## Install core tools

### Install Docker Desktop

1. Download the **stable** version of **[Docker Desktop](https://www.docker.com/products/docker-desktop)** and follow
   the steps in the installer. Make sure you install version 18.03 or later.
2. Once the installation is complete, verify that **Docker Desktop is running.**
3. Configure Docker to have access to enough resources. To do this, open Docker Desktop and select Settings > Resources.

> **Note: The defaults for CPU/Memory at 2GB are too low to run the entire REMS workflow.**
>
> If not enough resources are provided, you may notice containers unexpectedly crashing and stopping. Exact requirements
> for these resource values will depend on your machine. That said, as a baseline starting point, the system runs
> relatively smoothly at 15GB memory and 6 CPU Processors on MITRE issued Mac Devices.

### Install Visual Studio Code and Extensions

We recommend Visual Studio Code for local development.

1. Install Visual Studio Code - <https://code.visualstudio.com>
2. Install Extensions - The workspace should automatically recommend extensions to install when opening the workspace

### Install Ruby

Note: The default ruby that comes with Mac may not install the right package version for docker-sync. We recommend installing ruby with a package manager, such as [rbenv](https://github.com/rbenv/rbenv).

1. Install rbenv

   ```bash
   brew install rbenv
   ```

2. Initialize rbenv and follow instructions (setting system path troubleshooting:
   <https://stackoverflow.com/questions/10940736/rbenv-not-changing-ruby-version>)

   ```bash
   rbenv init
   ```

3. Close Terminal so changes take effect
4. Test rbenv is installed correctly

   ```bash
   curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-doctor | bash
   ```

5. Install Ruby

   ```bash
   rbenv install 3.2.2
   ```

6. Verify that the system is using the correct ruby versions

   ```bash
   which ruby
   /Users/$USER/.rbenv/shims/ruby # Correct

   ...

   which ruby
   /usr/bin/ruby # Incorrect, using system default ruby. Path not set correctly, reference step 2
   ```

### Install docker-sync

1. Download and Install docker-sync using the following command:

   ```bash
   gem install docker-sync -v 1.0.5
   ```

2. Test that the right version is installed

   ```bash
   docker-sync -v
   1.0.5  # Correct

    ...

   docker-sync -v
   0.1.1  # Incorrect, make sure you have the correct ruby installed and are not using the default system ruby
   ```

   Note: The versioning is important, as the system default Ruby sometimes installs version 0.1.1 if the -v tag is not set. The
   0.1.1 release will not work for the rest of this guide.

## Clone REMS repositories

1. Create a root directory for the REMS development work (we will call this `<rems-root>` for the remainder of this setup
   guide). While this step is not required, having a common root for the REMS Integration Prototype components will make things a lot easier
   down the line.

   ```bash
   mkdir <rems-root>
   ```

   `<rems-root>` will be the base directory into which all the other components will be installed. For example, test-ehr will
   be cloned to `<rems-root>/test-ehr`.

   Note: If you are using a different project structure from the above description, you will need to change the
   corresponding repo paths in docker-compose-dev.yml, docker-sync.yml, and docker-compose.yml

2. Now clone the REMS Integration Prototype component repositories from Github:

   ```bash
   cd <rems-root>

   git clone https://github.com/mcode/test-ehr.git test-ehr
   git clone https://github.com/mcode/request-generator.git request-generator
   git clone https://github.com/mcode/rems-admin.git rems-admin
   git clone https://github.com/mcode/pims.git pims
   git clone https://github.com/mcode/rems-smart-on-fhir.git rems-smart-on-fhir
   git clone https://github.com/mcode/rems-setup.git rems-setup
   git clone https://github.com/mcode/rems-intermediary.git rems-intermediary
   git clone https://github.com/mcode/rems-directory.git rems-directory

   # Update the Submodules
   cd rems-admin
   git submodule update --init

   cd ..

   cd rems-smart-on-fhir
   git submodule update --init

   cd ..

   cd rems-intermediary
   git submodule update --init
   ```

## Open REMS as VS Code workspace

This repository contains the **REMS.code-workspace** file. This will open the above project structure as a
multi-root VS Code workspace.

To open this workspace, select `File > Open Workspace from File...` and select
`<rems-root>/rems-setup/REMS.code-workspace`, or double-click on the `REMS.code-workspace` file in your file browser.

### Pre-configured settings in the VS Code workspace

The [**Debugger Tab**](https://code.visualstudio.com/docs/editor/debugging) has various debugging configurations and can
be used to easily debug any errors that come up during development. Simply start one of the debuggers and set a
breakpoint anywhere in the code base.

The [**Source Control Tab**](https://code.visualstudio.com/docs/editor/versioncontro) can be used to easily track
changes during the development process and perform git actions, with each root of the workspace having its own source
control header.

The [**Docker Extension for VS Code**](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
has useful functionality to aid in the development process using this setup guide. This extension lets you easily
visualize the containers, images, networks, and volumes created by this setup. Clicking on a running container will
open up the file structure of the container.

Right clicking on a running container will give the option to view container logs (useful to see output from select
services), attach a shell instance within the container, and attach a Visual Studio Code IDE to the container using
remote-containers.

The [MongoDB Extension](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) allows for
connecting to the pharmacy information system's backend database. The connection string is something like the
following--you will need to change the values for user name, password, etc. based on your setup:
`mongodb://pharmacy-information-root:pharmacy-information-password@localhost:27017/?retryWrites=true&w=majority`.

### Add VSAC credentials to your development environment

At this point, you should have credentials to access VSAC. If not, please refer to [Prerequisites](#prerequisites) for
how to create these credentials and return here after you have confirmed you can access VSAC.

Create a local copy of the file `rems-setup/.env` and rename that copy to `rems-setup/.env.local` to reflect your credentials:

```bash
# In file: rems-setup/.env.local

VSAC_API_KEY = <the key you got from the VSAC web site>
COMPOSE_PROJECT_NAME = <name of Docker Compose project>
```

To download the full ValueSets, your VSAC account will need to be added to the CMS-DRLS author group on
<https://vsac.nlm.nih.gov/>. You will need to request membership access from an admin. While this step is optional, we
**highly recommend** that you do it so that REMS Integration Prototype will have the ability to dynamically load value sets from VSAC. Please
reach out to Sahil Malhotra at <smalhotra@mitre.org> in order to request access to the CMS-DRLS author group.

If this is not configured, you will get errors like this:

> Error: org.hl7.davinci.endpoint.vsac.errors.VSACValueSetNotFoundException: ValueSet 2.16.840.1.113762.1.4.1219.62 Not
> Found

## Run REMS Integration Prototype

### Start application using docker-sync

The project uses docker-sync to start up and connect all the various Docker containers and networks. The single command
below should build all images and start up all containers.

_Note:_ Initial setup will take several minutes and spin up fans with high resource use. Be patient, future boots will
be much quicker, quieter, and less resource intensive.

```bash
docker-sync-stack start # This is the equivalent of running docker-sync start followed by docker-compose up
```

Watch the output until `rems_dev_test-ehr` has finished starting up, usually something like this:

```log
rems_dev_test-ehr               | > Task :loadData

[...many things that succeed]

rems_dev_test-ehr               | BUILD SUCCESSFUL
```

> **Note for Apple Mac developers:** Additional `docker compose` environment variables need to be set. You can prefix
> each command with these, or set them in your environment (as above):
>
> ```bashrc
> COMPOSE_DOCKER_CLI_BUILD=1
> DOCKER_BUILDKIT=1
> DOCKER_DEFAULT_PLATFORM=linux/arm64
> ```
>
> **NOTE 2**: On M1 Macs, docker-sync (as of 16 Aug 2023) pulls the wrong unison image. You will need to edit the docker-sync gem file directly (grep for "AMD64" and replace it with "ARM64"). Hopefully this gets resolved soon.

### Debugging docker-sync application

> NOTE: To debug the docker-sync utility itself, see the
> [docker-sync docs](https://docker-sync.readthedocs.io/en/latest/troubleshooting/sync-stopping.html).

To debug the application hosted by docker-sync:

1. Select the Debugger Tab on the left side panel of VS Code
2. From the drop down menu next to Run and Debug select **Debug All REMS Applications (Docker) (workspace)**.

   This is a compound debugger that combines all the other Docker debuggers for all servers and applications in this
   workspace.

3. When finished debugging, simply hit the disconnect button to close out all debug sessions
4. **Important**: Make sure to close out the **Launch Chrome in Debug Mode** task that gets open in the VS Code terminal
   space.

   This task launches Chrome in debug mode in order to debug frontend applications in this workspace. It must be closed
   in order to run the debugger again next time. Leaving it open will not properly start the frontend debuggers.

   ![Closing Launch Chrome Task](./setup-images/ClosingLaunchChromeTask.png)

### Stop docker-sync application and remove all containers/volumes/images

```bash
docker-sync-stack clean # This is the equivalent of running docker-sync clean followed by docker compose down

docker image prune -a # Remove unused images

docker volume prune # Remove unused volumes
```

### Rebuilding Images and Containers

```bash
docker compose -f docker-compose-dev.yml up --build --force-recreate  [<service_name1> <service_name2> ...]
```

or, if you need to rebuild first:

```bash
docker compose -f docker-compose-dev.yml build --no-cache --pull [<service_name1> <service_name2> ...]

docker compose -f docker-compose-dev.yml up --force-recreate  [<service_name1> <service_name2> ...]
```

After rebuilding images and containers, start docker-sync normally.

You may need to first type <kbd>Control-C</kbd> to stop running the `docker-compose up` command (containers running
without sync functionality).

```bash
docker-sync-stack start # If this command fails to run, running a second time usually fixes the issue
```

### Useful docker-sync commands

Reference: <https://docker-sync.readthedocs.io/en/latest/getting-started/commands.html>

# Verify the REMS Integration Prototype is working

See [this guide](Verify-REMS-Integration-Prototype-Works.md) to generate a test request.

## Running with SSL

See the documentation [here](SSLSetupGuide.md).
