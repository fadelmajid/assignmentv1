"use strict"

let path = require("path")

module.exports = async (config) => {
    let props = Object.keys(validate)

    for(let prop of props) {
        await validate[prop](config)
    }
}

const infinite_loop = (config) => {
    if(typeof config.infinite_loop !== "boolean") {
        throw new Error(`"infinite_loop" must be a boolean !`)
    }
}

const sleep = (config) => {
    if(isNaN(config.sleep)) {
        throw new Error(`${config.sleep} is not a number !`)
    }
}

const run = (config) => {

    let source = typeof config.source == "string" ? require(config.source) : config.source
    let f_run = source[config.run] || source.run
    if(!isFunction(f_run)) {
        if(config.run) {
            throw new Error(`"${config.run}" is not a function !`)
        }else{
            throw new Error(`Please specify "run" property !`)
        }
    }
}

const init = (config) => {

    if(config.init === false) {
        return
    }

    let source = typeof config.source == "string" ? require(config.source) : config.source
    let f_init = source[config.init] || source.init || function () {}
    if(!isFunction(f_init)) {
        if(config.init) {
            throw new Error(`"${config.init}" is not a function !`)
        }
    }
}

const close = (config) => {

    if(config.close === false) {
        return
    }

    let source = typeof config.source == "string" ? require(config.source) : config.source
    let f_close = source[config.close] || source.close || function () {}
    if(!isFunction(f_close)) {
        if(config.close) {
            throw new Error(`"${config.close}" is not a function !`)
        }
    }
}

const source = (config) => {
    if(typeof config.source == "string") {
        config.source = path.resolve(config.source)
        let fs = require("fs")
        if (!fs.existsSync(config.source)) {
            throw new Error(`"${config.source}" is not exist !`)
        }
    } else if(typeof config.source != "object") {
        throw new Error(`Invalid "source" type ! Must be an object or a string !`)
    }
}

const pid_file = (config) => {

    config.pid_file = path.resolve(config.pid_file)
    let extension = config.pid_file.substring(config.pid_file.length - 4)

    if(extension == ".pid") {
        config.pid_file = config.pid_file.substring(0, config.pid_file.length - 4)
    }

}

function isFunction (functionToCheck) {
    let getType = {};
    if(functionToCheck) {
        if(getType.toString.call(functionToCheck) === '[object Function]' ||
            getType.toString.call(functionToCheck) === '[object AsyncFunction]') {
            return true
        }
    }
    return false
}

const validate = {
    infinite_loop,
    source,
    init,
    run,
    close,
    sleep,
    pid_file
}