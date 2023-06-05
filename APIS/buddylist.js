const buddylist = require('spotify-buddylist');


async function main(){
    const spDcCookie = 'AQBLhoBdmVLzqRlZmQsH4MebOgFsgenhrPNKifsa1n1HLuSYj60V5aWNNpTEJduPG2OpsavX8MRoOrSwvZ-Cd0OPJnMZVsNOHeyVvuTjLCA-5VfzRyYUmeBcUf1iMpClpwtCEMjc2JSXUvUEmXAXKffx9_QNdYs';
    const {accessToken} = await buddylist.getWebAccessToken(spDcCookie);
    const friendActivity = await buddylist.getFriendActivity(accessToken);

    let friends = friendActivity.friends
  /*  console.log(friends)*/
    let filteredFriends = friends.filter((friend)=>{
        if(friend.user.name!=='Jasminedv'){
            return false
        }
        return true;
    });
        filteredFriends = filteredFriends[0]
    let uri = filteredFriends.track.uri.split(":");
    let timestamp = filteredFriends.timestamp;
    const date = new Date(timestamp);
    date.setHours(date.getHours()-3);
    const result = filteredFriends;

    return {date: date.toLocaleString(), userName: result.user.name, trackName: result.track.name, uri:uri[2]}
}

exports.main = main
