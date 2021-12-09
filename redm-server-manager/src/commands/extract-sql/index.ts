import {Command} from '@oclif/command'
import ResourceSQLExtractor from '../../core/ResourceSQLExtractor'

export default class ExtractSQL extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ rsm extract-sql ./resources`,
  ]

  static args = [
    {name: 'resourcesDirectory'},
  ]

  async run(): Promise<void> {
    /* Get the arguments */
    const {args} = this.parse(ExtractSQL)

    /* Initialize the extractor with the provided resourcesDirectory */
    const extractor = new ResourceSQLExtractor(undefined, args.resourcesDirectory)

    /* Extract the SQL */
    await extractor.extract()
  }
}