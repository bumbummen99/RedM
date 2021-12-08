export default class ResourceManager {
  constructor(definitionFile, resourcesDirectory) {
    this._definition = parseDefinition(definitionFile)
    this._definition = resourcesDirectory
  }
  
  static async parseDefinition(definitionFile) {
    // implement
  }
}
