# rems-setup

This repository contains all of the Docker, setup scripts, and documentation for running the entire **REMS Integration Prototype** environment. Use of this repository is recommended for users trying to set up the REMS environment for the first time. 

## REMS Integration Prototype

### Prototype Organization Overview

> For information on the project and how to get involved visit our [CodeX Confluence Page](https://confluence.hl7.org/display/COD/Risk+Evaluation+and+Mitigation+Strategies+%28REMS%29+Integration)

[Prototype Repositories and Capabilities](PrototypeRepositoriesAndCapabilities.md)

### Running the full prototype environment

Complete end-to-end set up guides for the REMS Proof of Concept prototype are listed below:

[Simple Set Up](SimpleSetupGuide.md) - Follow this guide to quickly setup a demo environment for local testing. If you want to make changes or contribute to the codebase, see the detailed developer guide below.

[Docker Developer Setup Guide](DeveloperSetupGuide.md) - Follow this guide to use [Docker](https://docs.docker.com/get-started/overview/) for running REMS Integration Prototype for Local Development.

[Local Developer Setup Guide (No Docker)](EndToEndSetupGuide.md) - Follow this guide to start each application locally **without** using Docker for development.

[HTTPS / SSL Setup Guide](SSLSetupGuide.md) - Follow this guide to launch each application in the prototype workflow with SSL enabled.

## Running end-to-end tests

We use Playwright for end-to-end testing, which automates running the full prototype environment.

1. Install dependencies: `npm install`
2. Run all tests: `npm playwright test` or with the `-ui` flag to view them in the Chromium browser.

## Sequence Diagram 

The following diagram outlines the interactions and communications between each of the components that make up the REMS prototype environment.

![SequenceDiagram (3)](https://github.com/mcode/rems-setup/assets/28585306/0fcbcba5-2ea1-4723-85e5-b3d58dcabe30)


