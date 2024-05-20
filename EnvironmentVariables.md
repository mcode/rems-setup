# Repositories and environment variables

## Repositories that define environment variables (via `.env` or Docker Compose `environment`)

<!-- cSpell: off -->

- mcode/rems-setup

  - .env
    - `VSAC_API_KEY`
    - `COMPOSE_PROJECT_NAME`
  - docker-compose.yml, docker-compose-dev.yml, docker-compose-local-build.yml
    - keycloak
      - `KEYCLOAK_ADMIN`
      - `KEYCLOAK_ADMIN_PASSWORD`
      - `DB_VENDOR`
    - test-ehr
      - `oauth_token`
    - request-generator
      - `VITE_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - rems-administrator
      - `MONGO_URL`
    - pims_remsadmin_mongo
      - `MONGO_INITDB_ROOT_USERNAME`
      - `MONGO_INITDB_ROOT_PASSWORD`
    - pims
      - `MONGO_URL`

- mcode/rems-admin

  - .env
    - `AUTH_SERVER_URI`
    - `HTTPS_CERT_PATH`
    - `HTTPS_KEY_PATH`
    - `LOGGING_LEVEL`
    - `MONGO_DB_NAME`
    - `MONGO_URL`
    - `PORT`
    - `RESOURCE_SERVER`
    - `SMART_ENDPOINT`
    - `USE_HTTPS`
    - `VSAC_API_KEY`
    - `WHITELIST`

- mcode/rems-smart-on-fhir

  - .env
    - `BROWSER`
    - `GENERATE_SOURCEMAP`
    - `PORT`
    - `REACT_APP_CLIENT_ID`
    - `REACT_APP_DEFAULT_ISS`
    - `REACT_APP_CLIENT_SCOPES`
    - `REACT_APP_DEVELOPER_MODE`
    - `REACT_APP_ETASU_STATUS_ENABLED`
    - `REACT_APP_PHARMACY_SERVER_BASE`
    - `REACT_APP_PHARMACY_STATUS_ENABLED`
    - `REACT_APP_REMS_ADMIN_SERVER_BASE`
    - `REACT_APP_REMS_HOOKS_PATH`
    - `REACT_APP_SEND_FHIR_AUTH_ENABLED`

- mcode/test-ehr

  - src/main/resources/application.yml
    - `auth_base`
    - `ehr_base`
    - `client_id`
    - `client_secret`
    - `realm`
    - `use_oauth`
    - `oauth_token`
    - `oauth_authorize`
    - `proxy_authorize`
    - `proxy_token`
    - `redirect_post_launch`
    - `redirect_post_token`
    - `introspection_url`
    - `redirect_base`

- mcode/request-generator

  - .env
    - `HTTPS`
    - `HTTPS_CERT_PATH`
    - `HTTPS_KEY_PATH`
    - `VITE_ALT_DRUG`
    - `VITE_AUTH`
    - `VITE_CDS_SERVICE`
    - `VITE_CLIENT`
    - `VITE_CLIENT_SCOPES`
    - `VITE_DEFAULT_USER`
    - `VITE_EHR_BASE`
    - `VITE_EHR_LINK`
    - `VITE_EHR_SERVER`
    - `VITE_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - `VITE_GENERATE_JWT`
    - `VITE_GH_PAGES`
    - `VITE_HOMEPAGE`
    - `VITE_LAUNCH_URL`
    - `VITE_PASSWORD`
    - `VITE_PATIENT_FHIR_QUERY`
    - `VITE_PIMS_SERVER`
    - `VITE_PUBLIC_KEYS`
    - `VITE_REALM`
    - `VITE_RESPONSE_EXPIRATION_DAYS`
    - `VITE_SERVER`
    - `VITE_SMART_LAUNCH_URL`
    - `VITE_URL`
    - `VITE_URL_FILTER`
    - `VITE_USER`

- mcode/pims
  - backend/env.json
    - `ALLOWED_ORIGIN`
    - `AUTH_SOURCE`
    - `BACKEND_PORT`
    - `EHR_RXFILL_URL`
    - `HTTPS_CERT_PATH`
    - `HTTPS_KEY_PATH`
    - `MONGO_PASSWORD`
    - `MONGO_URL`
    - `MONGO_USERNAME`
    - `USE_HTTPS`
  - frontend/.env
    - `PORT`
    - `REACT_APP_PIMS_BACKEND_PORT`
  - pm2.config.js
    - `NODE_ENV`

## Repositories that use environment variables

- mcode/rems-setup

  - docker-compose-dev.yml
    - rems-administrator
      - `VSAC_API_KEY`
  - docker-compose.yml
    - rems-administrator
      - `VSAC_API_KEY`
  - playwright.config.ts
    - `CI`

