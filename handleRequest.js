const shell = require('shelljs')
const fs = require('fs')
const yaml = require('js-yaml')

class payloadHandler {

    constructor(url) {
        this.url = url
        this.gitUser = this.urlParser(this.url)[3]
        this.repository = this.urlParser(this.url)[4].replace('.git', '')
        this.branchListeningList = ['dev', 'development', 'develop']
        this.branch = ''
        this.yaml = `./${this.repository}/.kokar/init.yaml`
        this.yml = `./${this.repository}/.kokar/init.yml`
        console.log(`Listening for repo >> ${this.repository}`)
    }


    onLoadMessage(request) {

        this.branch = request.ref.split("/")[2]

        var Information = [
            { data: "Requested Branch", info: this.branch },
            { data: "Who sent", info: request.head_commit.committer.name },
            { data: "Commit Message", info: request.head_commit.message },
            // { data: "Commit url", info: request.compare},
        ];

        console.table(Information);
        console.log(`\nFor review porpuse, access the link below:`)
        console.log(`${request.compare}\n`);

        if (this.checkRepositoryPayload(request.repository.name) && this.checkRepositoryABranch(this.branch)){
            let colors = { yellow:'\x1b[33m', green: '\x1b[32m', red: '\x1b[31m', reset: '\x1b[0m' }
            try{
                console.log(`${colors.yellow}Checking for init.yaml${colors.reset}`);
                if (fs.existsSync(this.yaml)){
                    console.log(`${colors.green}init.yaml found.${colors.reset}`);

                    let commands = this.checkCommands()

                    if (commands.run){
                        commands.run.forEach(el => {
                            this.runShellCommand(el)
                        });
                    }

                }else{
                    console.log(`${colors.red}Not found.${colors.reset}`)
                    shell.exec(`pwd`)
                    // shell.exec(`./handleServices.sh ${this.repository} ${this.branch}`)
                }
            }catch(err){
                console.log("Why here?")
                shell.exec(`./kokarDevelopInit/handleServices.sh ${this.repository} ${this.branch}`)
            }

        }
        else console.log("Seems it... it didn't work? hmm..🤔\nEither repository is wrong or branch is wrong..")
    }

    checkCommands() {
        try {
            return yaml.load(fs.readFileSync(this.yaml, 'utf8'));
        } catch (e) {
            throw new Error(e)
        }
    }

    runShellCommand(command) {
        shell.exec(command)
    }


    urlParser(url) { return url.split('/') }
    checkRepositoryPayload(repo) { return (repo == this.repository ? true : false) }
    checkRepositoryABranch(branch) { return (branch == 'development' ? true : false) }
}


module.exports = {
    payloadHandler
}