# Local Developer Setup Guide (No Docker)

Follow this guide if you would like to start each application locally **without** using Docker. Each must be launched in a separate terminal window.

## Table of Contents

- [Local Developer Setup Guide (No Docker)](#local-developer-setup-guide-no-docker)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Clone each repository](#clone-each-repository)
  - [Install nvm (Node Version Manager)](#install-nvm-node-version-manager)
  - [Utilities](#utilities)
    - [keycloak](#keycloak)
    - [mongodb](#mongodb)
  - [Test Applications](#test-applications)
    - [test-ehr](#test-ehr)
    - [request-generator](#request-generator)
  - [Core Applications](#core-applications)
    - [rems-admin](#rems-admin)
    - [pims](#pims)
    - [rems-smart-on-fhir](#rems-smart-on-fhir)
- [Verify the REMS Integration Prototype is working](#verify-the-rems-integration-prototype-is-working)

## Prerequisites

- Java, gradle
  - test-ehr
- Node
  - rems-admin, pims, rems-smart-on-fhir, request-generator
- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) (optional)
- git
  - On Windows 'Git Bash' was used for the command line interface

## Clone each repository

1. Create a root directory for the REMS development work (we will call this `<rems-root>` for the remainder of this setup
   guide). While this step is not required, having a common root for the REMS Integration Prototype components will make things a lot easier
   down the line.

   ```bash
   mkdir rems-root
   ```

   `rems-root` will be the base directory into which all the other components will be installed. For example, test-ehr will
   be cloned to `rems-root/test-ehr`.

   Note: If you are using a different project structure from the above description, you will need to change the
   corresponding repo paths in docker-compose-dev.yml, docker-sync.yml, and docker-compose.yml

2. Now clone the REMS Integration Prototype component repositories from GitHub:

   ```bash
   cd rems-root

   git clone https://github.com/mcode/test-ehr.git
   git clone https://github.com/mcode/request-generator.git
   git clone https://github.com/mcode/rems-admin.git
   git clone https://github.com/mcode/pims.git
   git clone https://github.com/mcode/rems-smart-on-fhir.git
   git clone https://github.com/mcode/rems-setup.git
   ```

## Install nvm (Node Version Manager)

- Using [nvm](https://github.com/nvm-sh/nvm) makes switching Node versions easier, especially when working with projects that use other Node versions on your system.

  ```bash
  nvm install 20 # example of a default version
  nvm install 21 # another option
  ```

## Utilities

### keycloak

- Setup and run KeyCloak

  - Download KeyCloak 22.0.1 from [www.github.com/keycloak/keycloak/releases/tag/22.0.1](https://github.com/keycloak/keycloak/releases/tag/22.0.1)

    ```bash
    # Extract the downloaded file
    tar -xvf keycloak-22.0.1.tar.gz # Mac & Linux
    unzip <package.zip # Windows

    # Navigate into directory
    cd keycloak-22.0.1

    # Start Keycloak
    KEYCLOAK_ADMIN=admin KEYCLOAK_ADMIN_PASSWORD=admin ./bin/kc.sh start-dev --http-port=8180 --import-realm --hostname=localhost

    # Place realm file in proper folder
    mkdir data/import

    cp <test-ehr_location>/src/main/resources/ClientFhirServerRealm.json data/import/
    ```

  - Log in as admin user (optional)
    - Launch the admin page in a web browser [localhost:8180/admin/](http://localhost:8180/admin/)
    - Select link for [Administration Console](http://localhost:8180/auth/admin/)
    - Log in as admin/admin

### mongodb

- Setup and Run MongoDB

  - Download the latest version for your OS from [www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

    ```bash
    # Extract the downloaded package
    tar -xvf <package.tgz> # Mac & Linux
    unzip <package.zip # Windows

    # Navigate into directory
    cd <package>

    # Create folder for database
    mkdir db

    # Run mongo
    ./bin/mongod --dbpath db
    ```

- Setup Mongo Shell `mongosh` to initialize the database

  - Download latest version for your OS from [www.mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell)

    ```bash
    # Extract the package
    tar -xvf <package.tgz> # Mac & Linux
    unzip <package.zip # Windows

    # Navigate into directory
    cd <package>

    # Initialize the database
    # NOTE: Database must already be running
    ./bin/mongosh mongodb://localhost:27017 <rems-root>/rems-setup/mongo-init.js
    ```

  - Alternate Install Instructions: [www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install)

- Restart mongo
  - Stop the application
  - Start as above
    ```bash
    ./bin/mongod --dbpath db
    ```
  - Applications should now be able to connect

## Test Applications

### test-ehr

- Terminal window 1

  ```bash
  # Navigate into directory already cloned from GitHub
  cd test-ehr

  # Run
  gradle bootRun
  ```

- Terminal window 2 (in the same directory)

  ```bash
  # Load Data
  gradle loadData
  ```

### request-generator

```bash
# Navigate into directory already cloned from GitHub
cd request-generator

# Install dependencies
npm install

# Start the application
npm start
```

## Core Applications

### rems-admin

```bash
# Navigate into directory already cloned from GitHub
cd rems-admin

# Create a .env.local and set the VSAC_API_KEY variable to your VSAC key.
echo "VSAC_API_KEY=<your VSAC API key>" > .env.local

# Initialize Git submodules (REMS CDS Hooks)
git submodule update --init

# Install dependencies
npm install

# Start the application
npm start
```

### pims

Terminal window 1: Backend

```bash
# Navigate to the backend directory
cd pims/backend

# Install dependencies
npm install

# Start the application
npm start
```

Terminal window 2: Frontend

```bash
# Navigate to the frontend directory
cd pims/backend

# Install dependencies
npm install

# Start the application
npm start
```

### rems-smart-on-fhir

```bash
# Navigate into directory already cloned from GitHub
cd rems-smart-on-fhir

# Initialize Git submodules (REMS CDS Hooks)
git submodule update --init

# Install dependencies
npm install

# Start the application
npm start
```

# Verify the REMS Integration Prototype is working

See [this guide](Verify-REMS-Integration-Prototype-Works.md) to generate a test request.
