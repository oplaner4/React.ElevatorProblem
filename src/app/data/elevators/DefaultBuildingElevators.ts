import IElevator from 'app/models/IElevator';
import { DefaultBuildingFloors } from '../buildings/DefaultBuilding';

export const DefaultBuildingElevators: IElevator[] = [];
for (let i = 1; i < 5; i++) {
  DefaultBuildingElevators.push({
    id: 0,
    lowestFloor: 0,
    highestFloor: DefaultBuildingFloors - i,
    currentFloor: i - 1,
    speed: 2 * i,
  });
}
