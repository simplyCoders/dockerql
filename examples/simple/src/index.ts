import * as dockerql from 'dockerql'
import { Numbers } from 'humanify-numbers'

const main = async () => {
    try {
        // setup the dockerql option, for now this means loglevel
        dockerql.init()

        // connect to a registry, in this case dockerhub with anonymous access
        await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

        // get top ten public library repos by number of stars
        const rsp = await dockerql.query(`SELECT repo, stars, pulls FROM repos ORDER BY stars DESC LIMIT 10`)
        // humanify the numbers
        const tbl = []
        for (let i = 0; i < rsp.data.length; i += 1) {
            const record = rsp.data[i]
            tbl.push({
                repo: record.repo,
                stars: Numbers.stringify(record.stars),
                pulls: Numbers.stringify(record.pulls)
            })
        }
        // print a table of the results
        console.table(tbl)

    } catch (err) {
        console.error(err.message)
        return
    }
}

main()