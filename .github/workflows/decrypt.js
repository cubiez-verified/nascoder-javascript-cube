// const crypto = require('crypto');
// const axios = require("axios");
// const Octokit = require("@octokit/rest");

// async function decrypt(owner, repo, pass, head, base, title, body) {
//     console.log("Decrypting content...");

//     const algorithm = 'aes256';

//     try {
//         let resp = await axios.get(
//             `https://api.github.com/repos/${repo}/contents/auth.enc`
//         )
//         let cnt = resp.data.content
//         let content = Buffer.from(cnt, 'base64').toString('ascii').replace(/\n/g, "");

//         var decipher = crypto.createDecipher(algorithm, pass)
//         var dec = decipher.update(content, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         console.log(dec)
        
//         let token = dec;
        
//         let octokit = new Octokit({
//             auth: "token " + token
//         });

//         await octokit.pulls.create({
//             owner,
//             repo,
//             head,
//             base,
//             title,
//             body
//         })

//         return true
//     } catch (err) {
//         throw err
//     }
// }

// const a = async (repo, gitToken, branch) => {
//     let owner = repo.split('/')[0];
//     repo = repo.split('/')[1];
//     let head = `${owner}:${branch}`;
//     let base = branch;
//     let title = branch;
//     let body = `please pull new changes in`;
//     return await decrypt(owner, repo, gitToken, head, base, title, body)
// }

// a(process.argv[2], process.argv[3], process.argv[4]).then((res) => {
//     console.log(res)
// })