import IElevator from 'app/models/IElevator';

export class ElevatorManager {
  _elevator: IElevator;

  constructor(elevator: IElevator) {
    this._elevator = elevator;
  }
}
