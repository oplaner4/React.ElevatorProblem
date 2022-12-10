import {
  Alert,
  Box,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import IElevatorRequest from 'app/models/IElevatorRequest';
import { buildingsAtom, peopleAtom, requestsAtom } from 'app/state/atom';
import { getNewId } from 'app/utils/data/idIncrementer';
import { checkCorrectPersonWithinRequest } from 'app/utils/data/modelsChecker';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export interface ElevatorRequestCreatorProps {
  buildingId: number;
  onCreated: (request: IElevatorRequest) => void;
}

const defaultData = {
  id: 0,
  targetFloor: 1,
  timeRequested: new Date(),
  personId: 0,
};

const ElevatorRequestCreator = ({ buildingId, onCreated }: ElevatorRequestCreatorProps) => {
  const [people, setPeople] = useRecoilState(peopleAtom);
  const [requests, setRequests] = useRecoilState(requestsAtom);
  const buildings = useRecoilValue(buildingsAtom);

  const [data, setData] = useState<IElevatorRequest>({ ...defaultData });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    data.id = getNewId(requests);
    data.timeRequested = new Date();

    if (!(data.personId in people)) {
      setMessageContent(<>No person selected.</>);
      return;
    }

    const errorMsg = checkCorrectPersonWithinRequest(people[data.personId], data);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    if (data.targetFloor >= buildings[buildingId].countFloors) {
      setMessageContent(<>The target floor must be smaller than the count of floors in the building.</>);
      return;
    }

    const newRequests = { ...requests };
    newRequests[data.id] = data;
    setRequests(newRequests);
    onCreated(data);
    setData({ ...defaultData });

    const newPeople = { ...people };
    newPeople[data.personId] = {
      ...newPeople[data.personId],
      currentBuildingId: buildingId,
    };
    setPeople(newPeople);
    setMessageContent(null);
  };

  return (
    <Box>
      {messageContent === null ? null : (
        <Box component={Alert} mb={3} severity="error">
          {messageContent}
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate mt={1}>
        <FormControl fullWidth>
          <InputLabel id="select-person-label">Person</InputLabel>
          <Select
            labelId="select-person-label"
            id="select-person"
            value={data.personId === 0 ? '' : data.personId}
            label="Age"
            onChange={(event: SelectChangeEvent<number>) => {
              setData({
                ...data,
                personId: event.target.value as number,
              });
            }}
          >
            {Object.keys(people).map((sid) => {
              const personId = Number(sid);
              return (
                <MenuItem key={personId} value={personId}>
                  {people[personId].alias}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          label="The target floor"
          name="targetFloor"
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={data.targetFloor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const parsed = parseInt(e.currentTarget.value);
            setData({
              ...data,
              targetFloor: isNaN(parsed) ? 0 : parsed,
            });
          }}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ElevatorRequestCreator;
