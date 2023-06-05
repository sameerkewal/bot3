let accessToken;
let refreshToken;
const fs = require('fs');
const dotenv = require('dotenv');

function setAccessToken(passedAccessToken){
    dotenv.config()
  /*  console.log(`set the refreshToken to ${passedAccessToken}`)*/
    process.env.ACCESS_TOKEN = passedAccessToken;

    const envConfig= Object.keys(process.env)
        .map(key=> `${key}=${process.env[key]}`).join('\n');
    fs.writeFileSync('.env', envConfig)
}

function getAccessToken(){
   /* console.log(`returning the following access token ${process.env.ACCESS_TOKEN}`);*/
    return process.env.ACCESS_TOKEN
}

function setRefreshToken(passedRefreshToken){
    dotenv.config()
  /*  console.log(`set the refreshToken to ${passedRefreshToken}`)*/
    process.env.REFRESH_TOKEN = passedRefreshToken;

    const envConfig= Object.keys(process.env)
        .map(key=> `${key}=${process.env[key]}`).join('\n');
    fs.writeFileSync('.env', envConfig)
}

function getRefreshToken(){
   /* console.log(`returning the following refresh token ${process.env.REFRESH_TOKEN}`)*/
    return process.env.REFRESH_TOKEN;
}





exports.setAccessToken = setAccessToken;
exports.getAccessToken = getAccessToken;
exports.setRefreshToken = setRefreshToken;
exports.getRefreshToken = getRefreshToken;