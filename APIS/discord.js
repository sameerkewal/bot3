const querystring = require('querystring')
require('dotenv').config();
const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDocs, getDoc,
    addDoc, deleteDoc, doc, query, where, onSnapshot} =
    require('firebase/firestore')
const {getRegisteredUserInfo, updateDiscordTokens, updateSpotifyTokens, updateAllTokensInFirebase} = require("./firebase");
const {getNewAccessToken} = require("./getCurrentSong");

async function refreshDiscToken(discordRefreshToken) {

    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const tokenParams = querystring.stringify({

        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: discordRefreshToken
    })

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams
    })

    const data = await response.json()
   const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token;

    return {newAccessToken, newRefreshToken};



}



async function refreshAllTokensFinal(userId){
    let newSpotifyToken;
    let errorResponse;

    try {
        const {data, id} = await getRegisteredUserInfo(userId);
        const {access_token, refresh_token} = await getNewAccessToken(data.spotifyRefreshToken);
        newSpotifyToken = access_token;


        const {newAccessToken, newRefreshToken} = await refreshDiscToken(data.discordRefreshToken);
        await updateAllTokensInFirebase(id, newSpotifyToken, refresh_token, newAccessToken, newRefreshToken);

    } catch(Error){
        console.log('error message: ' + Error)
            if(Error.toString().includes("null")){
               errorResponse = {
                   "message": "You Have not registered. Please register at https://testing-7c5bf.web.app to be able to use this command"
               }
            }


    }

    return {newSpotifyToken, errorResponse};


}

exports.refreshAllTokensFinal = refreshAllTokensFinal;
exports.refreshDiscToken = refreshDiscToken;


