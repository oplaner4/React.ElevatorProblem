import { Box, CircularProgress, Tooltip } from '@mui/material';
import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import DoneIcon from '@mui/icons-material/Done';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PersonIcon from '@mui/icons-material/Person';
import PendingIcon from '@mui/icons-material/Pending';

const RequestStatusReporter = ({
  request,
  iconsFontSize,
}: {
  request: IElevatorRequest;
  iconsFontSize: string;
}): JSX.Element | null => {
  switch (request.status) {
    case IElevatorRequestStatus.ElevatorArriving:
      return (
        <Box display="flex" flexWrap="nowrap">
          <Tooltip title="Elevator is arriving">
            <FastRewindIcon sx={{ fontSize: iconsFontSize }} color="secondary" />
          </Tooltip>
          <CircularProgress size={iconsFontSize} color="secondary" />
        </Box>
      );
    case IElevatorRequestStatus.PersonLoading:
      return (
        <Box display="flex" flexWrap="nowrap">
          <Tooltip title="Loading person">
            <Box component="span" display="flex" flexWrap="nowrap">
              <HourglassTopIcon sx={{ fontSize: iconsFontSize }} color="warning" />
              <PersonIcon sx={{ fontSize: iconsFontSize }} color="warning" />
            </Box>
          </Tooltip>
          <CircularProgress size={iconsFontSize} color="warning" />
        </Box>
      );
    case IElevatorRequestStatus.ElevatorReachingTarget:
      return (
        <Box display="flex" flexWrap="nowrap">
          <Tooltip title="Elevator is reaching target floor">
            <FastForwardIcon sx={{ fontSize: iconsFontSize }} color="secondary" />
          </Tooltip>
          <CircularProgress size={iconsFontSize} color="secondary" />
        </Box>
      );
    case IElevatorRequestStatus.PersonUnloading:
      return (
        <Box display="flex" flexWrap="nowrap">
          <Tooltip title="Unloading person">
            <Box component="span" display="flex" flexWrap="nowrap">
              <HourglassBottomIcon sx={{ fontSize: iconsFontSize }} color="warning" />
              <PersonIcon sx={{ fontSize: iconsFontSize }} color="warning" />
            </Box>
          </Tooltip>
          <CircularProgress size={iconsFontSize} color="warning" />
        </Box>
      );
    case IElevatorRequestStatus.Finished:
      return (
        <Tooltip title="Finished">
          <DoneIcon sx={{ fontSize: iconsFontSize }} color="success" />
        </Tooltip>
      );
    case IElevatorRequestStatus.Pending:
      return (
        <Tooltip title="Pending">
          <PendingIcon sx={{ fontSize: iconsFontSize }} color="primary" />
        </Tooltip>
      );
    default:
      return null;
  }
};

export default RequestStatusReporter;
