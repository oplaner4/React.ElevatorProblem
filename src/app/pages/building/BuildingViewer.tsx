import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { buildingsAtom, elevatorsAtom } from 'app/state/atom';
import { getReversedRange } from 'app/utils/utilities';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';

export interface BuildingViewerProps {
  id?: number;
}

const BuildingViewer = ({ id }: BuildingViewerProps) => {
  const [params] = useSearchParams();
  const buildingId = params.get('id');
  const buildings = useRecoilValue(buildingsAtom);
  const elevators = useRecoilValue(elevatorsAtom);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3}>
        <Box mb={2}>
          <Typography component="p" variant="h6" color="dark.main">
            <Box component="span" mr={1} px={2} py={1} sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}></Box>{' '}
            Elevator currently here.
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
            Elevator can run here.
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
            Elevator can&apos;t run here.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={1} textAlign="center" justifyContent="center">
        {Array.from(building.elevators).map((sid) => {
          const elevatorId = Number(sid);
          const elevator = elevators[elevatorId];

          return (
            <Grid key={elevatorId} item>
              {getReversedRange(0, building.countFloors).map((floor) => {
                return (
                  <Typography
                    component={Box}
                    px={2}
                    py={1}
                    key={`${elevatorId}-${floor}`}
                    sx={
                      elevator.currentFloor === floor
                        ? { bgcolor: 'info.main', color: 'info.contrastText' }
                        : elevator.lowestFloor > floor || elevator.highestFloor < floor
                        ? { bgcolor: 'text.disabled', color: 'background.paper' }
                        : { bgcolor: 'text.primary', color: 'background.paper' }
                    }
                  >
                    {floor}
                  </Typography>
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
