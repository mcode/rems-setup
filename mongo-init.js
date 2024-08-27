// Create Databases
const dbPims = db.getSiblingDB('pims');
const dbRemsAdmin = db.getSiblingDB('remsadmin');
const dbRemsAdmin2 = db.getSiblingDB('remsadmin2');

const dbRemsIntermediary = db.getSiblingDB('remsintermediary');

dbRemsAdmin.createUser({ user: "rems-user",
  pwd: "pass",
  roles: [
    { role: "readWrite", db: "remsadmin" } 
  ]
})

dbRemsAdmin2.createUser({ user: "rems-user2",
  pwd: "pass",
  roles: [
    { role: "readWrite", db: "remsadmin2" } 
  ]
})

dbRemsIntermediary.createUser({ user: "intermediary-user",
  pwd: "pass",
  roles: [
    { role: "readWrite", db: "remsintermediary" } 
  ]
})

dbPims.createUser({ user: "pims-user",
  pwd: "pims-pass",
  roles: [
    { role: "readWrite", db: "pims" } 
  ]
})


// Create Collections
dbPims.createCollection('pims-tmp');
dbRemsAdmin.createCollection('remsadmin-tmp');
dbRemsAdmin2.createCollection('remsadmin2-tmp');
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
