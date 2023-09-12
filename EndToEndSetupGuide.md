# Local Developer Setup Guide (No Docker)
>Follow this guide if you would like to start each application locally **without** using Docker. Each must be launched in a sperate terminal window.

## Prerequisites
- Java, gradle
	- test-ehr
- node
	- rems-admin, pims, rems-smart-on-fhir, request-generator
- git
	- On Windows 'Git Bash' was used for the command line interface

## Installation Order
1. Clone each Repo
2. Start Utility Applications
3. Start Test and Core Applications

## Clone Repos
1. Create a root directory for the REMS development work (we will call this `<rems-root>` for the remainder of this setup
   guide). While this step is not required, having a common root for the REMS Integration Prototype components will make things a lot easier
   down the line.

   ```bash
   mkdir <REMSroot>
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

   # Update the Submodules
   cd rems-admin
   git submodule update --init

   cd ..

   cd rems-smart-on-fhir
   git submodule update --init
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
		./bin/mongosh mongodb://localhost:27017 <REMS_PATH>/mongo-init.js
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

- Navigate into directory already cloned from GitHub [www.github.com/mcode/test-ehr](https://www.github.com/mcode/test-ehr)
	```bash
	cd test-ehr
	
	# Run
	gradle bootRun
	```
	
	```bash
	# Load Data (in separate window, also in repo folder)
	gradle loadData
	```

### request-generator

- Navigate into directory already cloned from GitHub [www.github.com/mcode/request-generator](https://www.github.com/mcode/request-generator)
	```bash
	cd request-generator

	# Setup
	npm install

	# Run
	npm start
	```

## Core Applications

### rems-admin
- Navigate into directory already cloned from GitHub [www.github.com/mcode/rems-admin](https://www.github.com/mcode/rems-admin)
- Update env.json
	- Add your VSAC key to env.json as the default value for `VSAC_API_KEY`
	```bash
	cd rems-admin
	
	# Submodule Initialization
	git submodule update --init
	
	# Setup
	`npm install`

	# Run
	npm start
	```

### pims
- Navigate into directory already cloned from GitHub [www.github.com/mcode/pims](https://www.github.com/mcode/pims)
	```bash 
	cd pims
	```
	
	Backend
	```bash 
	# Navigate to the backend directory
	cd backend

	# Setup
	npm install

	#Run
	npm start
	```
		
	Frontend
	```bash 
	# Navigate to the frontend directory
	cd frontend
	
	# Setup
	npm install

	# Run
	PORT=5050 npm start
	```

### rems-smart-on-fhir
- Navigate into directory already cloned from GitHub [https://www.github.com/mcode/rems-smart-on-fhir](https://www.github.com/mcode/rems-smart-on-fhir)
	```bash 
	# Navigate into directory already cloned from GitHub
	cd rems-smart-on-fhir

	# Submodule Initialization
	git submodule update --init

	# Setup
	npm install

	# Run
	PORT=4040 npm start
	```