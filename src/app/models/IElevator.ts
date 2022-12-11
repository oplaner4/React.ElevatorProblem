import IUniqueModel from './IUniqueModel';

/**
 * Interface which represents an elevator.
 */
export default interface IElevator extends IUniqueModel {
  /**
   * The lowest floor the elevator can run to.
   * It must be smaller than highestFloor floor
   * and greater or equal to zero.
   */
  lowestFloor: number;
  /**
   * The highest floor the elevator can run to.
   * It must be greater than lowest floor
   * and greater or equal to zero.
   */
  highestFloor: number;
  /**
   * The floor the elevator is currently in.
   * It must be greater or equal to lowest floor
   * and smaller or equal to highest floor.
   */
  currentFloor: number;
  /**
   * Speed of the elevator in metres per second.
   * It must be greater than zero.
   */
  speed: number;
  /**
   * The elevator currently runs.
   */
  inService: boolean;
  /**
   * The maximum count of people who can be loaded
   * into the elevator.
   */
  maxCountPeople: number;
}
