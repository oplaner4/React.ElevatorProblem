import { Alert, Box, Button, TextField } from '@mui/material';
import IPerson from 'app/models/IPerson';
import ISetterProps from 'app/models/ISetterProps';
import { peopleAtom } from 'app/state/atom';
import { getNewId } from 'app/utils/data/idIncrementer';
import { checkCorrectPerson, checkCorrectPersonWithinPeople } from 'app/utils/data/modelsChecker';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export const defaultPerson: IPerson = {
  id: 0,
  alias: '',
  currentBuildingId: null,
  currentFloor: 0,
};

const PersonSetter = ({ modelId, onCorrectlySet }: ISetterProps<IPerson>) => {
  const [people, setPeople] = useRecoilState(peopleAtom);
  const [data, setData] = useState<IPerson>(modelId === 0 ? defaultPerson : { ...people[modelId] });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modelId === 0) {
      data.id = getNewId(people);
    }

    let errorMsg = checkCorrectPerson(data);

    if (errorMsg.length === 0) {
      errorMsg = checkCorrectPersonWithinPeople(data, people);
    }

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    const newPeople = { ...people };
    newPeople[data.id] = data;
    setPeople(newPeople);
    onCorrectlySet(data);
    setData(defaultPerson);
  };

  return (
    <Box>
      {messageContent === null ? null : (
        <Box component={Alert} mb={3} severity="error">
          {messageContent}
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate mt={1}>
        {modelId === 0 ? null : (
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
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          label="Alias"
          name="alias"
          value={data.alias}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setData({
              ...data,
              alias: e.currentTarget.value,
            })
          }
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {modelId === 0 ? 'Create' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default PersonSetter;
