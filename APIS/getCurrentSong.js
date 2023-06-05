const {response, json} = require("express");
const {formatDate, mapData} = require("../utils/Builder");
const fs = require("fs");

async function getNewAccessToken(passedRefreshToken= process.env.REFRESH_TOKEN){
    const params = new URLSearchParams();

    const clientId =    process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = passedRefreshToken
    params.append('grant_type', 'refresh_token');

    params.append('refresh_token', refreshToken);

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: "POST",
        headers:{
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    });
    if(!response.ok){
        const errorData = await response.json()
        console.log(errorData.error_description);
    }
    const {access_token, refresh_token} = await response.json();
    return {access_token, refresh_token};

}





async function getRecentlyPlayed(passedAccessToken){
    let response = await fetch(`
https://api.spotify.com/v1/me/player/recently-played`, {
        headers:{
            'Authorization': `Bearer ${passedAccessToken}`
        }
    })
    let data = await response.json();
    const albumCover = data.items[0].track.album.images[0]
    const played_at = data.items[0].played_at
    data = data.items[0].track;
     const uri = data.external_urls.spotify

    return {albumName: data.album.name, songName: data.name, uri:uri, played_at:played_at, albumCover: albumCover};
}

async function getRecentlyTenPlayed(passedAccessToken){
    let response = await fetch(`
https://api.spotify.com/v1/me/player/recently-played?limit=25`, {
        headers:{
            'Authorization': `Bearer ${passedAccessToken}`
        }
    })

    let data = await response.json();

   let mappedData= await mapData(data.items)
   return mappedData
}





async function getTopTracks(passedAccessToken, offset=0, term='short_term') {

    const results = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${term}&offset=${offset}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${passedAccessToken}`
        }
    });
    const data = await results.json();
    const total = data.total
    return {data, total}


}

    async function getAllTopTracks(passedAccessToken, term) {
        let offset = 0
        let allTracks = [];
        let trackLimit = 50;
        const {data, total} = await getTopTracks(passedAccessToken, 0, term);
        allTracks = allTracks.concat(data.items)
        while (allTracks.length < total) {
            offset = offset + trackLimit;
            const {data} = await getTopTracks(passedAccessToken, offset, term);
            allTracks = allTracks.concat(data.items);

        }
        return allTracks;
    }

    async function getArtistGenres(id, passedAccessToken) {
        const results = await fetch(`https://api.spotify.com/v1/artists/${id}?market=US`, {
            headers: {
                'Authorization': `Bearer ${passedAccessToken}`
            }
        });
        const data = await results.json();
        return data.genres;
    }

    async function getTopArtists(passedAccessToken, offset = 0, term='long_term') {
        const results = await fetch(`
https://api.spotify.com/v1/me/top/artists?time_range=${term}&offset=${offset}&limit=50`, {
            headers: {
                'Authorization': `Bearer ${passedAccessToken}`
            }
        });
        const data = await results.json();

        const total = data.total
        return {data, total}
    }

    async function getAllTopArtistsAndTheirGenres(passedAccessToken, term) {
        const topGenres = [];
        let offset = 0
        let allTopArtists = [];
        let trackLimit = 50;

        const {data, total} = await getTopArtists(passedAccessToken, 0, term);
        allTopArtists = allTopArtists.concat(data.items)
        while (allTopArtists.length < total) {
            offset = offset + trackLimit;
            const {data} = await getTopArtists(passedAccessToken, offset, term);
            allTopArtists = allTopArtists.concat(data.items);

        }
        allTopArtists.forEach((topArtist) => {
            topGenres.push(topArtist.genres)
        })

        return topGenres;

    }






async function searchFunction(query, passedAccessToken){
    const {songName, artistName, yearRange, genre} = query
    let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}`;

    if(artistName){
       url = url +`%20artist:${artistName}`
    }

    if(yearRange){
        url = url + `%20year:${yearRange}`
    }
    if(genre){
        url = url + `%20genre:${genre}`
    }

    url=url+ `&type=track&market=US`;
    const response = await fetch(url,{
        headers:{
            'Authorization': `Bearer ${passedAccessToken}`
        }
    })

    const data = await response.json();

    return data;

}


async function addToPlaylist(uri, passedAccessToken){
    const result = await fetch(`https://api.spotify.com/v1/playlists/4x9FQLmgqIe2mKzlxsNVZt/tracks`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${passedAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({uris:uri})
        });
            if(result.status===201){
                return 'Track added!'
            } else {
                return `'An error occurred:', ${await result.text()}`
            }


}











    exports.getRecentlyPlayed = getRecentlyPlayed
    exports.getRecentlyTenPlayed = getRecentlyTenPlayed
    exports.getNewAccessToken = getNewAccessToken
    exports.getAllTopTracks = getAllTopTracks;
    exports.getTopTracks = getTopTracks;
    exports.getTopArtists = getTopArtists;
    exports.getArtistGenres = getArtistGenres
    exports.getAllTopArtistsAndTheirGenres = getAllTopArtistsAndTheirGenres;
    exports.searchFunction = searchFunction;
    exports.addToPlaylist = addToPlaylist;