- mcode/rems-admin

  - src/config.ts
    - `AUTH_SERVER_URI`
    - `LOGGING_LEVEL`
    - `MONGO_DB_NAME`
    - `MONGO_URL`
    - `PORT`
    - `RESOURCE_SERVER`
    - `SERVER_PORT`
    - `SMART_ENDPOINT`
    - `VSAC_API_KEY`
    - `WHITELIST`
  - src/server.ts
    - `HTTPS_CERT_PATH`
    - `HTTPS_KEY_PATH`
    - `USE_HTTPS`

- mcode/test-ehr

  - src/main/java/ca/uhn/fhir/jpa/starter/EnvironmentHelper.java
    - `elasticsearch.required_index_status`
    - `elasticsearch.schema_management_strategy`
    - `elasticsearch.debug.refresh_after_write`
    - `elasticsearch.debug.pretty_print_json_log`
    - `elasticsearch.rest_url`
    - `elasticsearch.protocol`
    - `elasticsearch.username`
    - `elasticsearch.password`
    - `elasticsearch.enabled`
    - `elasticsearch.enabled`
  - src/main/java/org/hl7/davinci/ehrserver/ClientAuthorizationInterceptor.java
    - `use_oauth`
    - `client_secret`
    - `client_id`
    - `introspect_url`
  - src/main/java/org/hl7/davinci/ehrserver/authproxy/AuthProxy.java
    - `oauth_authorize`
    - `oauth_token`
    - `redirect_base`

- mcode/request-generator

  - src/registerServiceWorker.js
    - `NODE_ENV`
    - `PUBLIC_URL`
  - src/util/data.js
    - `VITE_ALT_DRUG`
    - `VITE_CDS_SERVICE`
    - `VITE_CLIENT`
    - `VITE_CLIENT_SCOPES`
    - `VITE_DEFAULT_USER`
    - `VITE_EHR_BASE`
    - `VITE_EHR_SERVER`
    - `VITE_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - `VITE_GENERATE_JWT`
    - `VITE_LAUNCH_URL`
    - `VITE_PATIENT_FHIR_QUERY`
    - `VITE_PIMS_SERVER`
    - `VITE_RESPONSE_EXPIRATION_DAYS`
    - `VITE_CLIENT_SCOPES`
    - `VITE_SMART_LAUNCH_URL`
    - `VITE_URL_FILTER`
  - src/util/auth.js
    - `VITE_AUTH`
    - `VITE_CLIENT`
    - `VITE_PASSWORD`
    - `VITE_PUBLIC_KEYS`
    - `VITE_REALM`
    - `VITE_USER`
  - src/components/SMARTBox/EHRLaunchBox.js
    - `VITE_EHR_LINK`
  - src/components/App.js
    - `VITE_GH_PAGES`
  - src/components/Auth/Login.jsx
    - `VITE_AUTH`
    - `VITE_CLIENT`
    - `VITE_REALM`
  - src/components/Dashboard/DashboardElement.jsx
    - `VITE_LAUNCH_URL`
  - src/containers/Launch.jsx
    - `VITE_CLIENT`
    - `VITE_EHR_BASE`
  - src/containers/PatientPortal.jsx
    - `VITE_EHR_BASE`

- mcode/pims

  - backend/src/server.ts
    - `ALLOWED_ORIGIN`
    - `AUTH_SOURCE`
    - `BACKEND_PORT`
    - `HTTPS_CERT_PATH`
    - `HTTPS_KEY_PATH`
    - `MONGO_PASSWORD`
    - `MONGO_USERNAME`
    - `USE_HTTPS`
  - backend/src/routes/doctorOrders.js
    - `EHR_RXFILL_URL`
  - backend/src/database/data.js
    - `REMS_ADMIN_FHIR_URL`
  - frontend/src/App.tsx
    - `REACT_APP_PIMS_BACKEND_PORT`
    - `REACT_APP_PIMS_BACKEND_URL`

- mcode/rems-smart-on-fhir
  - src/views/Patient/MedReqDropDown/MedReqDropDown.tsx
    - `REACT_APP_ETASU_STATUS_ENABLED`
    - `REACT_APP_PHARMACY_STATUS_ENABLED`
    - `REACT_APP_SEND_FHIR_AUTH_ENABLED`
  - src/views/Patient/MedReqDropDown/rxSend/rxSend.ts
    - `REACT_APP_PHARMACY_SERVER_BASE`
  - src/views/Patient/MedReqDropDown/pharmacyStatus/PharmacyStatus.tsx
    - `REACT_APP_REMS_ADMIN_SERVER_BASE`
  - src/views/Patient/PatientView.tsx
    - `REACT_APP_REMS_ADMIN_SERVER_BASE`
    - `REACT_APP_REMS_HOOKS_PATH`
  - src/views/Smart/Launch.tsx
    - `REACT_APP_CLIENT_SCOPES`
    - `REACT_APP_DEFAULT_CLIENT_ID`
    - `REACT_APP_DEFAULT_ISS`
  - src/views/Questionnaire/SmartApp.tsx
    - `REACT_APP_DEVELOPER_MODE`
  - src/views/Questionnaire/elm/buildPopulatedResourceBundle.ts
    - `REACT_APP_EPIC_SUPPORTED_QUERIES`
