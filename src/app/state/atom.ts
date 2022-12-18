import { atom } from 'recoil';
import { IAppAlert } from 'app/models/IAppAlert';
import IPerson from 'app/models/IPerson';
import IBuilding from 'app/models/IBuilding';
import IElevator from 'app/models/IElevator';
import IElevatorRequest from 'app/models/IElevatorRequest';
import { seedPerson } from 'app/utils/data/dataSeeder';

export const appAlertsAtom = atom<IAppAlert[]>({
  key: 'appAlerts',
  default: [],
});

export const peopleAtom = atom<Record<number, IPerson>>({
  key: 'people',
  default: {
    1: seedPerson(1, 'John'),
    2: seedPerson(2, 'Sarah'),
    3: seedPerson(3, 'Peter'),
    4: seedPerson(4, 'Kate'),
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
