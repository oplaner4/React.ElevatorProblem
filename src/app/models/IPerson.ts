import IUniqueModel from './IUniqueModel';

/**
 * Interface which represents a person.
 */
export default interface IPerson extends IUniqueModel {
  /**
   * Alias of the person. It cannot be empty.
   * It must be unique.
   */
  alias: string;
  /**
   * The building in which the person currently is.
   * If null, the person is in the ground floor of any
   * building.
   */
  currentBuildingId: number | null;
  /**
   * The current floor in which the person is.
   * It must be valid floor within the current building.
   */
  currentFloor: number;
  /**
   * The person is requesting an elevator.
   */
  isRequesting: boolean;
}
