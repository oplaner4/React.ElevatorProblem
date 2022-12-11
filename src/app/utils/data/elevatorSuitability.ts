import IElevatorRequest from 'app/models/IElevatorRequest';
import IElevator from 'app/models/IElevator';
import IBuilding from 'app/models/IBuilding';

const getTotalTime = (elevator: IElevator, request: IElevatorRequest): number => {
  const targetTotalFloors = Math.abs(elevator.currentFloor - request.targetFloor);
  const loadTotalFloors = Math.abs(elevator.currentFloor - request.loadFloor);
  return (targetTotalFloors + loadTotalFloors) / elevator.speed;
};

export const canElevatorRun = (elevator: IElevator, request: IElevatorRequest): boolean => {
  return (
    request.targetFloor <= elevator.highestFloor &&
    request.targetFloor >= elevator.lowestFloor &&
    request.loadFloor <= elevator.highestFloor &&
    request.loadFloor >= elevator.lowestFloor
  );
};

export const getRunnableElevators = (
  building: IBuilding,
  elevators: Record<number, IElevator>,
  request: IElevatorRequest
): number[] => {
  return Array.from(building.elevators).filter((id) => {
    const elevator = elevators[id];
    return !elevator.inService && canElevatorRun(elevator, request);
  });
};

/**
 * Chooses better candidate elevator from two given based on the request specification
 * and current floor of the elvators.
 * @param elevator1 The first runnable elevator to choose from.
 * @param elevator2 The second runnable elevator to choose from.
 * @param request Request for which the elevator should be chosen.
 * @returns The better elevator id or null if none can serve this request.
 */
export const chooseBetterElevator = (
  elevator1: IElevator,
  elevator2: IElevator,
  request: IElevatorRequest
): number | null => {
  // in case of equity prefer rather previous elevator
  return getTotalTime(elevator1, request) <= getTotalTime(elevator2, request) ? elevator1.id : elevator2.id;
};
