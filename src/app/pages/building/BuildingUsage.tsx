import { Grid } from '@mui/material';
import { buildingsAtom, elevatorsAtom } from 'app/state/atom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BuildingViewer from './BuildingViewer';
import { useEffect, useState } from 'react';
import ElevatorRequestCreator from '../request/ElevatorRequestCreator';

export interface BuildingUsageProps {
  id?: number;
}

const BuildingUsage = ({ id }: BuildingUsageProps) => {
  const [params] = useSearchParams();
  const buildingId = params.get('id');
  const buildings = useRecoilValue(buildingsAtom);
  const [elevators, setElevators] = useRecoilState(elevatorsAtom);
  const navigate = useNavigate();

  const [targetFloor, setTargetFloor] = useState<number>(0);

  let parsedBuildingId = 0;

  if (typeof id === 'number') {
    parsedBuildingId = id;
  } else {
    parsedBuildingId = Number(buildingId);
  }

  useEffect(() => {
    if (!(parsedBuildingId in buildings)) {
      navigate('/data');
      return;
    }

    const intervals: NodeJS.Timer[] = [];
    const building = buildings[parsedBuildingId];

    const runElevator = (elevatorId: number) => {
      const interval = setInterval(() => {
        setElevators((el) => {
          if (
            el[elevatorId].currentFloor === targetFloor ||
            (targetFloor > el[elevatorId].highestFloor &&
              el[elevatorId].currentFloor === el[elevatorId].highestFloor) ||
            (targetFloor < el[elevatorId].lowestFloor && el[elevatorId].currentFloor === el[elevatorId].lowestFloor)
          ) {
            clearInterval(interval);
            return el;
          }

          const newElevators = { ...el };
          newElevators[elevatorId] = {
            ...newElevators[elevatorId],
            currentFloor:
              newElevators[elevatorId].currentFloor > targetFloor
                ? newElevators[elevatorId].currentFloor - 1
                : newElevators[elevatorId].currentFloor + 1,
          };

          return newElevators;
        });
      }, 1000 * (building.floorHeight / elevators[elevatorId].speed));

      intervals.push(interval);
    };

    for (const elevatorId of Array.from(building.elevators)) {
      runElevator(elevatorId);
    }

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [targetFloor]);

  return (
    <Grid container spacing={2}>
      <Grid item lg={8}>
        <BuildingViewer id={parsedBuildingId} />
      </Grid>
      <Grid item lg={4} alignItems="center" display="flex">
        <ElevatorRequestCreator
          buildingId={parsedBuildingId}
          onCreated={(d) => {
            setTargetFloor(d.targetFloor);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default BuildingUsage;
