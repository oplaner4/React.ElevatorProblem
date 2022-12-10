import { DefaultBuildingElevators } from './elevators/DefaultBuildingElevators';
import IElevator from 'app/models/IElevator';

export const predefinedElevators: Record<string, IElevator[]> = {
  Default: DefaultBuildingElevators,
};
