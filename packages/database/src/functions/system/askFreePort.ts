import * as net from 'net'
import { findSystemSettings } from './find'
import { updateSystemSettings } from './save'

function isPortFree(port: number) {
  console.log('isPortFree', port)
  return new Promise((resolve, reject) => {
    const server = net.createServer(function (socket) {
      socket.write('Echo server\r\n')
      socket.pipe(socket)
    })

    server.listen(port, '127.0.0.1')
    server.on('error', function (e) {
      console.log(e)
      console.log('onError', port)
      reject(false)
    })
    server.on('listening', function () {
      console.log('onListening', port)
      server.close()
      resolve(true)
    })
  })
}

async function getFreePort(port: number): Promise<number> {
  const free = await isPortFree(port)

  if (free) {
    return port
  }

  return getFreePort(port + 1)
}

export async function askFreePort() {
  const systemSettings = await findSystemSettings()

  if (!systemSettings) {
    throw new Error('System settings is not found. Please seed data')
  }

  const { lastFreePort } = systemSettings
  const newLastFreePort = await getFreePort(lastFreePort + 1)
  await updateSystemSettings({ lastFreePort: newLastFreePort })

  return newLastFreePort
}
