// Create Databases
const dbPims = db.getSiblingDB('pims');
const dbRemsAdmin = db.getSiblingDB('remsadmin');

if (dbRemsAdmin.getUser("rems-user") == null) {  
    dbRemsAdmin.createUser({ user: "rems-user",
    pwd: "pass",
    roles: [{ role: "readWrite", db: "remsadmin" }]
  })
}

// add the administrator user
const dbAdmin = db.getSiblingDB('admin');

if (dbAdmin.getUser("rems-admin-pims-root") == null) {  
    dbAdmin.createUser({ user: "rems-admin-pims-root",
    pwd: "rems-admin-pims-password",
    roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
  })
}
