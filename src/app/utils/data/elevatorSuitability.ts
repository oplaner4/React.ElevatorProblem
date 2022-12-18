import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import IElevator from 'app/models/IElevator';
import IBuilding from 'app/models/IBuilding';
import { request } from 'http';

/**
 * Finds out how suitable it is for an elevator to satisfy a request.
 * @param elevator The elevator which is able to satisfy request.
 * @param request Request which is about to be satisfied.
 * @returns Satisfaction score. An elevator with a larger score is a better choice.
 */
const getSatisfactionScore = (elevator: IElevator, request: IElevatorRequest): number => {
  const targetTotalFloors = Math.abs(elevator.currentFloor - request.targetFloor);
  const loadTotalFloors = Math.abs(elevator.currentFloor - request.loadFloor);
  return elevator.speed / (targetTotalFloors + loadTotalFloors);
};

/**
 * Finds out how which people are currently in the elevator.
 * @param building Building in which the elevator runs.
 * @param elevatorId Unique identifier of the elevator.
 * @param elevators Source database of elevators.
 * @param requests Source database of requests.
 * @returns Unique identifiers of people in the elevator.
 */
export const getPeopleInElevator = (
  building: IBuilding,
  elevatorId: number,
  requests: Record<number, IElevatorRequest>
): number[] => {
  return Array.from(building.requests)
    .filter((r) => {
      const request = requests[r];
      return request.elevatorId === elevatorId && request.status === IElevatorRequestStatus.ElevatorReachingTarget;
    })
    .map((r) => requests[r].personId);
};

/**
 * Determines whether an elevator can satisfy a request.
 * @returns True if the elevator can satisfy the request.
 * False indicates that another elevator has to be be used.
 */
export const canElevatorSatisfyRequest = (elevator: IElevator, request: IElevatorRequest): boolean => {
  return (
    request.targetFloor <= elevator.highestFloor &&
    request.targetFloor >= elevator.lowestFloor &&
    request.loadFloor <= elevator.highestFloor &&
    request.loadFloor >= elevator.lowestFloor
  );
};

/**
 * Gets requests which are being satisfied by an elevator.
 * @param elevatorId Unique identifier of the elevator which satisfies requests.
 * @param requests Source database of requests.
 * @returns Unique identifiers of matching requests.
 */
export const getElevatorRequests = (elevatorId: number, requests: Record<number, IElevatorRequest>): number[] => {
  return Object.keys(requests)
    .map((sid) => Number(sid))
    .filter((id) => {
      const request = requests[id];
      return request.elevatorId === elevatorId && request.status !== IElevatorRequestStatus.Finished;
    });
};

export const compareRequestsByEndpoints = (
  request1: IElevatorRequest,
  request2: IElevatorRequest,
  currentFloor: number
): number => {
  if (
    (request1.loadFloor === request2.loadFloor && currentFloor === request1.loadFloor) ||
    (request1.targetFloor === request2.targetFloor && currentFloor === request1.targetFloor)
  ) {
    return 0;
  }

  if (currentFloor === request1.loadFloor || currentFloor === request1.targetFloor) {
    return 1;
  }

  if (currentFloor === request2.loadFloor || currentFloor === request2.targetFloor) {
    return -1;
  }

  return 0;
};

export const getUrgencyScore = (request: IElevatorRequest, currentFloor: number, now: Date): number => {
  let score = now.getTime() - request.timeRequested.getTime();

  if (
    request.status === IElevatorRequestStatus.Pending ||
    request.status === IElevatorRequestStatus.ElevatorArriving ||
    request.status === IElevatorRequestStatus.PersonLoading
  ) {
    score -= Math.abs(currentFloor - request.loadFloor);
  } else {
    score -= Math.abs(currentFloor - request.targetFloor);
  }

  return score;
};

/**
 * Gets the request which should be satisfied as soon as possible.
 * @param elevatorId Unique identifier of the elevator.
 * @param requests Source database of requests.
 * @param elevators Source database of elevators.
 * @returns Unique identifier of the request or null if there is no
 * such request to be satisfied.
 */
export const getEarliestRequest = (
  elevatorId: number,
  requests: Record<number, IElevatorRequest>,
  elevators: Record<number, IElevator>
): number | null => {
  const elevatorRequests = getElevatorRequests(elevatorId, requests);
  const now = new Date();

  if (elevatorRequests.length === 0) {
    return null;
  }

  const elevator = elevators[elevatorId];
  const currentFloor = elevator.currentFloor;

  return elevatorRequests.sort((a, b) =>
    getUrgencyScore(requests[a], currentFloor, now) >= getUrgencyScore(requests[b], currentFloor, now) ? 1 : -1
  )[elevatorRequests.length - 1];
};

export const activeRequestStatuses: Set<IElevatorRequestStatus> = new Set([
  IElevatorRequestStatus.ElevatorArriving,
  IElevatorRequestStatus.ElevatorReachingTarget,
  IElevatorRequestStatus.PersonLoading,
  IElevatorRequestStatus.PersonUnloading,
]);

export const getActiveRequests = (elevatorId: number, requests: Record<number, IElevatorRequest>): number[] => {
  return Object.keys(requests)
    .map((sid) => Number(sid))
    .filter((id) => {
      const request = requests[id];
      return request.elevatorId === elevatorId && activeRequestStatuses.has(request.status);
    });
};

export const getUnmissedElevators = (
  building: IBuilding,
  requestId: number,
  elevators: Record<number, IElevator>,
  requests: Record<number, IElevatorRequest>
): number[] => {
  const request = requests[requestId];

  return Array.from(building.elevators).filter((id) => {
    const elevator = elevators[id];

    return elevator.currentFloor >= request.loadFloor;
  });
};

export const getSuitabilityScore = (
  elevatorId: number,
  requestData: IElevatorRequest,
  elevators: Record<number, IElevator>,
  requests: Record<number, IElevatorRequest>
): number => {
  const earliest = getEarliestRequest(elevatorId, requests, elevators);
  const score = getSatisfactionScore(elevators[elevatorId], requestData);

  if (earliest === null) {
    return score;
  }

  /* const earliestRequest = requests[earliest];
  
  if (earliestRequest.status === IElevatorRequestStatus.ElevatorArriving &&
    earliestRequest.loadFloor < requestData.targetFloor && requestData.loadFloor < earliestRequest.)
  */
  return score;
};

export const chooseBestElevator = (
  building: IBuilding,
  requestData: IElevatorRequest,
  elevators: Record<number, IElevator>,
  requests: Record<number, IElevatorRequest>
): number => {
  return Array.from(building.elevators)
    .filter((id) => canElevatorSatisfyRequest(elevators[id], requestData))
    .sort((a, b) =>
      getSuitabilityScore(a, requestData, elevators, requests) >=
      getSuitabilityScore(b, requestData, elevators, requests)
        ? 1
        : -1
    )[0];
};
