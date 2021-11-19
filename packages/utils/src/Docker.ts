import * as Docker from 'dockerode'
import variables from './envVariables'

const docker = new Docker()

export function dockerPull(repo: string) {
  return new Promise((resolve, reject) => {
    docker.pull(repo, function (err: Error, stream: any) {
      if (err) {
        reject(err)
        return
      }

      stream.pipe(process.stdout)

      docker.modem.followProgress(stream, resolve)
    })
  })
}

export function dockerStart(imageName: string, hostPort: number) {
  return new Promise((resolve, reject) => {
    const options = {
      Image: imageName,
      Tty: false,
      ExposedPorts: {
        '5000/tcp': {},
      },
      Env: ['DOCKER_GRAPHQL_URI=' + variables.DOCKER_GRAPHQL_URI],
      HostConfig: {
        PortBindings: { '5000/tcp': [{ HostPort: hostPort.toString() }] },
      },
    }

    docker.createContainer(options, (err: any, container: any) => {
      if (err) {
        reject(err)
        return
      }

      if (!container) {
        reject(container)
        return
      }

      container.start()
      resolve(imageName)
    })
  })
}
