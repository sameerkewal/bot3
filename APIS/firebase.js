const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDocs, getDoc,
        addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot} =
    require('firebase/firestore')

const {getAuth, signInWithEmailAndPassword, signOut} = require('firebase/auth')





// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

//init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()


//collection ref






const docRef = doc(db, 'usernames', 'EdIug7Nh8aH8c2QTklYX')






async function deleteTokens(){
/*    await test()*/
    const colRef = collection(db, 'tokens');
   const querySnapshot = await  getDocs(colRef)
    querySnapshot.forEach((doc)=>{
        deleteDoc(doc.ref)
    })

}


async function addTokens(accessToken, refreshToken){
    await deleteTokens()
    const colRef = collection(db, 'tokens');

   const documentReference = await addDoc(colRef, {
       access_token: accessToken,
       refresh_token: refreshToken
   })
   const added = getDoc(documentReference)
   /* console.log(`inserted: ${JSON.stringify((await added).data())}`)*/
}

async function getTokens(){
    const array=[]
    const colRef = collection(db, 'tokens');
    const records = await getDocs(colRef)

    records.forEach((record)=>{
       array.push(record.data())
    })


    return {access_token: array[0].access_token, refresh_token:array[0].refresh_token};
}


async function getMoreTokens(){
    await test()
    const data =[]
    const colref = collection(db, 'moreTokens');
    const records = await getDocs(colref);

    records.forEach((record)=>{
       data.push(record.data())
    })

  /* console.log({discord_token: data[0].discord_token, genius_access_token:data[0].genius_access_token})*/
    return {discord_token: data[0].discord_token, genius_access_token:data[0].genius_access_token};
}




async function signIn(){
    const auth = getAuth()

    try {
        const userCredential = await signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
        return userCredential.user.uid
    }catch(error){
        console.log(error)
        throw error
    }

}

async function realTimeUsernames(){
    const colRef = collection(db, 'usernames')
    onSnapshot(colRef, (snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            console.log('data changed!')
            console.log(doc.data())
        })
    })

}

async function oneTimeUsernames(){
    console.log('retrieving usernames')
    const colRef = collection(db, 'usernames')
getDocs(colRef).
    then((snapshot)=>{
        let usernames = [];

        snapshot.docs.forEach((doc)=>{
            console.log(doc.data())

                usernames.push({...doc.data(), id:doc.id})
        })

    console.log(usernames)
}).catch(err=>{
    console.log(err.message)
})
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function test(){
    await signIn();
    await wait(2000)
}

async function getRegisteredUserInfo(discordUserId){
    const userId = await signIn()
    const colref = collection(db, 'storage');
    const q = query(colref, where("discordId", "==", discordUserId));
    const querySnapshot = await getDocs(q);


    return new Promise((resolve, reject)=>{
        onSnapshot(q, (snapshot)=>{
            if(!snapshot.empty){
                resolve({data: snapshot.docs[0].data(), id: snapshot.docs[0].id})
            } else {
                resolve (null);
            }
        },(error) =>{
            reject(error)
            }

        )
    })


}



async function updateAllTokensInFirebase(ref, spotifyAccessToken, spotifyRefreshToken, discordAccessToken, discordRefreshToken){
    const refToUpdate = doc(db, 'storage', ref);
    try{
        const updatedDoc = await updateDoc(refToUpdate, {
            spotifyAccessToken: spotifyAccessToken,
            spotifyRefreshToken: spotifyRefreshToken,
            discordAccessToken: discordAccessToken,
            discordRefreshToken: discordRefreshToken
        })
        console.log(`document ${refToUpdate.id} updated with new values!`)
    }catch (e) {
        console.log(e)
    }
}




exports.addTokens = addTokens;
exports.getTokens = getTokens;
exports.getMoreTokens = getMoreTokens;
exports.getRegisteredUserInfo = getRegisteredUserInfo;
exports.updateAllTokensInFirebase = updateAllTokensInFirebase;
exports.wait=wait



