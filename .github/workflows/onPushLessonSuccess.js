const fs = require('fs');
const Octokit = require("@octokit/rest");
const axios = require("axios");
const shell = require("shelljs");


// async function fetchLesson(kidocode, cHub, cube, username, branch, token) {
//     console.log("Getting first lesson name...");

//     try {
//         let octokit = new Octokit({
//             auth: "token " + token
//         });

//         // send pull request to bhub
//         await octokit.pull.create(
//             cHub, // owner
//             `${username}-${cube}-cube`, // repo
//             `${username}:${branch}`, // head
//             branch, // base
//             `Update lesson`, // title
//             'Please pull these awesome changes in!', // body
//             token
//         )

//         return {
//             result: true,
//             lesson: resp.data.split("\n").filter(Boolean)[idx] // JSON.parse(resp.data)['index'][0]
//         }

//     } catch (err) {
//         return {
//             result: false,
//             error: err.message
//         }
//     }
// }


// chub on push action
const cubOnPush = async () => {
    const cube = JSON.parse(fs.readFileSync(process.env.NODE_CUBE, 'utf8')).commits[0].message.split(".")[0];
    // const userInfo = JSON.parse(fs.readFileSync(`${cube}.user.json`, 'utf8'))
    console.log(cube)
    // return await initCube(userInfo.username, cube)
}

cubOnPush().then((res) => {
    console.log(res)
})