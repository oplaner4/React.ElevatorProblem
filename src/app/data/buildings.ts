import IBuilding from 'app/models/IBuilding';
import DefaultBuilding from './buildings/DefaultBuilding';

export const predefinedBuildings: Record<string, IBuilding> = {
  Default: DefaultBuilding,
};
