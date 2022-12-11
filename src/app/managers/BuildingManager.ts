import IBuilding from 'app/models/IBuilding';
import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import IPerson from 'app/models/IPerson';

export class BuildingManager {
  _building: IBuilding;
  _requests: IElevatorRequest[];
  _people: Record<number, IPerson>;
  _personAndFloor: Record<number, number>;
  _totalRequestCount: 0;

  constructor(building: IBuilding) {
    this._building = building;
    this._requests = [];
    this._people = {};
    this._personAndFloor = {};
    this._totalRequestCount = 0;
  }

  addRequest(person: IPerson, targetFloor: number) {
    let currentFloor = 0;

    if (person.id in this._people) {
      currentFloor = this._personAndFloor[person.id];
    }

    this._requests.push({
      id: this._totalRequestCount++,
      loadFloor: 0,
      targetFloor,
      timeRequested: new Date(),
      personId: person.id,
      status: IElevatorRequestStatus.Created,
    });
  }

  private finishRequest(id: number) {
    this._requests = this._requests.filter((r) => r.id !== id);
  }
}
