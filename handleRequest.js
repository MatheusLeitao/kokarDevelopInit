const shell = require('shelljs')

const onLoadMessage = request => {
    request = request.body
    console.log(`RECEIVED A NEW PUSH REQUEST`)
    console.log(`REQUESTED BRANCH >> ${request.ref.split("/")[2]}`)
    console.log(`SENDER >> ${request.head_commit.committer.name }`)
    console.log(`COMMIT MESSAGE >> ${request.head_commit.message}`)
    console.log(`COMMIT COMPARE URL >> ${request.compare}`);


    if (request.ref == 'refs/heads/master') shell.exec("./handleServices.sh")
}


module.exports = {
    onLoadMessage
}