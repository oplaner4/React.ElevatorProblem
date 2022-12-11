import { Box, CircularProgress, Tooltip } from '@mui/material';
import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import DoneIcon from '@mui/icons-material/Done';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';

const RequestStatusReporter = ({
  request,
  fontSize,
}: {
  request: IElevatorRequest;
  fontSize: string;
}): JSX.Element | null => {
  switch (request.status) {
    case IElevatorRequestStatus.Created:
      return (
        <Tooltip title="Created">
          <SearchIcon sx={{ fontSize }} color="info" />
        </Tooltip>
      );
    case IElevatorRequestStatus.ElevatorArriving:
      return (
        <Box>
          <Tooltip title="Elevator is arriving">
            <FastRewindIcon sx={{ fontSize }} color="secondary" />
          </Tooltip>
          <CircularProgress size={fontSize} color="secondary" />
        </Box>
      );
    case IElevatorRequestStatus.PersonLoading:
      return (
        <Box>
          <Tooltip title="Loading person">
            <Box component="span">
              <HourglassTopIcon sx={{ fontSize }} color="warning" />
              <PersonIcon sx={{ fontSize }} color="warning" />
            </Box>
          </Tooltip>
          <CircularProgress size={fontSize} color="warning" />
        </Box>
      );
    case IElevatorRequestStatus.ElevatorReachingTarget:
      return (
        <Box>
          <Tooltip title="Elevator is reaching target floor">
            <FastForwardIcon sx={{ fontSize }} color="secondary" />
          </Tooltip>
          <CircularProgress size={fontSize} color="secondary" />
        </Box>
      );
    case IElevatorRequestStatus.PersonUnloading:
      return (
        <Box>
          <Tooltip title="Unloading person">
            <Box component="span">
              <HourglassBottomIcon sx={{ fontSize }} color="warning" />
              <PersonIcon sx={{ fontSize }} color="warning" />
            </Box>
          </Tooltip>
          <CircularProgress size={fontSize} color="warning" />
        </Box>
      );
    case IElevatorRequestStatus.Finished:
      return (
        <Tooltip title="Finished">
          <DoneIcon sx={{ fontSize }} color="success" />
        </Tooltip>
      );
    case IElevatorRequestStatus.Refused:
      return (
        <Tooltip title="Refused">
          <CancelIcon sx={{ fontSize }} color="error" />
        </Tooltip>
      );
    default:
      return null;
  }
};

export default RequestStatusReporter;
