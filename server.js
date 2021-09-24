'use strict'
const express = require('express')
const bodyPaser = require('body-parser')
const handleRequest = require('./handleRequest')
const moment = require('moment')

const app = express()

const parseRequestedArgument = arg => {
    if(String(arg).match(/([-])/)) arg = arg.replace(/-/g, "")
    if(String(arg).match(/https:\/\/github.com\/\b\w+\b\/\b\w+\b\.git/)) return true
    else return false
}

const requestedUrl = process.argv.slice(2)[0]
const port = process.argv.slice(2)[1]

if(requestedUrl && !(parseRequestedArgument(requestedUrl))){
    console.error(`\x1b[41mPlease, insert a valid github repository url.\x1b[0m\n`)
    console.error(`Expected: \x1b[4mhttps://github.com/{repository_creator}/{repository_name}.git\x1b[0m`)
    console.error(`Got: ${requestedUrl} \n`)

    throw new Error(`\x1b[41mCouldn't find url. Try to run it again with url param.\x1b[0m`)
}

const payloadhandler = new handleRequest.payloadHandler(requestedUrl)

app.use(bodyPaser.json({limit: '50mb'}))

app.post('/', async (req, res) => {

    console.log(`\x1b[33m${moment().format('hh:mm:ss')} INITIALIZING NEW REQUEST # \x1b[0m`)

    let response = await payloadhandler.onLoadMessage(req, res)
    try {
        res.status(response.status).send(response)
    } catch (error) {
        console.log("Answer already sent to emmiter.")
    }

    console.log(`\x1b[33m${moment().format('hh:mm:ss')} REQUEST FINISHED  ##\x1b[0m`)

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
