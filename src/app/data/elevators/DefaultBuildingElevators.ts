import { seedElevator } from 'app/utils/data/dataSeeder';
import IElevator from 'app/models/IElevator';
import { DefaultBuildingFloors } from '../buildings/DefaultBuilding';

export const DefaultBuildingCountOfElevators = 5;
export const DefaultBuildingElevators: IElevator[] = [];
for (let i = 1; i < DefaultBuildingCountOfElevators; i++) {
  DefaultBuildingElevators.push(
    seedElevator(
      DefaultBuildingFloors - i,
      DefaultBuildingCountOfElevators - i - 1,
      DefaultBuildingCountOfElevators - i - 1,
      2 * i,
      DefaultBuildingCountOfElevators - i
    )
  );
}
