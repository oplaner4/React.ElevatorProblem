import IUniqueModel from './IUniqueModel';

/**
 * Interface which represents request for an elevator.
 */
export default interface IElevatorRequest extends IUniqueModel {
  /**
   * Requested target floor. It must be
   * other than the current floor.
   */
  targetFloor: number;
  /**
   * The time requested.
   */
  timeRequested: Date;
  /**
   * Id of the person who requested.
   */
  personId: number;
}
