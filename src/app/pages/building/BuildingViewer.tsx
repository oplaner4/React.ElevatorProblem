import { Box, Button, ButtonGroup, Grid, Tooltip, Typography, List, ListItem } from '@mui/material';
import { buildingsAtom, elevatorsAtom, peopleAtom } from 'app/state/atom';
import { getReversedRange } from 'app/utils/utilities';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import BuildingProperties from 'app/components/building/BuildingProperties';
import ElevatorProperties from 'app/components/elevator/ElevatorProperties';

export interface BuildingViewerProps {
  id?: number;
}

const BuildingViewer = ({ id }: BuildingViewerProps) => {
  const [params] = useSearchParams();
  const buildingId = params.get('id');
  const buildings = useRecoilValue(buildingsAtom);
  const elevators = useRecoilValue(elevatorsAtom);
  const people = useRecoilValue(peopleAtom);

  const navigate = useNavigate();

  let parsedId = 0;

  if (typeof id === 'number') {
    parsedId = id;
  } else {
    parsedId = Number(buildingId);
  }

  useEffect(() => {
    if (!(parsedId in buildings)) {
      navigate('/data');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!(parsedId in buildings)) {
    return null;
  }

  const building = buildings[parsedId];
  const peopleInBuidling = Object.keys(people)
    .map((sid) => Number(sid))
    .filter((id) => {
      const person = people[id];
      return person.currentBuildingId === null || person.currentBuildingId === parsedId;
    })
    .sort((a, b) => (people[a].alias < people[b].alias ? 1 : -1));

  const elevatorIds = Array.from(building.elevators);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3}>
        <Box mb={2}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box component="span" mr={1} px={2} py={1} sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}></Box>{' '}
            Free elevator
          </Typography>
        </Box>
        <Box mb={2}>
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
        <Box mb={2}>
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
        <Box mb={2}>
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

      <Grid container textAlign="center" justifyContent="center" spacing={1}>
        <Grid item lg={5} justifyContent="center" textAlign="left" display="flex" flexDirection="column">
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
        <Grid item>
          {getReversedRange(0, building.countFloors).map((floor) => {
            const peopleAtThisFloor = peopleInBuidling.filter(
              (p) => (floor === 0 && people[p].currentBuildingId === null) || people[p].currentFloor === floor
            );

            return (
              <Typography component={Box} px={0} py={1} key={floor}>
                {peopleAtThisFloor.length === 0 ? (
                  <>&nbsp;</>
                ) : (
                  <Typography key={id} component="span" variant="body1" color="secondary.main">
                    {peopleAtThisFloor.map((p) => people[p].alias).join(', ')}
                  </Typography>
                )}
              </Typography>
            );
          })}
        </Grid>

        {elevatorIds.map((sid) => {
          const elevatorId = Number(sid);
          const elevator = elevators[elevatorId];

          return (
            <Grid key={elevatorId} item>
              {getReversedRange(0, building.countFloors).map((floor) => {
                return (
                  <Tooltip
                    key={`${elevatorId}-${floor}`}
                    title={elevator.currentFloor === floor ? `Elevator #${elevator.id}` : ''}
                  >
                    <Typography
                      component={Box}
                      px={2}
                      py={1}
                      sx={
                        elevator.inService && elevator.currentFloor === floor
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
            </Grid>
          );
        })}
      </Grid>

      <Box mt={3}>
        <ButtonGroup>
          <Button variant="contained" color={'dark' as 'inherit'} onClick={() => navigate('/data')}>
            <ArrowBackIcon /> Back
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default BuildingViewer;
