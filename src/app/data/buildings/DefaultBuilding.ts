import { seedBuilding } from 'app/utils/data/dataSeeder';
import IBuilding from 'app/models/IBuilding';

export const DefaultBuildingFloors = 15;

const DefaultBuilding: IBuilding = seedBuilding();
DefaultBuilding.countFloors = DefaultBuildingFloors;

export default DefaultBuilding;
