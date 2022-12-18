import { Grid, Typography, List, ListItem, Box, IconButton, Tooltip, Button, ButtonGroup } from '@mui/material';
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom, timeToLoadAtom } from 'app/state/atom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import BuildingViewer from '../../components/building/BuildingViewer';
import { useEffect, useState } from 'react';
import ElevatorRequestCreator from '../../components/request/ElevatorRequestCreator';
import { getEarliestRequest } from 'app/utils/data/elevatorSuitability';
import { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import RequestStatusReporter from 'app/components/request/RequestStatusReporter';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RequestProperties from 'app/components/request/RequestProperties';
import { deleteMoreRecords, deleteRecord, modifyRecord } from 'app/utils/data/dataManipulator';
import IBuilding from 'app/models/IBuilding';
import IUniqueModel from 'app/models/IUniqueModel';

interface IRequestAndStatus {
  requestId: number;
  status: IElevatorRequestStatus;
}

const BuildingUsage = ({ id }: Partial<IUniqueModel>) => {
  const [params] = useSearchParams();
  const [buildings, setBuildings] = useRecoilState(buildingsAtom);
  const [requests, setRequests] = useRecoilState(requestsAtom);
  const [people, setPeople] = useRecoilState(peopleAtom);
  const timeToLoad = useRecoilValue(timeToLoadAtom);

  const [elevators, setElevators] = useRecoilState(elevatorsAtom);
  const [requestAndStatus, setRequestAndStatus] = useState<IRequestAndStatus | null>(null);

  const [elevatorDealWithRequests, setElevatorDealWithRequests] = useState<number | null>(null);

  // eslint-disable-next-line prefer-const
  let building: IBuilding;
  const navigate = useNavigate();

  let parsedBuildingId = 0;

  if (typeof id === 'number') {
    parsedBuildingId = id;
  } else {
    parsedBuildingId = Number(params.get('id'));
  }

  const adjustToStatus = (requestId: number, status: IElevatorRequestStatus) => {
    setRequestAndStatus({ requestId, status });
  };

  useEffect(() => {
    if (!(parsedBuildingId in buildings)) {
      navigate('/data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (requestAndStatus === null) {
      return;
    }

    const { requestId, status } = requestAndStatus;
    setRequestAndStatus(null);

    const request = requests[requestId];

    switch (status) {
      case IElevatorRequestStatus.Pending:
      case IElevatorRequestStatus.PersonLoading:
      case IElevatorRequestStatus.PersonUnloading:
        break;
      case IElevatorRequestStatus.Finished:
        setPeople(
          modifyRecord(
            request.personId,
            (model) => {
              model.currentFloor = request.targetFloor;
              model.currentBuildingId = request.targetFloor === 0 ? null : building.id;
              model.isRequesting = false;
            },
            people
          )
        );
        break;
      case IElevatorRequestStatus.ElevatorArriving:
        if (status === request.status) {
          setElevators(
            modifyRecord(
              request.elevatorId,
              (model) => {
                model.currentFloor += request.loadFloor > model.currentFloor ? 1 : -1;
              },
              elevators
            )
          );
          return;
        }
        break;
      case IElevatorRequestStatus.ElevatorReachingTarget:
        if (status === request.status) {
          setElevators(
            modifyRecord(
              request.elevatorId,
              (model) => {
                model.currentFloor += request.targetFloor > model.currentFloor ? 1 : -1;
              },
              elevators
            )
          );
          return;
        }
        break;
      default:
        return;
    }

    setRequests(
      modifyRecord(
        requestId,
        (model) => {
          model.status = status;
        },
        requests
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestAndStatus]);

  useEffect(() => {
    if (requestAndStatus === null) {
      return;
    }

    const request = requests[requestAndStatus.requestId];

    if (request.status === IElevatorRequestStatus.Finished) {
      return;
    }

    if (
      request.status === IElevatorRequestStatus.ElevatorArriving ||
      request.status === IElevatorRequestStatus.ElevatorReachingTarget
    ) {
      adjustToStatus(requestAndStatus.requestId, requestAndStatus.status);
      return;
    }

    const ms = request.status === IElevatorRequestStatus.Pending ? 500 : timeToLoad;
    const timer = setTimeout(() => setElevatorDealWithRequests(request.elevatorId), ms);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  useEffect(() => {
    if (requestAndStatus === null) {
      return;
    }

    const request = requests[requestAndStatus.requestId];

    if (
      request.status !== IElevatorRequestStatus.ElevatorArriving &&
      request.status !== IElevatorRequestStatus.ElevatorReachingTarget
    ) {
      return;
    }

    const ms = 1000 * (building.floorHeight / elevators[request.elevatorId].speed);
    const timer = setTimeout(() => setElevatorDealWithRequests(request.elevatorId), ms);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elevators]);

  useEffect(() => {
    if (elevatorDealWithRequests === null) {
      return;
    }

    const requestId = getEarliestRequest(elevatorDealWithRequests, requests, elevators);
    setElevatorDealWithRequests(null);

    if (requestId === null) {
      return;
    }

    const request = requests[requestId];
    const elevator = elevators[request.elevatorId];

    if (request.loadFloor === elevator.currentFloor) {
      adjustToStatus(
        requestId,
        request.status === IElevatorRequestStatus.PersonLoading
          ? IElevatorRequestStatus.ElevatorReachingTarget
          : IElevatorRequestStatus.PersonLoading
      );
      return;
    }

    if (request.status !== IElevatorRequestStatus.ElevatorArriving && request.targetFloor === elevator.currentFloor) {
      adjustToStatus(
        requestId,
        request.status === IElevatorRequestStatus.PersonUnloading
          ? IElevatorRequestStatus.Finished
          : IElevatorRequestStatus.PersonUnloading
      );
      return;
    }

    if (request.status === IElevatorRequestStatus.Pending) {
      adjustToStatus(requestId, IElevatorRequestStatus.ElevatorArriving);
      return;
    }

    adjustToStatus(requestId, request.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elevatorDealWithRequests]);

  if (!(parsedBuildingId in buildings)) {
    return null;
  }

  building = buildings[parsedBuildingId];
  const buildingRequests = Array.from(building.requests).sort((a, b) => requests[b].id - requests[a].id);

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} lg={8}>
        <BuildingViewer id={parsedBuildingId} />
      </Grid>
      <Grid item xs={12} sm={9} lg={4} justifyContent="center" display="flex" flexDirection="column">
        <Box sx={{ overflow: 'auto', maxHeight: 200 }}>
          <Box display="flex" justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center">
            <Typography component="h2" variant="h5" color="primary.main">
              Requests
            </Typography>
            <Tooltip title="Delete all finished requests">
              <IconButton
                sx={{ visibility: buildingRequests.length <= 1 ? 'hidden' : 'visible', mx: 1 }}
                color="error"
                onClick={() => {
                  setRequests(
                    deleteMoreRecords(
                      buildingRequests.filter((id) => requests[id].status === IElevatorRequestStatus.Finished),
                      requests
                    )
                  );

                  setBuildings(
                    modifyRecord(
                      parsedBuildingId,
                      (model) => {
                        model.requests = new Set(
                          buildingRequests.filter((id) => requests[id].status !== IElevatorRequestStatus.Finished)
                        );
                      },
                      buildings
                    )
                  );
                }}
              >
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <List>
            {buildingRequests.length === 0 ? (
              <ListItem>
                <Typography variant="h6" component="p" color="dark.main">
                  No requests created yet.
                </Typography>
              </ListItem>
            ) : (
              buildingRequests.map((id) => {
                const request = requests[id];

                return (
                  <ListItem key={id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Box>
                        <RequestProperties request={request} people={people} />
                      </Box>
                      <Box display="flex" alignItems="center" flexWrap="nowrap">
                        {request.status === IElevatorRequestStatus.Finished ? (
                          <Tooltip title="Delete request">
                            <IconButton
                              color="error"
                              onClick={() => {
                                setBuildings(
                                  modifyRecord(
                                    parsedBuildingId,
                                    (model) => {
                                      model.requests = new Set(model.requests);
                                      model.requests.delete(id);
                                    },
                                    buildings
                                  )
                                );

                                setRequests(deleteRecord(id, requests));
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        <RequestStatusReporter request={request} iconsFontSize="1.5rem" />
                      </Box>
                    </Box>
                  </ListItem>
                );
              })
            )}
          </List>
        </Box>

        <Box mb={2} mt={2}>
          <Typography component="h2" variant="h5" color="primary.main">
            Create request
          </Typography>
        </Box>

        <ElevatorRequestCreator
          buildingId={parsedBuildingId}
          onCreated={(requestId) => adjustToStatus(requestId, IElevatorRequestStatus.Pending)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box mt={3}>
          <ButtonGroup>
            <Button variant="contained" color={'dark' as 'inherit'} onClick={() => navigate('/data')}>
              <ArrowBackIcon /> Back
            </Button>
          </ButtonGroup>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BuildingUsage;
