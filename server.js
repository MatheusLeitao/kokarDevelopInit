'use strict'
const express = require('express')
const bodyPaser = require('body-parser')
const handleRequest = require('./handleRequest')

const app = express()

const parseRequestedArgument = arg => {
    if(String(arg).match(/([-])/)) arg = arg.replace("-", "")
    if(String(arg).match(/https:\/\/github.com\/\b\w+\b\/\b\w+\b\.git/)) return true
    else return false
}

const requestedUrl = process.argv.slice(2)[0]
const port = process.argv.slice(2)[1]

if(requestedUrl && !(parseRequestedArgument(requestedUrl))){
    throw new Error(`\x1b[41mCouldn't find url. Try to run it again with url param.\x1b[0m
        `)
}

const payloadhandler = new handleRequest.payloadHandler(requestedUrl)

app.use(bodyPaser.json())

app.post('/', async (req, res) => {

    let response = await payloadhandler.onLoadMessage(req.body)
    res.status(response.status).send(response)
    
})


const server = app.listen(port || 3000, () => {
    console.log("\n###############################################")
    console.log(`Server is listening at: ${server.address().port}`)
    console.log("###############################################")
})

















































// [color "status"]
//   added = green bold
//   changed = red bold strike
//   untracked = cyan
//   branch = yellow black bold ul