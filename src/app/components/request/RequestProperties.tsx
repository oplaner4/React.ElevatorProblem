import { Tooltip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import IElevatorRequest from 'app/models/IElevatorRequest';
import IPerson from 'app/models/IPerson';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ElevatorIcon from '@mui/icons-material/Elevator';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { getFormattedTime } from 'app/utils/utilities';

const RequestProperties = ({ request, people }: { request: IElevatorRequest; people: Record<number, IPerson> }) => {
  const person = people[request.personId];
  return (
    <Typography
      variant="h6"
      component="span"
      width="100%"
      display="flex"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Typography component="span" variant="h6" sx={{ mr: 2 }}>
        #{request.id}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center" sx={{ mr: 2 }}>
        <Tooltip title="Time requested">
          <AccessTimeFilledIcon sx={{ mr: 1 }} />
        </Tooltip>
        {getFormattedTime(request.timeRequested)}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center" sx={{ mr: 2 }}>
        <Tooltip title="Person">
          <PersonIcon sx={{ mr: 1 }} />
        </Tooltip>

        {person.alias}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center" sx={{ mr: 2 }}>
        <Tooltip title="Usage of elevator">
          <ElevatorIcon sx={{ mr: 1 }} />
        </Tooltip>

        <Tooltip title="Loading floor">
          <Typography component="span" fontSize="inherit">
            {request.loadFloor}
          </Typography>
        </Tooltip>
        <ArrowForwardIcon />
        <Tooltip title="Unloading floor">
          <Typography component="span" fontSize="inherit">
            {request.targetFloor}
          </Typography>
        </Tooltip>
      </Typography>
    </Typography>
  );
};

export default RequestProperties;
