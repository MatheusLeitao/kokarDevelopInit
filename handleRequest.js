const shell = require('shelljs')

class payloadHandler {

    constructor(url){
        this.url = url
        this.gitUser = this.urlParser(this.url)[3]
        this.repository = this.urlParser(this.url)[4].replace('.git', '')
        this.branchListeningList = ['dev', 'development', 'develop']
        this.branch = ''
        console.log(`Listening for repo >> ${this.repository}`)
    }

    urlParser = url => url.split('/')

    onLoadMessage = request => {

        this.branch = request.ref.split("/")[2]

        var Information = [
            { data: "Requested Branch", info: this.branch },
            { data: "Who sent", info: request.head_commit.committer.name },
            { data: "Commit Message", info: request.head_commit.message},
            // { data: "Commit url", info: request.compare},
          ];

          console.table(Information);
          console.log(`\nFor review porpuse, access the link below:`)
          console.log(`${request.compare}\n`);

        if (this.checkRepositoryPayload(request.repository.name) && this.checkRepositoryABranch(this.branch)) shell.exec(`./handleServices.sh ${this.repository} ${this.branch}`)
        else console.log("Seems it... it didn't work? hmm..🤔\nEither repository is wrong or branch is wrong..")
    }


    checkRepositoryPayload = repo => (repo == this.repository ? true : false)
    checkRepositoryABranch = branch => (branch == 'development' ? true : false)
}


module.exports = {
    payloadHandler
}