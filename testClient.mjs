import VersusSocket from './lib/VersusSocket'
import WebSocket from 'ws'
import { Types } from "websocket-client";

process.WebSocket = WebSocket

const reg = /\*+/

async function run() {
  console.log("HERE")
  let s = new VersusSocket()

  s.on('connection:ready', e => console.log(e))
  s.on(reg, e => {
    console.log(e)
  })
  await s.init()
}

run()
  .then(resp => console.log(resp))
  .catch(err => console.error(err))
