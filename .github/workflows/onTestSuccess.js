const axios = require("axios");

let checkAuth = async (username, gitToken) => {
    try {
        return (await axios.post("https://88a4fa7d.ngrok.io/api/check-auth", {
            username,
            gitToken,
            repo: 'tmp',
            path: 'auth.enc'
        })).data
    } catch (err) {
        return {
            result: false,
            error: err.message
        }
    }
}

const onEncrypt = async (username, gitToken) => {
    return await checkAuth(username, gitToken)
}

onEncrypt(process.argv[2], process.argv[3]).then((res) => {
    console.log(res)
})