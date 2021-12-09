import { basename, resolve } from 'path'
import { promises, existsSync, readdirSync, readFileSync, writeFileSync, Dirent } from 'fs'
const { readdir } = promises

export default class ResourceSQLExtractor {

  _initdbDirectory: string

  _resourcesDirectory: string

  constructor(initdbDirectory: string = resolve('docker-entrypoint-initdb.d'), resourcesDirectory: string = resolve(process.cwd(), 'resources')) {
    this._initdbDirectory = resolve(initdbDirectory)
    this._resourcesDirectory = resolve(resourcesDirectory)
  }

  async extract(directory: string = this._resourcesDirectory) {
    /* Make sure the path is resolved */
    directory = resolve(directory)

    /* Check if the directory is valid */
    if (existsSync(directory)) {
      /* Check if the directory is a resource root */
      if (existsSync(resolve(directory, 'fxmanifest.lua')) || existsSync(resolve(directory, '__resource.lua'))) {
        /* Process all .sql files in the root of the resource */
        for (const sqlFile of readdirSync(directory).filter(path => path.split('.').pop() === 'sql')) {
          this.extractSQL(sqlFile)
        }
      } else {
        /* Get all subdirectories of the directory */
        const subdirectories: string[] = ( await readdir(directory, { withFileTypes: true }) ).filter((dirent: Dirent) => dirent.isDirectory()).map((dirent: Dirent) => dirent.name)

        /* Initialize empty promises array to wait for all subdirectories to finish in parallel */
        let promises: PromiseLike<void>[] = []

        /* Process all subDirectories if this is not a resource root */
        for (const subDirectory of subdirectories) {
          promises.push(this.extract(subDirectory))
        }

        /* Search subdirectories in parallel */
        await Promise.all(promises)
      }
    }
  }

  extractSQL(file: string) {
    /* Make sure the file does exist first */
    if (existsSync(file)) {
      /* Get the files contents */
      let sql: string = readFileSync(file).toString()

      /* Check if the SQL does define the used database */
      if (! sql.includes('USE')) {
        /* Prepend the SQL with a use directive */
        sql = `USE ${process.env.MYSQL_DEFAULT_DATABASE}\n` + sql
      }

      /* Write to initdb */
      writeFileSync(resolve(this._initdbDirectory, `999-${basename(file)}.sql`), sql)
    }
  }
}
