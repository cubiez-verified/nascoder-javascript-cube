const crypto = require('crypto');
const shell = require("shelljs")
const axios = require("axios");
const Octokit = require("@octokit/rest");

async function encryptAndPutAuthFile(username, repo, algorithm, gitToken, authPhrase) {
    try {
        var cipher = crypto.createCipher(algorithm, gitToken);
        var encryptedPhrase = cipher.update(authPhrase, 'utf8', 'hex');
        encryptedPhrase += cipher.final('hex');
        shell.exec(`git checkout master`);
        shell.exec(`echo ${encryptedPhrase} > auth`);
        shell.exec(`git add auth`);
        shell.exec(`git commit -m 'add auth file'`);
        shell.exec(`git push https://${username}:${gitToken}@github.com/${repo} master`);
    } catch (err) {
        throw err
    }
}

async function openPullReq(userToken, cHub, repo, username, branch) {
    try {
        let token = userToken.split('=')[1];
        let octokit = new Octokit({
            auth: "token " + token
        });
        await octokit.pulls.create({
            owner: cHub,
            repo,
            head: `${username}:${branch}`,
            base: branch,
            title: branch,
            body: "Please pull new changes in"
        });
        return true
    } catch (err) {
        if (err.status === 422) {
            return true
        }
        throw err
    }
}

async function getUserTokenAndDecrypt(repo, algorithm, pwd) {
    try {
        let resp = await axios.get(`https://api.github.com/repos/${repo}/contents/auth`);
        let content = Buffer.from(resp.data.content, 'base64').toString('ascii').replace(/\n/g, "");
        var decipher = crypto.createDecipher(algorithm, pwd);
        var token = decipher.update(content, 'hex', 'utf8');
        token += decipher.final('utf8');
        return token;
    } catch (err) {
        throw err
    }
}


async function sendPullToChub(cHub, repo, gitToken, branch) {
    const algorithm = 'aes256';
    const authPhrase = 'unclecode';
    const server = "https://88a4fa7d.ngrok.io";

    try {
        let username = repo.split('/')[0]
        let _repo = repo.split('/')[1]

        await encryptAndPutAuthFile(username, repo, algorithm, gitToken, authPhrase);

        let auth_res = (await axios.post(server + "/api/check-auth", {
            username,
            gitToken,
            repo,
            path: `auth`
        })).data

        if (!auth_res.result) {
            return false;
        } else {
            var user_token = await getUserTokenAndDecrypt(repo, algorithm, gitToken);

            await openPullReq(user_token, cHub, _repo, username, branch);

            shell.exec(`git checkout ${branch}`);

            console.log("DONE");
            return true
        }

    } catch (err) {
        throw err
    }
}

const onTestSuccess = async (repo, gitToken, branch) => {
    const cHub = "cubiez-verified"
    return await sendPullToChub(cHub, repo, gitToken, branch)
}

onTestSuccess(process.argv[2], process.argv[3], process.argv[4]).then((res) => {
    console.log(res)
})