// Create Databases
const dbPims = db.getSiblingDB('pims');
const dbRemsAdmin = db.getSiblingDB('remsadmin');
const dbRemsIntermediary = db.getSiblingDB('remsintermediary');

dbRemsAdmin.createUser({ user: "rems-user",
  pwd: "pass",
  roles: [
    { role: "readWrite", db: "remsadmin" } 
  ]
})

dbRemsIntermediary.createUser({ user: "intermediary-user",
  pwd: "pass",
  roles: [
    { role: "readWrite", db: "remsintermediary" } 
  ]
})

// Create Collections
dbPims.createCollection('pims-tmp');
dbRemsAdmin.createCollection('remsadmin-tmp');
dbRemsIntermediary.createCollection('remsintermediary-tmp');

// add the administrator user
const dbAdmin = db.getSiblingDB('admin');
dbAdmin.createUser({ user: "rems-admin-pims-root",
    pwd: "rems-admin-pims-password",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" }
    ]
})

dbAdmin.createUser({ user: "intermediary-admin-pims-root",
    pwd: "intermediary-admin-pims-password",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" }
    ]
})


// // Insert document to ensure db/collection is created
// dbPims.pimscollection.insertOne({name: 'Hello World!'})
// dbRemsAdmin.remsadmincollection.insertOne({name: 'Hello World Again!'})
