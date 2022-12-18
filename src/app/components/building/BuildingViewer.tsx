import { Box, Grid, Tooltip, Typography, List, ListItem, Chip } from '@mui/material';
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom } from 'app/state/atom';
import { getReversedRange } from 'app/utils/utilities';
import { useRecoilValue } from 'recoil';
import BuildingProperties from 'app/components/building/BuildingProperties';
import ElevatorProperties from 'app/components/elevator/ElevatorProperties';
import LightTooltip from 'app/components/tooltip/LightTooltip';
import IUniqueModel from 'app/models/IUniqueModel';
import { getElevatorRequests } from 'app/utils/data/elevatorSuitability';
import { IElevatorRequestStatus } from 'app/models/IElevatorRequest';

const BuildingViewer = ({ id }: IUniqueModel) => {
  const buildings = useRecoilValue(buildingsAtom);
  const elevators = useRecoilValue(elevatorsAtom);
  const people = useRecoilValue(peopleAtom);
  const requests = useRecoilValue(requestsAtom);

  const building = buildings[id];
  const peopleInBuidling = Object.keys(people)
    .map((sid) => Number(sid))
    .filter((id) => {
      const person = people[id];
      return person.currentBuildingId === null || person.currentBuildingId === building.id;
    })
    .sort((a, b) => (people[a].alias < people[b].alias ? 1 : -1));

  const elevatorIds = Array.from(building.elevators);

  return (
    <Box mb={3}>
      <Box display="flex" justifyContent={{ xs: 'center', md: 'space-between' }} flexWrap="wrap" mb={3}>
        <Box mb={2} sx={{ mr: 2 }}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box component="span" mr={1} px={2} py={1} sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}></Box>{' '}
            Free elevator
          </Typography>
        </Box>
        <Box mb={2} sx={{ mr: 2 }}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box
              component="span"
              mr={1}
              px={2}
              py={1}
              sx={{ bgcolor: 'text.primary', color: 'background.paper' }}
            ></Box>{' '}
            Elevator can run here
          </Typography>
        </Box>
        <Box mb={2} sx={{ mr: 2 }}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box
              component="span"
              mr={1}
              px={2}
              py={1}
              sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}
            ></Box>{' '}
            Elevator is running
          </Typography>
        </Box>
        <Box mb={2} sx={{ mr: 2 }}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box
              component="span"
              mr={1}
              px={2}
              py={1}
              sx={{ bgcolor: 'text.disabled', color: 'background.paper' }}
            ></Box>{' '}
            Elevator can&apos;t run here
          </Typography>
        </Box>
      </Box>

      <Grid container justifyContent="center" spacing={1}>
        <Grid item lg={5} justifyContent="center" display="flex" flexDirection="column">
          <Typography component="h2" variant="h5" color="primary.main">
            Properties
          </Typography>
          <List>
            <ListItem>
              <BuildingProperties building={building} />
            </ListItem>
          </List>

          <Typography component="h2" variant="h5" color="primary.main">
            Elevators
          </Typography>
          <List sx={{ overflow: 'auto', maxHeight: 600 }}>
            {elevatorIds.map((id) => {
              const elevator = elevators[id];

              return (
                <ListItem key={id}>
                  <ElevatorProperties elevator={elevator} />
                </ListItem>
              );
            })}
          </List>
        </Grid>

        <Grid
          item
          lg={7}
          textAlign="center"
          display="flex"
          flexWrap="nowrap"
          gap={1}
          sx={{ overflow: 'auto', width: { xs: 280, sm: 'auto' } }}
        >
          {elevatorIds.map((sid) => {
            const elevatorId = Number(sid);
            const elevator = elevators[elevatorId];
            const elevatorRequests = getElevatorRequests(elevatorId, requests);
            const inService = elevatorRequests.length > 0;
            const isLoading =
              elevatorRequests.filter((r) => {
                const request = requests[r];
                return (
                  request.status === IElevatorRequestStatus.PersonLoading ||
                  request.status === IElevatorRequestStatus.PersonUnloading
                );
              }).length > 0;

            return (
              <Box key={elevatorId}>
                {getReversedRange(0, building.countFloors).map((floor) => {
                  return (
                    <Tooltip
                      key={`${elevatorId}-${floor}`}
                      title={
                        elevator.currentFloor === floor
                          ? `Elevator #${elevator.id}`
                          : floor === 0
                          ? 'Ground floor'
                          : `${floor}. floor`
                      }
                    >
                      <Typography
                        component={Box}
                        px={2}
                        py={1}
                        sx={
                          inService && isLoading && elevator.currentFloor === floor
                            ? { bgcolor: 'warning.main', color: 'warning.contrastText' }
                            : inService && elevator.currentFloor === floor
                            ? { bgcolor: 'secondary.main', color: 'secondary.contrastText' }
                            : elevator.currentFloor === floor
                            ? { bgcolor: 'info.main', color: 'info.contrastText' }
                            : elevator.lowestFloor > floor || elevator.highestFloor < floor
                            ? { bgcolor: 'text.disabled', color: 'background.paper' }
                            : { bgcolor: 'text.primary', color: 'background.paper' }
                        }
                      >
                        {floor}
                      </Typography>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}

          <Box textAlign={{ xs: 'center', md: 'left' }}>
            {getReversedRange(0, building.countFloors).map((floor) => {
              const peopleAtThisFloor = peopleInBuidling.filter(
                (p) => /* (floor === 0 && people[p].currentBuildingId === null) || */ people[p].currentFloor === floor
              );

              return (
                <Typography component={Box} px={0} py={1} key={floor}>
                  {peopleAtThisFloor.length === 0 ? (
                    <>&nbsp;</>
                  ) : peopleAtThisFloor.length <= 3 ? (
                    peopleAtThisFloor.map((p) => {
                      const person = people[p];
                      return (
                        <Tooltip key={p} title={person.alias}>
                          <Chip variant="filled" size="small" color="warning" label={person.alias[0]} sx={{ mr: 1 }} />
                        </Tooltip>
                      );
                    })
                  ) : (
                    <LightTooltip
                      placement="right-end"
                      title={
                        <List>
                          {peopleAtThisFloor.map((p) => (
                            <ListItem key={p}>{people[p].alias}</ListItem>
                          ))}
                        </List>
                      }
                    >
                      <Chip
                        variant="filled"
                        size="small"
                        color="warning"
                        sx={{ mr: 1 }}
                        label={
                          peopleAtThisFloor
                            .slice(0, 3)
                            .map((p) => people[p].alias[0])
                            .join(', ') + '...'
                        }
                      />
                    </LightTooltip>
                  )}
                </Typography>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BuildingViewer;
