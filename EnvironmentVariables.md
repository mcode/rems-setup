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
      - `REACT_APP_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - rems-administrator
      - `MONGO_URL`
    - pims_remsadmin_mongo
      - `MONGO_INITDB_ROOT_USERNAME`
      - `MONGO_INITDB_ROOT_PASSWORD`
    - pims
      - `REMS_ADMIN_BASE`
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
    - `REACT_APP_ALT_DRUG`
    - `REACT_APP_AUTH`
    - `REACT_APP_CDS_SERVICE`
    - `REACT_APP_CLIENT`
    - `REACT_APP_CLIENT_SCOPES`
    - `REACT_APP_DEFAULT_USER`
    - `REACT_APP_EHR_BASE`
    - `REACT_APP_EHR_LINK`
    - `REACT_APP_EHR_SERVER`
    - `REACT_APP_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - `REACT_APP_GENERATE_JWT`
    - `REACT_APP_GH_PAGES`
    - `REACT_APP_HOMEPAGE`
    - `REACT_APP_LAUNCH_URL`
    - `REACT_APP_ORDER_SELECT`
    - `REACT_APP_ORDER_SIGN`
    - `REACT_APP_PASSWORD`
    - `REACT_APP_PATIENT_FHIR_QUERY`
    - `REACT_APP_PATIENT_VIEW`
    - `REACT_APP_PIMS_SERVER`
    - `REACT_APP_PUBLIC_KEYS`
    - `REACT_APP_REALM`
    - `REACT_APP_RESPONSE_EXPIRATION_DAYS`
    - `REACT_APP_SERVER`
    - `REACT_APP_SMART_LAUNCH_URL`
    - `REACT_APP_URL`
    - `REACT_APP_URL_FILTER`
    - `REACT_APP_USER`

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
    - `REMS_ADMIN_BASE`
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
  - src/containers/RequestBuilder.js
    - `REACT_APP_ALT_DRUG`
    - `REACT_APP_CDS_SERVICE`
    - `REACT_APP_CLIENT`
    - `REACT_APP_CLIENT_SCOPES`
    - `REACT_APP_DEFAULT_USER`
    - `REACT_APP_EHR_BASE`
    - `REACT_APP_EHR_SERVER`
    - `REACT_APP_EHR_SERVER_TO_BE_SENT_TO_REMS_ADMIN_FOR_PREFETCH`
    - `REACT_APP_GENERATE_JWT`
    - `REACT_APP_LAUNCH_URL`
    - `REACT_APP_ORDER_SELECT`
    - `REACT_APP_ORDER_SIGN`
    - `REACT_APP_PATIENT_FHIR_QUERY`
    - `REACT_APP_PATIENT_VIEW`
    - `REACT_APP_PIMS_SERVER`
    - `REACT_APP_RESPONSE_EXPIRATION_DAYS`
    - `REACT_APP_CLIENT_SCOPES`
    - `REACT_APP_SMART_LAUNCH_URL`
    - `REACT_APP_URL_FILTER`
  - src/util/auth.js
    - `REACT_APP_AUTH`
    - `REACT_APP_CLIENT`
    - `REACT_APP_PASSWORD`
    - `REACT_APP_PUBLIC_KEYS`
    - `REACT_APP_REALM`
    - `REACT_APP_USER`
  - src/components/SMARTBox/EHRLaunchBox.js
    - `REACT_APP_EHR_LINK`
  - src/components/App.js
    - `REACT_APP_GH_PAGES`
  - src/components/Auth/Login.jsx
    - `REACT_APP_AUTH`
    - `REACT_APP_CLIENT`
    - `REACT_APP_REALM`
  - src/components/Dashboard/DashboardElement.jsx
    - `REACT_APP_LAUNCH_URL`
  - src/containers/Launch.jsx
    - `REACT_APP_CLIENT`
    - `REACT_APP_EHR_BASE`
  - src/containers/PatientPortal.jsx
    - `REACT_APP_EHR_BASE`

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
    - `REMS_ADMIN_BASE`
    - `EHR_RXFILL_URL`
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
