import { Numbers } from 'humanify-numbers'
import * as dockerql from 'dockerql'

const main = async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.setup()

    try {
        // TODO: 
        // lib should throw error
        // lib should retunr simpler response without code, msg, and count

        // connect to a registry, in this case dockerhub with anonymous access
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

        // select the list of repos
        const rsp = await dockerql.query(`SELECT repo, stars, pulls FROM repos`)

        // humanify the numbers
        const tbl = []
        for (let i = 0; i < rsp.data.length; i += 1) {
            tbl.push({
                repo: rsp.data[i].repo,
                stars: Numbers.Humanify(rsp.data[i].stars),
                pulls: Numbers.Humanify(rsp.data[i].pulls)
            })
        }
        // print the number of repos and the first entry
        console.table(tbl)

    } catch (err) {
        console.log("Error ", err)
    }

}

main()