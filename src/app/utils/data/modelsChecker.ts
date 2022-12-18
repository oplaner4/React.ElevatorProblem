import IBuilding from 'app/models/IBuilding';
import IElevator from 'app/models/IElevator';
import IElevatorRequest from 'app/models/IElevatorRequest';
import IPerson from 'app/models/IPerson';

/**
 * Checks that an elevator contains correct properties and meets problem
 * requirements.
 * @param elevator The elevator to check.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectElevator = (elevator: IElevator): string => {
  if (elevator.lowestFloor < 0) {
    return 'The lowest floor must be greater or equal to zero.';
  }

  if (elevator.lowestFloor > elevator.highestFloor) {
    return 'The lowest floor must be smaller or equal to the highest floor.';
  }

  if (elevator.highestFloor < 0) {
    return 'The highest floor must be greater or equal to zero.';
  }

  if (elevator.highestFloor < elevator.lowestFloor) {
    return 'The highest floor must be smaller or equal to the lowest floor.';
  }

  if (elevator.currentFloor < 0) {
    return 'The current floor must be greater or equal to zero.';
  }

  if (elevator.currentFloor < elevator.lowestFloor) {
    return 'The current floor must be greater or equal to lowest floor.';
  }

  if (elevator.currentFloor > elevator.highestFloor) {
    return 'The current floor must be smaller or equal to highest floor.';
  }

  if (elevator.speed <= 0) {
    return 'A speed of the elevator must be greater than zero.';
  }

  if (elevator.maxCountPeople <= 1) {
    return 'The maximum count of people must be greater or equal to the only person.';
  }

  return '';
};

/**
 * Checks that an elevator contains correct properties within the building.
 * @param elevator The elevator within the building to check.
 * @param building The building in which this elevator runs.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectElevatorForBuilding = (elevator: IElevator, building: IBuilding): string => {
  if (elevator.highestFloor >= building.countFloors) {
    return `There are just ${building.countFloors} floors in the building.`;
  }

  return '';
};

/**
 * Checks that a building (and its elevators) contains correct properties
 * and meets problem requirements.
 * @param building The building to check.
 * @param elevators All defined elevators.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectBuilding = (building: IBuilding, elevators: Record<number, IElevator>): string => {
  if (building.countFloors < 2) {
    return 'The count of floors must be greater than one.';
  }

  if (building.floorHeight <= 0) {
    return 'The floor height must be greater than zero.';
  }

  if (building.elevators.size === 0) {
    return 'There must be at least one elevator in the building.';
  }

  let anyGroundFloor = false;
  let anyHighestFloor = false;
  const elevatorsErrorMsg =
    'It is not possible to get from the ground floor to the highest floor using any combination of elevators.';

  const elevatorIds: number[] = Array.from(building.elevators);

  for (const elevatorId of elevatorIds) {
    const elevator = elevators[elevatorId];

    anyGroundFloor = anyGroundFloor || elevator.lowestFloor === 0;
    anyHighestFloor = anyHighestFloor || elevator.highestFloor === building.countFloors - 1;

    const elevatorsOut = elevatorIds.filter((id) => {
      const e = elevators[id];
      return id !== elevatorId && (e.highestFloor < elevator.lowestFloor || e.lowestFloor > elevator.highestFloor);
    });

    if (elevatorsOut.length > 0 && elevatorsOut.length === elevatorIds.length - 1) {
      return elevatorsErrorMsg;
    }
  }

  if (anyGroundFloor && anyHighestFloor) {
    return '';
  }

  return elevatorsErrorMsg;
};

/**
 * Checks that a person contains correct properties.
 * @param person The person to check.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectPerson = (person: IPerson): string => {
  if (person.alias === null || person.alias.length === 0) {
    return 'Alias must be specified.';
  }

  if (person.currentBuildingId !== null && person.currentBuildingId <= 0) {
    return 'Unique identifier of the current building must be greater than zero.';
  }

  if (person.currentBuildingId !== null && person.currentFloor < 0) {
    return 'The current floor must be greater or equal to zero.';
  }

  return '';
};

/**
 * Checks that a person contains correct properties within people.
 * @param person The person to check.
 * @param people The people in which this person should be.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectPersonWithinPeople = (person: IPerson, people: Record<number, IPerson>): string => {
  if (Object.values(people).some((p) => p.alias === person.alias)) {
    return 'Alias must be unique.';
  }

  return '';
};

/**
 * Checks that a person contains correct properties within request.
 * @param person The person to check.
 * @param request Request the person figurates in.
 * @returns Error message in case of problem, an empty string otherwise.
 */
export const checkCorrectPersonWithinRequest = (person: IPerson, request: IElevatorRequest): string => {
  if (person.currentFloor === request.targetFloor) {
    return 'The target floor must differ from the current floor.';
  }

  return '';
};
