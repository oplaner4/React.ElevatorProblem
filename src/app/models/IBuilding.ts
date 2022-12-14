import IUniqueModel from './IUniqueModel';

/**
 * Interface which represents a building.
 */
export default interface IBuilding extends IUniqueModel {
  /**
   * The count of floors in the building. Except of
   * ground floor there must be at least one other floor
   * thus it must be greater than one.
   */
  countFloors: number;
  /**
   * The height of the floor in metres.
   * It must be greater than zero.
   */
  floorHeight: number;
  /**
   * The elevators which are in the building.
   * There must be at least one elevator.
   * It must be possible to get from the ground floor
   * (0) to the highest floor using some combination
   * of these elevators.
   */
  elevators: Set<number>;

  /**
   * The requests which are created by people in the
   * building.
   */
  requests: Set<number>;
}
