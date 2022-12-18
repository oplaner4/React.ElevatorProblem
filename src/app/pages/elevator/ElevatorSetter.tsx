import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import IElevator from 'app/models/IElevator';
import ISetterProps from 'app/models/ISetterProps';
import { elevatorsAtom } from 'app/state/atom';
import { addRecord, updateRecord } from 'app/utils/data/dataManipulator';
import { seedElevator } from 'app/utils/data/dataSeeder';
import { getNewId } from 'app/utils/data/idIncrementer';
import { checkCorrectElevator } from 'app/utils/data/modelsChecker';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export interface ElevatorSetterProps extends ISetterProps<IElevator> {
  highestFloor?: number;
}

const ElevatorSetter = ({ highestFloor, modelId, onCorrectlySet }: ElevatorSetterProps) => {
  const [elevators, setElevators] = useRecoilState(elevatorsAtom);

  const [data, setData] = useState<IElevator>(modelId === 0 ? seedElevator(highestFloor) : { ...elevators[modelId] });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);

  const handleSubmit = () => {
    const errorMsg = checkCorrectElevator(data);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    if (modelId === 0) {
      setElevators(addRecord(data, elevators));
      setData(seedElevator(highestFloor));
    } else {
      setElevators(updateRecord(data, elevators));
    }

    onCorrectlySet(data);
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
              const value = isNaN(parsed) ? 0 : parsed;
              setData({
                ...data,
                highestFloor: value,
                currentFloor: data.currentFloor > value ? value : data.currentFloor,
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
              const value = isNaN(parsed) ? 0 : parsed;

              setData({
                ...data,
                lowestFloor: value,
                currentFloor: data.currentFloor < value ? value : data.currentFloor,
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
