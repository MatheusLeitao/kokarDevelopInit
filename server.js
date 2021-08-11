const express = require('express')
const bodyPaser = require('body-parser')
const handleRequest = require('./handleRequest')

const app = express()


app.use(bodyPaser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
    // console.log(req.body)
    handleRequest.onLoadMessage(req)
    res.send('MEC')
})


app.listen(3000, () => {
    console.log('Example app listiing')
})
















































// [color "status"]
//   added = green bold
//   changed = red bold strike
//   untracked = cyan
//   branch = yellow black bold ul