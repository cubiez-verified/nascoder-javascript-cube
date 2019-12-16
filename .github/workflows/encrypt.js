const crypto = require('crypto');
const shell = require("shelljs")

async function encrypt(pass) {
    console.log("encrypt content...");

    const algorithm = 'aes256';

    try {
        var cipher = crypto.createCipher(algorithm, pass)
        var crypted = cipher.update("unclecode", 'utf8', 'hex')
        crypted += cipher.final('hex');
        shell.exec(`echo ${crypted} > auth.enc`)
        return true
    } catch (err) {
        throw err
    }
}

const a = async (gitToken) => {
    return await encrypt(gitToken)
}

a(process.argv[2]).then((res) => {
    console.log(res)
})