const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

module.exports = {
  containers: resolveApp('src/containers'),
  components: resolveApp('src/components'),
  services: resolveApp('src/services'),
  routes: resolveApp('src/routes'),
  favicon: resolveApp('src/favicon.ico'),
  html: resolveApp('src/index.html'),
  config: resolveApp('src/config.ts'),
  hooks: resolveApp('src/hooks'),
  modals: resolveApp('src/modals'),
  utils: resolveApp('src/utils'),
  generatedGraphqlTypes: resolveApp('src/generatedGraphqlTypes.ts'),
}
