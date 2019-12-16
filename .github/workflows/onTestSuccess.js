const crypto = require('crypto');
const shell = require("shelljs")
const axios = require("axios");
const Octokit = require("@octokit/rest");

async function openPullReq(dec, cHub, _repo, owner, branch) {
    let token = dec.split('=')[1];
    let octokit = new Octokit({
        auth: "token " + token
    });
    await octokit.pulls.create({
        owner: cHub,
        repo: _repo,
        head: `${owner}:${branch}`,
        base: branch,
        title: branch,
        body: "Please pull new changes in"
    });
}

async function decryptToken(repo, algorithm, pass) {
    let resp = await axios.get(`https://api.github.com/repos/${repo}/contents/auth.enc`);
    let cnt = resp.data.content;
    let content = Buffer.from(cnt, 'base64').toString('ascii');
    content = content.replace(/\n/g, "");
    var decipher = crypto.createDecipher(algorithm, pass);
    var dec = decipher.update(content, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

async function checkAuth(owner, pass, _repo) {
    return (await axios.post("https://88a4fa7d.ngrok.io/api/check-auth", {
        username: owner,
        gitToken: pass,
        repo: _repo,
        path: `auth.enc?ref=master`
    })).data;
}

async function senPullToChub(cHub, repo, pass, branch) {
    const algorithm = 'aes256';
    try {
        var cipher = crypto.createCipher(algorithm, pass)
        var crypted = cipher.update("unclecode", 'utf8', 'hex')
        crypted += cipher.final('hex');

        let owner = repo.split('/')[0]
        let _repo = repo.split('/')[1]

        shell.exec(`git checkout master`)

        shell.exec(`echo ${crypted} > auth.enc`)

        shell.exec(`git add auth.enc`)
        shell.exec(`git commit -m 'add auth file'`)
        shell.exec(`git push https://${ owner }:${ pass }@github.com/${ repo } master`)

        let auth_res = await checkAuth(owner, pass, _repo);

        if (!auth_res.result) {
            return false;
        } else {

            var dec = await decryptToken(repo, algorithm, pass);
            await openPullReq(dec, cHub, _repo, owner, branch);
            shell.exec(`git checkout ${branch}`)
            console.log("DONE");
            return true
        }

    } catch (err) {
        throw err
    }
}

const onTestSuccess = async (repo, gitToken, branch) => {
    const cHub = "cubiez-verified"
    return await senPullToChub(cHub, repo, gitToken, branch)
}

onTestSuccess(process.argv[2], process.argv[3], process.argv[4]).then((res) => {
    console.log(res)
})