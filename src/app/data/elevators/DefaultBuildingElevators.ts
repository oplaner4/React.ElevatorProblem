import IElevator from 'app/models/IElevator';
import { DefaultBuildingFloors } from '../buildings/DefaultBuilding';

export const DefaultBuildingCountOfElevators = 5;
export const DefaultBuildingElevators: IElevator[] = [];
for (let i = 1; i < DefaultBuildingCountOfElevators; i++) {
  DefaultBuildingElevators.push({
    id: 0,
    lowestFloor: DefaultBuildingCountOfElevators - i - 1,
    highestFloor: DefaultBuildingFloors - i,
    currentFloor: DefaultBuildingCountOfElevators - i - 1,
    speed: 2 * i,
    inService: false,
    maxCountPeople: DefaultBuildingCountOfElevators - i,
  });
}
