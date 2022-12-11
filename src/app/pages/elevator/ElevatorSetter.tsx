import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import IElevator from 'app/models/IElevator';
import ISetterProps from 'app/models/ISetterProps';
import { elevatorsAtom } from 'app/state/atom';
import { getNewId } from 'app/utils/data/idIncrementer';
import { checkCorrectElevator } from 'app/utils/data/modelsChecker';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export interface ElevatorSetterProps extends ISetterProps<IElevator> {
  highestFloor?: number;
}

const ElevatorSetter = ({ highestFloor, modelId, onCorrectlySet }: ElevatorSetterProps) => {
  const defaultData: IElevator = {
    id: 0,
    lowestFloor: 0,
    highestFloor: highestFloor ?? 1,
    currentFloor: 0,
    speed: 2.5,
    inService: false,
    maxCountPeople: 10,
  };

  const [elevators, setElevators] = useRecoilState(elevatorsAtom);

  const [data, setData] = useState<IElevator>(modelId === 0 ? { ...defaultData } : { ...elevators[modelId] });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);

  const handleSubmit = () => {
    if (modelId === 0) {
      data.id = getNewId(elevators);
    }

    const errorMsg = checkCorrectElevator(data);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    const newElevators = { ...elevators };
    newElevators[data.id] = data;
    setElevators(newElevators);
    onCorrectlySet(data);
    setData({ ...defaultData });
    setMessageContent(null);
  };

  return (
    <Box>
      {messageContent === null ? null : (
        <Box component={Alert} mb={3} severity="error">
          {messageContent}
        </Box>
      )}

      <Box mb={2}>
        <Typography component="p" variant="subtitle2" color="info.main">
          Note: the lowest possible floor (zero) is called{' '}
          <Typography component="span" fontWeight="bold" fontSize="inherit">
            ground
          </Typography>{' '}
          and the highest possible floor is{' '}
          <Typography component="span" fontWeight="bold" fontSize="inherit">
            one less than
          </Typography>{' '}
          the count of floors set in the building.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {modelId === 0 ? null : (
          <Grid item lg={12}>
            <TextField
              margin="normal"
              fullWidth
              label="Id"
              name="id"
              value={data.id}
              InputProps={{
                readOnly: true,
              }}
              variant="filled"
            />
          </Grid>
        )}
        <Grid item lg={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="The current floor"
            name="currentFloor"
            type="number"
            inputProps={{
              min: 0,
              step: 1,
            }}
            value={data.currentFloor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseInt(e.currentTarget.value);
              setData({
                ...data,
                currentFloor: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="The highest floor"
            name="highestFloor"
            type="number"
            inputProps={{
              min: 0,
              step: 1,
            }}
            value={data.highestFloor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseInt(e.currentTarget.value);
              setData({
                ...data,
                highestFloor: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Max. count of people"
            name="maxCountPeople"
            type="number"
            inputProps={{
              min: 1,
              step: 1,
            }}
            value={data.maxCountPeople}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseInt(e.currentTarget.value);
              setData({
                ...data,
                maxCountPeople: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
        </Grid>

        <Grid item lg={6}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="The lowest floor"
            name="lowestFloor"
            type="number"
            inputProps={{
              min: 0,
              step: 1,
            }}
            value={data.lowestFloor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseInt(e.currentTarget.value);
              setData({
                ...data,
                lowestFloor: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Speed (metres per second)"
            name="speed"
            type="number"
            inputProps={{
              min: 0,
              step: 1,
            }}
            value={data.speed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const parsed = parseFloat(e.currentTarget.value);
              setData({
                ...data,
                speed: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
        </Grid>
      </Grid>

      <Box textAlign="right">
        <Button size="small" onClick={() => handleSubmit()} variant="contained" sx={{ mt: 1, mb: 2 }} color="info">
          {modelId === 0 ? 'Create' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default ElevatorSetter;
