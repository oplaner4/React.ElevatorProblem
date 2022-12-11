import IUniqueModel from './IUniqueModel';

/**
 * Represents status of the request.
 */
export enum IElevatorRequestStatus {
  Created,
  ElevatorArriving,
  PersonLoading,
  ElevatorReachingTarget,
  PersonUnloading,
  Refused,
  Finished,
}

/**
 * Interface which represents request for an elevator.
 */
export default interface IElevatorRequest extends IUniqueModel {
  /**
   * The floor in which the person is loaded.
   */
  loadFloor: number;
  /**
   * Requested target floor. In this floor the person
   * is unloaded. It must be other than the current floor.
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

  /**
   * Status in which the request currently is.
   */
  status: IElevatorRequestStatus;
}
