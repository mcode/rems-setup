# REMS-Docker - The Ultimate Guide to Running DRLS REMS for Local Development

## Purpose of this guide

This document details the installation process for the dockerized version of the **REMS Proof of Concept Prototype
Workflow** system for Local Development. Be aware that each component of DRLS has its own README where you will find
more detailed documentation. This document **is not designed to replace those individual READMEs**.

This document **is designed to take you through the entire set up process for DRLS using docker containers**. It is a
standalone guide that does not depend on any supplementary DRLS documentation.

This guide will take you through the development environment setup for each of the following DRLS components:

1. [Coverage Requirements Discovery (CRD)](https://github.com/mcode/CRD)
2. [(Test) EHR FHIR Service](https://github.com/HL7-DaVinci/test-ehr)
3. [Documents, Templates, and Rules (DTR) SMART on FHIR app](https://github.com/mcode/dtr)
4. [Clinical Decision Support (CDS) Library](https://github.com/mcode/CDS-Library)
5. [CRD Request Generator](https://github.com/mcode/crd-request-generator)
6. [REMS](https://github.com/mcode/REMS.git)
7. [Pharmacy Information System](https://github.com/mcode/pharmacy-information-system)
8. [Keycloak](https://www.keycloak.org/)

### Expected Functionality

1. File Synchronization between local host system and docker container
2. Automatic Server Reloading whenever source file is changed
   - CRD also reloads on CDS_Library changes
3. Automatic Dependency Installation whenever package.json, package-lock.json, or build.gradle are changed
4. Automatic Data Loader in test-ehr whenever the fhirResourcesToLoad directory is changed

## Table of Contents

- [REMS-Docker - The Ultimate Guide to Running DRLS REMS for Local Development](#rems-docker---the-ultimate-guide-to-running-drls-rems-for-local-development)
  - [Purpose of this guide](#purpose-of-this-guide)
    - [Expected Functionality](#expected-functionality)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [Setting Environment Variables and System Path](#setting-environment-variables-and-system-path)
  - [Install core tools](#install-core-tools)
    - [Installing core tools](#installing-core-tools)
      - [Install Docker Desktop](#install-docker-desktop)
      - [Install Visual Studio Code and Extensions](#install-visual-studio-code-and-extensions)
      - [Install Ruby](#install-ruby)
      - [Install Docker-sync](#install-docker-sync)
  - [Clone REMS repositories](#clone-rems-repositories)
  - [Open REMS as VS Code workspace](#open-rems-as-vs-code-workspace)
    - [Pre-configured settings in the VS Code workspace](#pre-configured-settings-in-the-vs-code-workspace)
    - [Add VSAC credentials to your development environment](#add-vsac-credentials-to-your-development-environment)
  - [Run DRLS](#run-drls)
    - [Start application using docker-sync](#start-application-using-docker-sync)
    - [Debugging docker-sync application](#debugging-docker-sync-application)
    - [Stop docker-sync application and remove all containers/volumes/images](#stop-docker-sync-application-and-remove-all-containersvolumesimages)
    - [Rebuilding Images and Containers](#rebuilding-images-and-containers)
    - [Useful docker-sync commands](#useful-docker-sync-commands)
  - [Verify the REMS prototype is working](#verify-the-rems-prototype-is-working)
    - [The fun part: Generate a test request](#the-fun-part-generate-a-test-request)
  - [Running with SSL](#running-with-ssl)

## Prerequisites

Your computer must have these minimum requirements:

- x86_64 (64-bit) or equivalent processor
  - Follow these instructions to verify your machine's compliance:
    <https://www.macobserver.com/tips/how-to/mac-32-bit-64-bit/>
- At least 16 GB of RAM (12 GB recommended minimum for Docker Desktop)
- At least 256 GB of storage
- Internet access
- [Chrome browser](https://www.google.com/chrome/)
- [Git installed](https://www.atlassian.com/git/tutorials/install-git)

Obtain [Value Set Authority Center (VSAC)](https://vsac.nlm.nih.gov/) API key

1. [Click here](https://www.nlm.nih.gov/research/umls/index.html) to read about UMLS
2. Click 'request a license' under 'Get Started'
3. If you already have a key you can click 'Visit Your Profile' in the right hand side-bar. The API key will be listed
   under your username.
4. If you do not have a key, click 'Generate an API Key'
5. Sign in using one of the providers (Login.gov recommended)
6. Agree to terms of service
7. Fill out request form for VSAC API Key - you'll need to provide some basic information for the NIH to get your
   account approved
8. Generating the key is an automated process, you should be approved via e-mail fairly quickly. If not, use the contact
   information in the first link to reach out to the office (this is not managed by our team / system).
9. Once approved, loop back to step 2

### Setting Environment Variables and System Path

How you set environment and path variables may vary depending on your operating system and terminal used. For instance,
for zsh on MacOS you typically need to modify .zshrc instead of .bash_profile. To figure out how to set environment
variables for your system, consult the guides below or google
`how to permanently set environment/path variables on [insert operating system] [insert terminal type]`.

    For more information on how to set environment variables consult these following guides:

    - https://chlee.co/how-to-setup-environment-variables-for-windows-mac-and-linux/
    - https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html
    - https://unix.stackexchange.com/questions/117467/how-to-permanently-set-environmental-variables

## Install core tools

### Installing core tools

#### Install Docker Desktop

1. Download the **stable** version of **[Docker Desktop](https://www.docker.com/products/docker-desktop)** and follow
   the steps in the installer. Make sure you install version 18.03 or later.
2. Once the installation is complete, verify that **Docker Desktop is running.**
3. Configure Docker to have access to enough resources. To do this, open Docker Desktop and select Settings > Resources.

> **Note: The Defaults for CPU/Memory at 2GB are too low to run the entire REMS workflow.**
>
> If not enough resources are provided, you may notice containers unexpectedly crashing and stopping. Exact requirements
> for these resource values will depend on your machine. That said, as a baseline starting point, the system runs
> relatively smoothly at 15GB memory and 6 CPU Processors on MITRE issued Mac Devices.

#### Install Visual Studio Code and Extensions

The recommended IDE for this set up is Visual Studio Code

1. Install Visual Studio Code - <https://code.visualstudio.com>
2. Install Extensions - The workspace should automatically recommend extensions to install when opening the workspace

#### Install Ruby

Note: The default ruby that comes with Mac may not install the right package version for docker-sync. It is recommended
to install ruby with a package manager, this guide uses [rbenv](https://github.com/rbenv/rbenv).

1. Install rbenv

   ```bash
   > brew install rbenv
   ```

2. Initialize rbenv and follow instructions (setting system path troubleshooting:
   <https://stackoverflow.com/questions/10940736/rbenv-not-changing-ruby-version>)

   ```bash
   > rbenv init
   ```

3. Close Terminal so changes take effect
4. Test rbenv is installed correctly

   ```bash
   > curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-doctor | bash
   ```

5. Install Ruby

   ```bash
   > rbenv install 2.7.2
   ```

6. Verify that the system is using the correct ruby versions

   ```bash
   > which ruby
   /Users/$USER/.rbenv/shims/ruby # Correct

   ...

   > which ruby
   /usr/bin/ruby # Incorrect, using system default ruby. Path not set correctly, reference step 2
   ```

#### Install Docker-sync

1. Download and Install docker-sync using the following command:

   ```bash
   > gem install docker-sync -v 0.7.0
   ```

2. Test that the right version is installed

   ```bash
   > docker-sync -v
   0.7.0  # Correct

    ...

   > docker-sync -v
   0.1.1  # Incorrect, make sure you have ruby installed and are not using the default system ruby
   ```

   Note: The versioning is important, system default ruby sometimes installs version 0.1.1 if -v tag is not set. The
   0.1.1 release will not work for the rest of this guide.

## Clone REMS repositories

1. Create a root directory for the REMS development work (we will call this `<drlsroot>` for the remainder of this setup
   guide). While this step is not required, having a common root for the DRLS components will make things a lot easier
   down the line.

   ```bash
   > mkdir <drlsroot>
   ```

   `<drlsroot>` will be the base directory into which all the other components will be installed. For example, CRD will
   be cloned to `<drlsroot>/crd`.

   Note: If you are using a different project structure from the above description, you will need to change the
   corresponding repo paths in docker-compose-dev.yml, docker-sync.yml, and docker-compose.yml

2. Now clone the DRLS component repositories from Github:

   ```bash
   > cd <drlsroot>
   > git clone https://github.com/mcode/test-ehr.git test-ehr
   > git clone https://github.com/mcode/crd-request-generator.git crd-request-generator
   > git clone https://github.com/mcode/REMS.git REMS
   > git clone https://github.com/mcode/pims.git pims
   > git clone https://github.com/mcode/rems-smart-on-fhir.git rems-smart-on-fhir
   > git clone https://github.com/mcode/rems-setup.git rems-setup

   > cd REMS
   > git submodule update --init

   > cd ..

   > cd rems-smart-on-fhir
   > git submodule update --init
   ```

## Open REMS as VS Code workspace

The REMS repository contains the **REMS.code-workspace** file. This will open the above project structure as a
multi-root VS Code workspace.

To open this workspace, select `File > Open Workspace from File...` and select
`<drls-root>/rems-setup/REMS.code-workspace`, or double-click on the `REMS.code-workspace` file in your file browser.

### Pre-configured settings in the VS Code workspace

In this workspace configuration, the CDS-Library embedded within CRD is opened as a separate root for an easier
development experience.

The [**Debugger Tab**](https://code.visualstudio.com/docs/editor/debugging) has various debugging configurations and can
be used to easily debug any errors that come up during development. Simply start one of the debuggers and set a
breakpoint anywhere in the code base.

The [**Source Control Tab**](https://code.visualstudio.com/docs/editor/versioncontro) can be used to easily track
changes during the development process and perform git actions, with each root of the workspace having its own source
control header.

The [**Docker Extension for VS Code**](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
has useful functionality to aid in the development process using this set up guide. This extension lets you easily
visualize the containers, images, networks, and volumes created by this set up. Clicking on a running container will
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

Create a local copy of the file `REMS/.env.example` and rename that copy to `REMS/.env` to reflect your credentials:

```bash
# In file: REMS/.env

VSAC_API_KEY = <the key you got from the VSAC web site>
COMPOSE_PROJECT_NAME = <name of Docker Compose project>
```

To download the full ValueSets, your VSAC account will need to be added to the CMS-DRLS author group on
<https://vsac.nlm.nih.gov/>. You will need to request membership access from an admin. While this step is optional, we
**highly recommend** that you do it so that DRLS will have the ability to dynamically load value sets from VSAC. Please
reach out to Sahil Malhotra at <smalhotra@mitre.org> in order to request access to the CMS-DRLS author group.

If this is not configured, you will get errors like this:

> Error: org.hl7.davinci.endpoint.vsac.errors.VSACValueSetNotFoundException: ValueSet 2.16.840.1.113762.1.4.1219.62 Not
> Found

## Run DRLS

### Start application using docker-sync

The project uses docker-sync to start up and connect all the various Docker containers and networks. The single command
below should build all images and start up all containers.

_Note:_ Initial set up will take several minutes and spin up fans with high resource use. Be patient, future boots will
be much quicker, quieter, and less resource intensive.

```bash
> docker-sync-stack start # This is the equivalent of running docker-sync start followed by docker-compose up
```

Watch the output until `rems_dev_test-ehr` has finished starting up, usually something like this:

```log
rems_dev_test-ehr               | > Task :loadData

[...many things that succeed]

rems_dev_test-ehr               | BUILD SUCCESSFUL
```

> **Note for Apple Mac developers:** Additional `docker-compose` environment variables need to be set. You can prefix
> each command with these, or set them in your environment (as above):
>
> ```bashrc
> COMPOSE_DOCKER_CLI_BUILD=1
> DOCKER_BUILDKIT=1
> DOCKER_DEFAULT_PLATFORM=linux/arm64
> ```
>
> **NOTE 2**: On M1 macs, docker-sync (as of 16 Aug 2023) pulls the wrong unison image. You will need to edit the docker-sync gem file directly (grep for "AMD64" and replace it with "ARM64"). Hopefully this gets resolved soon.

### Debugging docker-sync application

> NOTE: To debug the docker-sync utility itself, see the
> [docker-sync docs](https://docker-sync.readthedocs.io/en/latest/troubleshooting/sync-stopping.html).

To debug the application hosted by docker-sync:

1. Select the Debugger Tab on the left side panel of VS Code
2. From the drop down menu next to Run and Debug select **Debug All REMS Applications (Docker) (workspace)**.

   This is a compound debugger that combines all the other docker debuggers for all servers and applications in this
   workspace.

3. When finished debugging, simply hit the disconnect button to close out all debug sessions
4. **Important**: Make sure to close out the **Launch Chrome in Debug Mode** task that gets open in the VS Code terminal
   space.

   This task launches Chrome in debug mode in order to debug frontend applications in this workspace. It must be closed
   in order to run the debugger again next time. Leaving it open will not properly start the frontend debuggers.

   ![Closing Launch Chrome Task](./setup-images/ClosingLaunchChromeTask.png)

### Stop docker-sync application and remove all containers/volumes/images

```bash
> docker-sync-stack clean # This is the equivalent of running docker-sync clean followed by docker-compose down
> docker image prune -a #Remove unused images
> docker volume prune # Remove unused volumes
```

### Rebuilding Images and Containers

```bash
> docker-compose -f docker-compose-dev.yml up --build --force-recreate  [<service_name1> <service_name2> ...]
```

or, if you need to rebuild first:

```bash
> docker-compose -f docker-compose-dev.yml build --no-cache --pull [<service_name1> <service_name2> ...]
> docker-compose -f docker-compose-dev.yml up --force-recreate  [<service_name1> <service_name2> ...]
```

After rebuilding images and containers, start docker-sync normally.

You may need to first type <kbd>Control-C</kbd> to stop running the `docker-compose up` command (containers running
without sync functionality).

```bash
> docker-sync-stack start # If this command fails to run, running a second time usually fixes the issue
```

### Useful docker-sync commands

Reference: <https://docker-sync.readthedocs.io/en/latest/getting-started/commands.html>

## Verify the REMS prototype is working

### The fun part: Generate a test request

1. Go to the EHR UI at <http://localhost:3000> and play the role of a prescriber.
2. Click **Patient Select** button in upper left.
3. Find **Jon Snow** in the list of patients and click the first dropdown menu next to his name.
4. Select **2183126 (MedicationRequest) Turalio 200 MG Oral Capsule** in the dropdown menu.
5. Click anywhere in the row to select Jon Snow.
6. Click **Send Rx to PIMS** at the bottom of the page to send a prescription to the Pharmacist.
7. Click **Submit to REMS-Admin** at the bottom of the page, which demonstrates the case where an EHR has CDS Hooks
   implemented natively.
8. After several seconds you should receive a response in the form of two **CDS cards**:
9. Select **Patient Enrollment Form** on the returned CDS card with summary **Drug Has REMS: Documentation Required**.
10. If you are asked for login credentials, use **alice** for username and **alice** for password.
11. A webpage should open in a new tab, and after a few seconds, a questionnaire should appear.
12. Fill out the questionnaire and hit **Submit REMS Bundle**.
    - 12a. Alternatively fill out only some of the questionnaire for an asynchronous workflow and hit **Save to EHR**.
    - 12b. Visit the Patient Portal at <http://localhost:3000/patient-portal> and lay the role of the patient.
    - 12c. Login to the Patient Portal, use **JonSnow** for the username and **jon** for the password.
    - 12d. Select the saved Questionnaire and fill out the rest of the questionnaire as well as the patient signature in
      the questionnaire and hit **Save to EHR** again.
    - 12e. Go back to the EHR UI at <http://localhost:3000> and select the latest saved questionnaire from the second
      dropdown next to Jon Snow's name and continue in the role of the prescriber.
    - 12f. Click **Relaunch DTR** and fill out the remainder of the questionnaire, including the prescriber signature,
      then click **Submit REMS Bundle**.
13. A new UI will appear with REMS Admin Status and Pharmacy Status.
14. Go to <http://localhost:5050> and play the role of a pharmacist.
15. Click **Doctor Orders** in the top hand navigation menu on the screen
16. See the Doctor Order that was sent to the pharmacist from the prescriber and use the **Verify ETASU** button to get
    a status update of the REMS requirements submitted
17. Go Back to the EHR UI at <http://localhost:3000> and play the role of the prescriber again, select patient Jon Snow
    from the patient select UI and click **Launch SMART on FHIR App**, which will open the SMART on FHIR App in its own
    view and demonstrate the case where an EHR does not have CDS Hooks implemented natively.
18. From the medications dropdown select **Turalio 200 MG Oral Capsule**, which should populate the screen with cards
    similar to those seen in step 7.
19. Use the **Check ETASU** and **Check Pharmacy** buttons to get status updates on the prescription and REMS request
20. Use the links for the **Prescriber Enrollment Form** and **Prescriber Knowledge Assessment** Questionnaires and
    repeat steps 9-12 to submit those ETASU requirements and see how the ETASU status changes in both the Pharmacist UI
    and Prescriber UI.
21. Once all the REMS ETASU are met, go back to <http://localhost:5050> and play the role of the Pharmacist, using the
    **Verify Order** button to move the prescription over to the **Verified Orders** Tab. Click on the **Verified
    Orders** Tab and from there use the **Mark as Picked Up** button to move the prescription over to the **Picked Up
    Orders** Tab.
22. Go back to the SMART on FHIR App launched in step 17 and play the role of the prescriber using the **Check
    Pharmacy** button to see the status change of the prescription.
23. Lastly, repeat step 20 to open the **Patient Status Update Form** in the returned cards to submit follow
    up/monitoring requests on an as need basis. These forms can be submitted as many times as need be in the prototype
    and will show up as separate ETASU elements each time.

Congratulations! the REMS prototype is fully installed and ready for you to use!

## Running with SSL

See the documentation [here](SSLSetupGuide.md).
