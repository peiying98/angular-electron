/**
 * This is a model class to contain the data of a potential client.
 * Used to link variables from front-end to backend processing.
 */

export class PotentialClient {

  public name: string;
  public designation: string;
  public organisation: string;
  public email: string;
  public description: string;

  constructor() {
    this.name = null;
    this.designation = null;
    this.organisation = null;
    this.email = null;
    this.description = null;
  }

  validateDataFields() : boolean {
    if (this.name == null || this.designation == null
                          || this.organisation == null
                          || this.email == null
                          || this.description ==  null) {
      return false;
    }
    return true;
  }
}
