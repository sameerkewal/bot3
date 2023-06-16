const fs = require('fs');
const cheerio = require('cheerio')
const {getMoreTokens} = require("./firebase");
const puppeteer = require("puppeteer");
const {devices} = require("puppeteer");


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
            console.log(lyricsContainer);
            lyricsContainer.find('br').replaceWith('\n');
            const lyrics = lyricsContainer.text().trim()
            return lyrics;
        }

    }
async function puppetteerMethod(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    await page.setViewport({width:1366, height:768});



    const httpResponse = await page.goto('https://genius.com/Lana-del-rey-a-w-lyrics',
        {
            waitUntil: 'domcontentloaded'
        });



    const htmlContent = await page.content();
    fs.writeFileSync('page.html', htmlContent);



    const element = await page.$$('.Lyrics__Container-sc-1ynbvzw-5.Dzxov');
    console.log(element)

    element.forEach((async element => {
        const html = await page.evaluate(el => el.textContent, element)
        html.find('br').replaceWith('\n');
        console.log(html);
    }))

    //todo: make this similair to the cheerio method



    await page.screenshot({path: './screenshot.png'})

    await browser.close();

}

exports.getSongOnGenius = getSongOnGenius;
exports.getGeniusToken = getGeniusToken;
exports.getSong = getSong;
exports.getActualLyrics = getActualLyrics;
exports.puppetteerMethod=puppetteerMethod;

