const fs = require('fs')
const firebaseAdmin = require("firebase-admin")

main()

async function main() {
  let db = await initFirebase()
  let collections = await getCollections(db)

  let data = {}

  for(let collection of collections) {
    let collectionData = await getCollectionData(db, collection.id)
    data[collection.id] = collectionData
  }

  // write
  fs.writeFile('data.json', JSON.stringify(data), () => {
    console.log('Data written')
  })
}


async function initFirebase() {
  return new Promise((resolve, reject) => {

    let serviceAccount = require("./databaseCredentials.json")

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: serviceAccount.project_id
    })
    
    db = firebaseAdmin.firestore()
    console.log('Database Initialized')
    resolve(db)
  })
}

async function getCollections(db) {
  return new Promise((resolve, reject) => {
    db.getCollections().then(collections => {
      resolve(collections)
    })
  })
}

async function getCollectionData(db, collectionID) {
  return new Promise((resolve, reject) => {
    db.collection(collectionID).get().then((querySnapshot) => {
      let data = {}
      querySnapshot.forEach((doc) => {
        let docData = doc.data() 
        data[doc.id] = docData
      })

      resolve(data)
    })
  })

}
