import { Grid, Typography, List, ListItem, Box } from '@mui/material';
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom } from 'app/state/atom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BuildingViewer from './BuildingViewer';
import { useEffect, useState } from 'react';
import ElevatorRequestCreator from '../request/ElevatorRequestCreator';
import { getFormattedTime } from 'app/utils/utilities';
import IElevator from 'app/models/IElevator';
import { chooseBetterElevator } from 'app/utils/data/elevatorComparator';

export interface BuildingUsageProps {
  id?: number;
}

const BuildingUsage = ({ id }: BuildingUsageProps) => {
  const [params] = useSearchParams();
  const buildingId = params.get('id');
  const buildings = useRecoilValue(buildingsAtom);
  const requests = useRecoilValue(requestsAtom);
  const people = useRecoilValue(peopleAtom);

  const [elevators, setElevators] = useRecoilState(elevatorsAtom);
  const [elevatorsInService, setElevatorsInService] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  const [targetFloor, setTargetFloor] = useState<number>(0);

  let parsedBuildingId = 0;

  if (typeof id === 'number') {
    parsedBuildingId = id;
  } else {
    parsedBuildingId = Number(buildingId);
  }

  const runElevator = (elevatorId: number, targetFloor: number, onReached: (elevatorId: number) => void) => {
    const newElevatorsInService = new Set(elevatorsInService);
    newElevatorsInService.add(elevatorId);
    setElevatorsInService(newElevatorsInService);

    const interval = setInterval(() => {
      setElevators((el) => {
        if (
          el[elevatorId].currentFloor === targetFloor ||
          (targetFloor > el[elevatorId].highestFloor && el[elevatorId].currentFloor === el[elevatorId].highestFloor) ||
          (targetFloor < el[elevatorId].lowestFloor && el[elevatorId].currentFloor === el[elevatorId].lowestFloor)
        ) {
          clearInterval(interval);
          onReached(elevatorId);
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
    }, 1000 * (buildings[parsedBuildingId].floorHeight / elevators[elevatorId].speed));
  };

  useEffect(() => {
    if (!(parsedBuildingId in buildings)) {
      navigate('/data');
      return;
    }

    const building = buildings[parsedBuildingId];

    let prevElevator: IElevator | null = null;
    let chosenElevator: number | null = null;

    for (const elevatorId of Array.from(building.elevators).filter((id) => !elevatorsInService.has(id))) {
      if (prevElevator === null) {
        prevElevator = elevators[elevatorId];
        chosenElevator = prevElevator.id;
        continue;
      }

      const currentElevator = elevators[elevatorId];
      const betterElevator = chooseBetterElevator(prevElevator, currentElevator, targetFloor);
      chosenElevator = chosenElevator !== null && betterElevator === null ? chosenElevator : betterElevator;
      prevElevator = currentElevator;
    }

    if (chosenElevator !== null) {
      runElevator(chosenElevator, targetFloor, (id) => {
        const newElevatorsInService = new Set(elevatorsInService);
        newElevatorsInService.delete(id);
        setElevatorsInService(newElevatorsInService);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetFloor]);

  const buildingRequests = Object.keys(requests)
    .map((sid) => Number(sid))
    .filter((id) => {
      const person = people[requests[id].personId];
      return person.currentBuildingId === null || person.currentBuildingId === parsedBuildingId;
    })
    .sort((a, b) => requests[b].id - requests[a].id);

  if (!(parsedBuildingId in buildings)) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item lg={7}>
        <BuildingViewer id={parsedBuildingId} />
      </Grid>
      <Grid item lg={5} justifyContent="center" display="flex" flexDirection="column">
        <Typography component="h2" variant="h5" color="primary.main">
          Requests
        </Typography>
        <List sx={{ overflow: 'auto', maxHeight: 200 }}>
          {buildingRequests.length === 0 ? (
            <ListItem>
              <Typography variant="h6" component="p" color="dark.main">
                No requests created yet.
              </Typography>
            </ListItem>
          ) : (
            buildingRequests.map((id) => {
              const request = requests[id];
              const person = people[request.personId];
              const currentFloor = person.currentBuildingId === null ? 0 : person.currentFloor;

              return (
                <ListItem key={id}>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography component="span" variant="h6" color="dark.main">
                      #{request.id}, {getFormattedTime(request.timeRequested)}, {person.alias}, {currentFloor} -&gt;{' '}
                      {request.targetFloor}.
                    </Typography>
                  </Box>
                </ListItem>
              );
            })
          )}
        </List>
        <Box mb={2}>
          <Typography component="h2" variant="h5" color="primary.main">
            Create request
          </Typography>
        </Box>

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
