import { Grid, Typography, List, ListItem, Box, IconButton, Tooltip } from '@mui/material';
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom, timeToLoadAtom } from 'app/state/atom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BuildingViewer from './BuildingViewer';
import { useEffect, useState } from 'react';
import ElevatorRequestCreator from '../request/ElevatorRequestCreator';
import { getFormattedTime } from 'app/utils/utilities';
import IElevator from 'app/models/IElevator';
import { chooseBetterElevator, getRunnableElevators } from 'app/utils/data/elevatorSuitability';
import { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import RequestStatusReporter from 'app/utils/data/RequestStatusReporter';
import DeleteIcon from '@mui/icons-material/Delete';

export interface BuildingUsageProps {
  id?: number;
}

export interface IElevatorRequestAndNewStatus {
  requestId: number;
  status: IElevatorRequestStatus;
}

const BuildingUsage = ({ id }: BuildingUsageProps) => {
  const [params] = useSearchParams();
  const buildingId = params.get('id');
  const buildings = useRecoilValue(buildingsAtom);
  const [requests, setRequests] = useRecoilState(requestsAtom);
  const [people, setPeople] = useRecoilState(peopleAtom);
  const timeToLoad = useRecoilValue(timeToLoadAtom);

  const [elevators, setElevators] = useRecoilState(elevatorsAtom);
  const [newRequestId, setNewRequestId] = useState<number | null>(null);
  const [requestAndNewStatus, setRequestAndNewStatus] = useState<IElevatorRequestAndNewStatus | null>(null);
  const [freeElevatorId, setFreeElevatorId] = useState<number | null>(null);

  const navigate = useNavigate();

  let parsedBuildingId = 0;

  if (typeof id === 'number') {
    parsedBuildingId = id;
  } else {
    parsedBuildingId = Number(buildingId);
  }

  const runElevator = (elevatorId: number, targetFloor: number, onReached: (elevatorId: number) => void) => {
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

  const processRequest = (requestId: number) => {
    const building = buildings[parsedBuildingId];
    const request = requests[requestId];
    const candidateElevators = getRunnableElevators(building, elevators, request);

    let prevElevator: IElevator | null = null;
    let chosenElevator: number | null = null;

    for (const elevatorId of candidateElevators) {
      if (prevElevator === null) {
        prevElevator = elevators[elevatorId];
        chosenElevator = prevElevator.id;
        continue;
      }

      const currentElevator = elevators[elevatorId];
      const betterElevator = chooseBetterElevator(prevElevator, currentElevator, request);

      if (chosenElevator === null || betterElevator !== null) {
        chosenElevator = betterElevator;
      }

      prevElevator = currentElevator;
    }

    if (chosenElevator === null) {
      setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.Refused });
      return;
    }

    const newElevators = { ...elevators };
    newElevators[chosenElevator] = {
      ...newElevators[chosenElevator],
      inService: true,
    };
    setElevators(newElevators);
    setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.ElevatorArriving });
    runElevator(chosenElevator, request.loadFloor, (id) => {
      setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.PersonLoading });
      setTimeout(() => {
        setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.ElevatorReachingTarget });
        runElevator(id, request.targetFloor, () => {
          setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.PersonUnloading });
          setTimeout(() => {
            setFreeElevatorId(id);
            setRequestAndNewStatus({ requestId, status: IElevatorRequestStatus.Finished });
          }, timeToLoad);
        });
      }, timeToLoad);
    });
  };

  useEffect(() => {
    if (!(parsedBuildingId in buildings)) {
      navigate('/data');
      return;
    }

    if (newRequestId === null || requests[newRequestId].status !== IElevatorRequestStatus.Created) {
      return;
    }

    processRequest(newRequestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequestId]);

  useEffect(() => {
    if (requestAndNewStatus === null) {
      return;
    }

    const newRequests = { ...requests };
    newRequests[requestAndNewStatus.requestId] = {
      ...newRequests[requestAndNewStatus.requestId],
      status: requestAndNewStatus.status,
    };
    setRequests(newRequests);

    if (requestAndNewStatus.status !== IElevatorRequestStatus.Finished) {
      return;
    }

    if (!(parsedBuildingId in buildings)) {
      navigate('/data');
      return;
    }

    const finishedRequest = requests[requestAndNewStatus.requestId];
    const newPeople = { ...people };
    newPeople[finishedRequest.personId] = {
      ...newPeople[finishedRequest.personId],
      currentFloor: finishedRequest.targetFloor,
      currentBuildingId: finishedRequest.targetFloor === 0 ? null : parsedBuildingId,
    };
    setPeople(newPeople);

    setRequestAndNewStatus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestAndNewStatus]);

  useEffect(() => {
    if (freeElevatorId === null) {
      return;
    }

    const newElevators = { ...elevators };
    newElevators[freeElevatorId] = {
      ...newElevators[freeElevatorId],
      inService: false,
    };
    setElevators(newElevators);
    setFreeElevatorId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeElevatorId]);

  if (!(parsedBuildingId in buildings)) {
    return null;
  }

  const buildingRequests = Object.keys(requests)
    .map((sid) => Number(sid))
    .filter((id) => {
      const person = people[requests[id].personId];
      return person.currentBuildingId === null || person.currentBuildingId === parsedBuildingId;
    })
    .sort((a, b) => requests[b].id - requests[a].id);

  return (
    <Grid container>
      <Grid item lg={7} xl={8}>
        <BuildingViewer id={parsedBuildingId} />
      </Grid>
      <Grid item lg={5} xl={4} justifyContent="center" display="flex" flexDirection="column">
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

              return (
                <ListItem key={id}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography component="span" variant="h6" color="dark.main">
                      #{request.id}, {getFormattedTime(request.timeRequested)}, {person.alias}, {request.loadFloor}{' '}
                      -&gt; {request.targetFloor}.
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {request.status === IElevatorRequestStatus.Finished ? (
                        <Tooltip title="Delete request">
                          <IconButton
                            color="error"
                            onClick={() => {
                              const newRequests = { ...requests };
                              delete newRequests[id];
                              setRequests(newRequests);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <RequestStatusReporter request={request} fontSize="1.5rem" />
                    </Box>
                  </Box>
                </ListItem>
              );
            })
          )}
        </List>
        <Box mb={2} mt={2}>
          <Typography component="h2" variant="h5" color="primary.main">
            Create request
          </Typography>
        </Box>

        <ElevatorRequestCreator buildingId={parsedBuildingId} onCreated={(d) => setNewRequestId(d.id)} />
      </Grid>
    </Grid>
  );
};

export default BuildingUsage;
