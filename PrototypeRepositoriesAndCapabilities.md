# Prototype Repositories and Capabilities

## (As of April 27, 2023. Prototype version 0.9)

![](./prototype-images/layout.png)

(Note: <a>Numbers</a> correspond to the numbers in the diagram above)

## Repositories

- > mcode/REMS
    * REMS Administrator <a>(4)</a>
        + Node/TypeScript
        + <a>(1.1)(3)</a> CDS Hooks (server) end points
        + <a>(1.4)</a> FHIR Server to support DTR
            + Contains Questionnaire, Library (w/ CQL), ValueSets
            + Retrieves and caches ValueSets from VSAC
        + <a>(5)</a> Interface to check status of REMS
        + Stores data in MongoDB
    * Docker scripts to launch the entire stack

- > mcode/test-ehr
    * Test EHR <a>(2)</a>
        + Java HAPI FHIR Server
        + Contains test patient data
        + Supports launching DTR SMART on FHIR app

<br>
- >mcode/crd-request-generator
    * Request Generator <a>(2)</a>
        + Node/JavaScript
        + Web Application mimicking the EHR frontend
        + Requests
            + <a>(1.1)(3)</a> Generates CDS Hooks order-sign (client) that is sent to the REMS Admin
            + <a>(1.2)(3)</a> Handles CARDS returned from REMS Admin to launch DTR
            + Sends Rx to PIMS using NCPDP Script NewRx

- mcode/pims
    * Pharmacy Information System <a>(6)</a>
        + Node/TypeScript
        + Receives Rx from Request Generator
        + <a>(5)</a> Provides interface to monitor status of REMS
        + Allows pharmacist to mark Rx as dispensed
        + Provides interface for querying status of Rx
            + Non-standard, created for demo purposes only
    * Stores data in MongoDB

- mcode/rems-smart-on-fhir
    * REMS SMART on FHIR Application
        + SMART on FHIR application to generate CDS Hooks interaction with REMS Admin for any EHR that does not support CDS Hooks
            + Node/TypeScript

- ### mcode/rems-cds-hooks
    * Git submodule used by REMS SMART on FHIR Application and REMS Admin
        + TypeScript
        + Prefetch implementation
        + Type definitions for CDS Hooks needed by TypeScript

## Other Components

- KeyCloak
    * Authentication of users
    * Docker config hosted in mcode/test-ehr

- MongoDB
    * Stores data for REMS Admin and PIMS in separate databases
    * Docker config hosted and stored in mcode/REMS
