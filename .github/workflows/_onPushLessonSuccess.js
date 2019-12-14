// const fs = require('fs');
// const Octokit = require("@octokit/rest");
// const axios = require("axios");
// const shell = require("shelljs");


// async function fetchLesson(kidocode, cube, idx, token) {
//     console.log("Getting first lesson name...");

//     try {
//         let octokit = new Octokit({
//             auth: "token " + token
//         });

//         // get first lesson from qhub
//         let resp = await octokit.repos.getContents({
//             owner: "unclecode", // kidocode
//             repo: `javascript-qhub-test`, // `${cube}-qhub`
//             path: `lessons.index`, // `cube.json`
//             headers: {
//                 'accept': 'application/vnd.github.VERSION.raw'
//             }
//         });

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

// async function pullLesson(initLessonBranch, username, cube, token, cHub, qHub, qHubCube) {
//     console.log(`Fetching the first lesson '${initLessonBranch}'...`);
    
//     try {
//         // const cloneUrl = `https://github.com/${cHub}/${username}-${cube}-cube`;
//         const cloneUrl = `https://github.com/${username}/${username}-${cube}-cube`;
//         const _silent = true;

//         shell.exec(`git clone ${cloneUrl}`, { silent: _silent });
//         process.chdir(process.cwd() +  `/${username}-${cube}-cube`);
        
//         shell.exec(`git checkout --orphan ${initLessonBranch}`, { silent: _silent });
//         shell.exec(`git rm -rf .`, { silent: _silent });
//         // shell.exec(`git pull https://unclecode:${token}@github.com/${qHub}/${qHubCube}.git ${initLessonBranch}`, { silent: _silent });
//         shell.exec(`git pull https://unclecode:${token}@github.com/${cHub}/${username}-${cube}-cube.git ${initLessonBranch}`, { silent: _silent });
       
//         shell.exec(`git checkout master`, { silent: _silent });
//         let cubeInfo = JSON.stringify(fs.readFileSync(`lessons.index`, 'utf8'))
//         cubeInfo.current.lesson = initLessonBranch;
//         fs.writeFileSync(`${cube}.cube.json`, JSON.stringify(cubeInfo));
//         shell.exec(`git add --all`, { silent: _silent });
//         shell.exec(`git commit -m 'Add next lesson branch'`, { silent: _silent });
//         shell.exec(`git push origin --all`, { silent: _silent });
//         // shell.exec(`git push https://unclecode:${token}@github.com/${cHub}/${username}-${cube}-cube.git --all`, { silent: _silent });
        
//         return {
//             result: true
//         }

//     } catch (err) {
//         return {
//             result: false,
//             error: err.message
//         }
//     }
// }

// // chub on push action
// const cubOnPush = async () => {
//     const cube = JSON.parse(fs.readFileSync(process.env.NODE_CUBE, 'utf8')).commits[0].message.split(".")[0];
//     const userInfo = JSON.parse(fs.readFileSync(`${cube}.user.json`, 'utf8'))
//     console.log(userInfo, cube)
//     // return await initCube(userInfo.username, cube)
// }

// cubOnPush().then((res) => {
//     console.log(res)
// })

// run: |
//       echo "success"
//       node .github/workflows/onPushLessonSuccess.js