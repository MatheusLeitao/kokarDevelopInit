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


    async onLoadMessage(request) {

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

                    console.log(`${colors.yellow}CHECKING OUT FOR "development" BRANCH${colors.reset}`)
                    shell.exec('git checkout development')
                    console.log(`${colors.yellow}CURRENT BRANCH BELLOW${colors.reset}`)
                    shell.exec('git branch')

                    let commands = this.checkCommands()

                    if (commands.run){
                        commands.run.forEach(el => {
                            this.runShellCommand(el)
                        });
                    }

                    console.log(`${colors.green}Script execution finished successfully.${colors.reset}`)
                    return { status: 200, message: "Script execution finished successfully" }
                }else{
                    console.log(`${colors.red}Not found.${colors.reset}`)
                    shell.exec(`./kokarDevelopInit/handleServices.sh ${this.repository} ${this.branch}`)
                    return { status: 200, message: "Script execution finished successfully" }
                }
            }catch(err){
                shell.exec(`./kokarDevelopInit/handleServices.sh ${this.repository} ${this.branch}`)
                return { status: 200, message: "Script execution finished successfully" }
            }

        } else {
            console.log("Seems it... it didn't work? hmm..🤔\nEither repository is wrong or branch is wrong..")

            if(this.checkRepositoryABranch(this.branch)){
                return {
                    status: 415,
                    message: "Branch doesn't match the required one",
                    branches: {
                        required: "development",
                        got: this.branch
                    }
                }
            }
            if(this.checkRepositoryPayload(request.repository.name)){
                return {
                    status: 416,
                    message: "Repository doesn't match the required one",
                    repository: {
                        required: this.repository,
                        got: request.repository.name
                    }
                }
            }
        }
        return { status: 400, message: "Error when initializing script."}
    }

    checkCommands() {
        try {
            return yaml.load(fs.readFileSync(this.yaml, 'utf8'));
        } catch (e) {
            throw new Error(e)
        }
    }

    runShellCommand(command) {
        shell.exec(`cd ./${this.repository}; ${command}`)
    }


    urlParser(url) { return url.split('/') }
    checkRepositoryPayload(repo) { return (repo == this.repository ? true : false) }
    checkRepositoryABranch(branch) { return (branch == 'development' ? true : false) }
}


module.exports = {
    payloadHandler
}