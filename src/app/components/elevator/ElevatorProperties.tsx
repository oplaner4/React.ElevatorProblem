import { Tooltip, Typography } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import IElevator from 'app/models/IElevator';

const ElevatorProperties = ({ elevator }: { elevator: IElevator }) => {
  return (
    <Typography
      variant="h6"
      component="span"
      width="100%"
      display="flex"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Typography component="span" variant="h6">
        #{elevator.id}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center">
        <Tooltip title="Speed">
          <SpeedIcon sx={{ mr: 1 }} />
        </Tooltip>
        {elevator.speed}m/s
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center">
        <Tooltip title="Max. count of people">
          <PeopleIcon sx={{ mr: 1 }} />
        </Tooltip>

        {elevator.maxCountPeople}
      </Typography>
    </Typography>
  );
};

export default ElevatorProperties;
