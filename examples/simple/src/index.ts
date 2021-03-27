import * as dockerql from 'dockerql'
import { Numbers } from 'humanify-numbers'

const main = async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.setup()

    try {

        // connect to a registry, in this case dockerhub with anonymous access
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

        // select the list of repos
        const rsp = await dockerql.query(`SELECT repo, stars, pulls FROM repos`)

        // humanify the numbers
        const tbl = []
        for (let i = 0; i < rsp.length; i += 1) {
            tbl.push({
                repo: rsp[i].repo,
                stars: Numbers.stringify(rsp[i].stars),
                pulls: Numbers.stringify(rsp[i].pulls)
            })
        }
        // print the number of repos and the first entry
        console.table(tbl)

    } catch (err) {
        console.log("Error ", err)
    }

}

main()