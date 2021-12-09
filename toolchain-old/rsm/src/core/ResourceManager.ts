import { resolve } from "path"

export default class ResourceManager {

  _definitionFile: string

  _resourcesDirectory: string

  constructor(definitionFile: string = resolve(process.cwd(), 'resources.json'), resourcesDirectory: string = resolve(process.cwd(), 'resources')) {
    this._definitionFile = ResourceManager.parseDefinition(resolve(definitionFile))
    this._resourcesDirectory = resolve(resourcesDirectory)
  }
  
  static parseDefinition(definitionFile: string): string {
    // implement
    return '';
  }
}
