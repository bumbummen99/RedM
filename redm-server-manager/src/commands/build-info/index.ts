import {Command} from '@oclif/command'
import BuildServer, { BuildInformation } from '../../core/BuildServer'

export default class BuildInfo extends Command {
  static description = 'Fetches information about the latest build from the fivem build server.'

  static examples = [
    `$ rsm build-info latest http://runtime.fivem.net/artifacts/fivem/build_proot_linux/master`,
  ]

  static args = [
    {name: 'type'},
    {name: 'url'}
  ]

  async run(): Promise<void> {
    /* Get the arguments */
    const { args } = this.parse(BuildInfo)

    /* Initialize the BuildServer instance */
    const buildServer: BuildServer = new BuildServer(args.type, args.url)

    /* Fetch the information if the build */
    const buildInfo: BuildInformation = await buildServer.fetchData()

    /* Execute and output */
    this.log(`Build: "${buildInfo.build}", Commit: "${buildInfo.commit}"`)
  }
}