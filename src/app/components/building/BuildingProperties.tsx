import IBuilding from 'app/models/IBuilding';
import { Tooltip, Typography } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ElevatorIcon from '@mui/icons-material/Elevator';
import HeightIcon from '@mui/icons-material/Height';

const BuildingProperties = ({ building }: { building: IBuilding }) => {
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
        #{building.id}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center">
        <Tooltip title="Count of floors">
          <ApartmentIcon sx={{ mr: 1 }} />
        </Tooltip>
        {building.countFloors}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center">
        <Tooltip title="Count of elevators">
          <ElevatorIcon sx={{ mr: 1 }} />
        </Tooltip>

        {building.elevators.size}
      </Typography>

      <Typography component="span" variant="h6" display="flex" alignItems="center">
        <Tooltip title="Floor height">
          <HeightIcon />
        </Tooltip>
        {building.floorHeight}m
      </Typography>
    </Typography>
  );
};

export default BuildingProperties;
