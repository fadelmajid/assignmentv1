"use strict"

let fs = require('fs')
let isRun = require('is-running')
let npid = require('npid');

exports.open = (path) => {

    fs.exists(path, function (exist) {
        if (!exist) {
            if(npid.create(path)) {
                return true
            }else{
                throw new Error("NPID not created!")
            }
        }else{
            fs.readFile(path, 'utf8', function (err, data) {
                if(data == 0 || data == "" || !isRun(data)) {
                    npid.create(path, true);
                    return true
                }else{
                    throw new Error('PROCESS IS RUNNING')
                }
            })
        }
    })
}

exports.close = (path) => {
    npid.remove(path)
}