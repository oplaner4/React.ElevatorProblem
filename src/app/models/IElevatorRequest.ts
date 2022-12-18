import IUniqueModel from './IUniqueModel';

/**
 * Represents status of the request.
 */
export enum IElevatorRequestStatus {
  Pending,
  ElevatorArriving,
  PersonLoading,
  ElevatorReachingTarget,
  PersonUnloading,
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
   * Unique identifier of the person who requested.
   */
  personId: number;
  /**
   * Status in which the request currently is.
   */
  status: IElevatorRequestStatus;
  /**
   * Unique identifier of the elevator which satisfies the request.
   * This must be valid for status elevator is arriving or later.
   */
  elevatorId: number;
}
