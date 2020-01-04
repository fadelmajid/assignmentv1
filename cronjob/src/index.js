"use strict"

let handler = require("./handler_pid_file.js")

module.exports = async (config) => {

    //========== VALIDATION
    let validate = require("./validation.js")
    await validate(config)

    //========== SIGNAL HANDLING
    let signal_handler = require("./handler_signal.js")
    signal_handler(config)


    let source = await getSource(config.source)
    let f_run = source[config.run] || source.run
    let f_init = config.init === false ? async () => {} : source[config.init] || source.init
    let f_close = config.close === false ? async () => {} : source[config.close] || source.close

    //========== START JOB
    let infinite_loop = true
    await cron_start(config)
    await f_init()
    while (infinite_loop == true) {

        await f_run()
        await sleep(config.sleep)

        infinite_loop = config.infinite_loop
    }
    await f_close()
    await cron_end(config)
    //========== END JOB
}

const sleep = async (t) => {
    await new Promise((resolve) => {
        setTimeout(function () {
            resolve(true)
        }, t)
    })
}

const cron_start = async (config) => {
    let filepath = `${config.pid_file}.pid`
    await handler.open(filepath)
}

const cron_end = async (config) => {
    let filepath = `${config.pid_file}.pid`
    await handler.close(filepath)
}

const getSource = async (source) => {

    if(typeof source == "object") {
        return source
    }else{
        return require(source)
    }
}