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
import { buildingsAtom, elevatorsAtom, peopleAtom, requestsAtom } from 'app/state/atom';
import { addRecord, modifyRecord } from 'app/utils/data/dataManipulator';
import { seedRequest } from 'app/utils/data/dataSeeder';
import { canElevatorSatisfyRequest, chooseBestElevator } from 'app/utils/data/elevatorSuitability';
import { checkCorrectPersonWithinRequest } from 'app/utils/data/modelsChecker';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export interface ElevatorRequestCreatorProps {
  buildingId: number;
  onCreated: (requestId: number) => void;
}

const ElevatorRequestCreator = ({ buildingId, onCreated }: ElevatorRequestCreatorProps) => {
  const [people, setPeople] = useRecoilState(peopleAtom);
  const [requests, setRequests] = useRecoilState(requestsAtom);
  const [buildings, setBuildings] = useRecoilState(buildingsAtom);
  const elevators = useRecoilValue(elevatorsAtom);

  const [data, setData] = useState<IElevatorRequest>(seedRequest());

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<number>(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!(data.personId in people)) {
      setMessageContent(<>No person selected.</>);
      return;
    }

    const person = people[data.personId];
    data.timeRequested = new Date();
    data.loadFloor = person.currentBuildingId === null ? 0 : person.currentFloor;

    if (person.isRequesting) {
      setMessageContent(<>The person currently requests.</>);
      return;
    }

    const errorMsg = checkCorrectPersonWithinRequest(person, data);
    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    if (data.targetFloor >= buildings[buildingId].countFloors) {
      setMessageContent(<>The target floor must be smaller than the count of floors in the building.</>);
      return;
    }

    if (Array.from(buildings[buildingId].elevators).every((e) => !canElevatorSatisfyRequest(elevators[e], data))) {
      setMessageContent(<>Invalid target floor.</>);
      return;
    }

    data.elevatorId = chooseBestElevator(buildings[buildingId], data, elevators, requests);
    setRequests(addRecord(data, requests));

    setPeople(
      modifyRecord(
        data.personId,
        (model) => {
          model.currentBuildingId = buildingId;
          model.isRequesting = true;
        },
        people
      )
    );

    setCreatedRequestId(data.id);

    setBuildings(
      modifyRecord(
        buildingId,
        (model) => {
          model.requests = new Set(buildings[buildingId].requests);
          model.requests.add(data.id);
        },
        buildings
      )
    );

    setData(seedRequest());
    setMessageContent(null);
  };

  useEffect(() => {
    if (createdRequestId > 0) {
      onCreated(createdRequestId);
      setCreatedRequestId(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

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
