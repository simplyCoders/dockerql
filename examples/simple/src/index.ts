import * as dockerql from 'dockerql'
import { Numbers } from 'humanify-numbers'

const main = async () => {
    // setup the dockerql option, for now this means loglevel
    dockerql.init()

    // connect to a registry, in this case dockerhub with anonymous access
    await dockerql.connect({ name: "dockerhub", type: "dockerhub" })

    // select the list of repos
    const rsp = await dockerql.query(`SELECT repo, stars, pulls FROM repos`)
    if (rsp.code !== 200) {
        console.error(rsp.message)
        return
    }

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
    // print the number of repos and the first entry
    console.table(tbl)

}

main()