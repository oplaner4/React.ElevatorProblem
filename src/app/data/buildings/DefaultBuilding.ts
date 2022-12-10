import IBuilding from 'app/models/IBuilding';

export const DefaultBuildingFloors = 15;

const DefaultBuilding: IBuilding = {
  id: 0,
  floorHeight: 4,
  countFloors: DefaultBuildingFloors,
  elevators: new Set(),
};

export default DefaultBuilding;
