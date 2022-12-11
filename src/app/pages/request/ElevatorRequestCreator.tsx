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
import IElevatorRequest, { IElevatorRequestStatus } from 'app/models/IElevatorRequest';
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom } from 'app/state/atom';
import { getRunnableElevators } from 'app/utils/data/elevatorSuitability';
import { getNewId } from 'app/utils/data/idIncrementer';
import { checkCorrectPersonWithinRequest } from 'app/utils/data/modelsChecker';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export interface ElevatorRequestCreatorProps {
  buildingId: number;
  onCreated: (request: IElevatorRequest) => void;
}

const defaultData: IElevatorRequest = {
  id: 0,
  loadFloor: 0,
  targetFloor: 1,
  timeRequested: new Date(),
  personId: 0,
  status: IElevatorRequestStatus.Created,
};

const ElevatorRequestCreator = ({ buildingId, onCreated }: ElevatorRequestCreatorProps) => {
  const [people, setPeople] = useRecoilState(peopleAtom);
  const [requests, setRequests] = useRecoilState(requestsAtom);
  const buildings = useRecoilValue(buildingsAtom);
  const elevators = useRecoilValue(elevatorsAtom);

  const [data, setData] = useState<IElevatorRequest>({ ...defaultData });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!(data.personId in people)) {
      setMessageContent(<>No person selected.</>);
      return;
    }

    const person = people[data.personId];
    data.id = getNewId(requests);
    data.timeRequested = new Date();
    data.loadFloor = person.currentBuildingId === null ? 0 : person.currentFloor;
    const errorMsg = checkCorrectPersonWithinRequest(person, data);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    if (data.targetFloor >= buildings[buildingId].countFloors) {
      setMessageContent(<>The target floor must be smaller than the count of floors in the building.</>);
      return;
    }

    if (getRunnableElevators(buildings[buildingId], elevators, data).length === 0) {
      setMessageContent(<>No such elevator.</>);
      return;
    }

    if (
      Object.keys(requests).some((sid) => {
        const request = requests[Number(sid)];
        return request.status !== IElevatorRequestStatus.Finished && request.personId === data.personId;
      })
    ) {
      setMessageContent(<>The person currently requests.</>);
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
            max: buildings[buildingId].countFloors - 1,
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

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default ElevatorRequestCreator;
