import { atom } from 'recoil';
import { IAppAlert } from 'app/models/IAppAlert';
import IPerson from 'app/models/IPerson';
import IBuilding from 'app/models/IBuilding';
import IElevator from 'app/models/IElevator';
import IElevatorRequest from 'app/models/IElevatorRequest';

export const appAlertsAtom = atom<IAppAlert[]>({
  key: 'appAlerts',
  default: [],
});

export const peopleAtom = atom<Record<number, IPerson>>({
  key: 'people',
  default: {
    1: {
      id: 1,
      alias: 'John',
      currentBuildingId: null,
      currentFloor: 0,
    },
    2: {
      id: 2,
      alias: 'Sarah',
      currentBuildingId: null,
      currentFloor: 0,
    },
  },
});

export const buildingsAtom = atom<Record<number, IBuilding>>({
  key: 'buildings',
  default: {},
});

export const elevatorsAtom = atom<Record<number, IElevator>>({
  key: 'elevators',
  default: {},
});

export const requestsAtom = atom<Record<number, IElevatorRequest>>({
  key: 'requests',
  default: {},
});

export const timeToLoadAtom = atom<number>({
  key: 'timeToLoad',
  default: 1000,
});
