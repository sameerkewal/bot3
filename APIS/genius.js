const fs = require('fs');
const cheerio = require('cheerio')
const {getMoreTokens} = require("./firebase");


async function getSongOnGenius(information){
    const {songName, artistName, albumName, releaseDate} = information;

    const newurl = `https://api.genius.com/search?q=${encodeURIComponent(songName)}%20${encodeURIComponent(artistName)}`
  /*  console.log(newurl)*/
    const results = await fetch(newurl,{
        headers: {
            'Authorization': `Bearer ${((await getMoreTokens()).genius_access_token)}`
        }
    })
    const data = await results.json()
    const allHits = data.response.hits
    const filteredArray = allHits.filter((hit)=>{
        return hit.result.language === 'en';

    })

    return filteredArray[0].result.id;
}

async function getGeniusToken(){
    const code='DMlxViudFNUbNyFvrE_3tfWf_dNrokeISU5ObCyFORxXQQ9vcPEmsdhRwBMEZQF6';
    const response = await fetch(`https://api.genius.com/oauth/token`,
        {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'code': code,
                client_id: process.env.GENIUS_CLIENT_ID,
                client_secret: process.env.GENIUS_CLIENT_SECRET,
                redirect_uri:`https://localhost:5371`,
                response_type: 'code',
                grant_type: 'authorization_code'
            })
        });
    const data = await response.json()
    return data.access_token;

}

async function getSong(id){
    const results = await fetch(`https://api.genius.com/songs/${id}`,{
        headers:
            {
                Authorization: `Bearer ${(await getMoreTokens()).genius_access_token}`
            }
    });
    const data = await results.json();
    return data.response.song.url
}


    async function getActualLyrics(url){
       const website = await fetch(url)
        if(website.ok){
            const html = await website.text();
            const $ =  cheerio.load(html)
            const lyricsContainer = $('.Lyrics__Container-sc-1ynbvzw-5.Dzxov')
            lyricsContainer.find('br').replaceWith('\n');
            const lyrics = lyricsContainer.text().trim()
            return lyrics;
        }

    }


exports.getSongOnGenius = getSongOnGenius;
exports.getGeniusToken = getGeniusToken;
exports.getSong = getSong;
exports.getActualLyrics = getActualLyrics;

