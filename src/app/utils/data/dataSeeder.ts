import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import IBuilding from 'app/models/IBuilding';
import IElevator from 'app/models/IElevator';
import IPerson from 'app/models/IPerson';

export const NewModelId = 0;

export const seedPerson = (id: number, alias: string): IPerson => {
  return { id, alias, currentBuildingId: null, currentFloor: 0, isRequesting: false };
};

export const seedElevator = (
  highestFloor?: number,
  lowestFloor?: number,
  currentFloor?: number,
  speed?: number,
  maxCountPeople?: number
): IElevator => {
  return {
    id: NewModelId,
    lowestFloor: lowestFloor ?? 0,
    highestFloor: highestFloor ?? 1,
    currentFloor: currentFloor ?? 0,
    speed: speed ?? 2.5,
    maxCountPeople: maxCountPeople ?? 10,
  };
};

export const seedBuilding = (): IBuilding => {
  return {
    id: NewModelId,
    countFloors: 2,
    floorHeight: 5,
    elevators: new Set(),
    requests: new Set(),
  };
};

export const seedRequest = (): IElevatorRequest => {
  return {
    id: NewModelId,
    loadFloor: 0,
    targetFloor: 1,
    timeRequested: new Date(),
    personId: NewModelId,
    status: IElevatorRequestStatus.Pending,
    elevatorId: NewModelId,
  };
};
