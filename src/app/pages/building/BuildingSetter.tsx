import { Alert, Box, Button, ButtonGroup, Grid, List, ListItem, TextField, Tooltip, Typography } from '@mui/material';
import AppModal from 'app/components/AppModal';
import IBuilding from 'app/models/IBuilding';
import ISetterProps from 'app/models/ISetterProps';
import { buildingsAtom, elevatorsAtom } from 'app/state/atom';
import { checkCorrectBuilding, checkCorrectElevatorForBuilding } from 'app/utils/data/modelsChecker';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import ElevatorSetter from '../elevator/ElevatorSetter';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { predefinedBuildings } from 'app/data/buildings';
import Chip from '@mui/material/Chip';
import { getNewId } from 'app/utils/data/idIncrementer';
import { predefinedElevators } from 'app/data/elevators';
import IElevator from 'app/models/IElevator';

export const defaultBuilding: IBuilding = {
  id: 0,
  countFloors: 2,
  floorHeight: 5,
  elevators: new Set(),
};

const BuildingSetter = ({ modelId, onCorrectlySet }: ISetterProps<IBuilding>) => {
  const [buildings, setBuildings] = useRecoilState(buildingsAtom);
  const [elevators, setElevators] = useRecoilState(elevatorsAtom);

  const [data, setData] = useState<IBuilding>(modelId === 0 ? { ...defaultBuilding } : { ...buildings[modelId] });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);
  const [elevatorModalContent, setElevatorModalContent] = useState<JSX.Element | null>(null);
  const [createElevatorModalContent, setCreateElevatorModalContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (modelId > 0) {
      return;
    }

    const newElevators = { ...elevators };
    const newId = getNewId(elevators);
    newElevators[newId] = {
      id: newId,
      currentFloor: 0,
      highestFloor: 1,
      lowestFloor: 0,
      speed: data.floorHeight / 2,
    };
    setElevators(newElevators);

    const newData = { ...data, elevators: new Set(data.elevators) };
    newData.elevators.add(newId);
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modelId === 0) {
      data.id = getNewId(buildings);
    }

    const errorMsg = checkCorrectBuilding(data, elevators);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    const newBuildings = { ...buildings };
    newBuildings[data.id] = data;
    setBuildings(newBuildings);
    onCorrectlySet(data);
    setData({ ...defaultBuilding });
    setMessageContent(null);
  };

  const handleCreatePredefined = (buildingName: string) => {
    const newElevators = { ...elevators };
    const addedElevatorIds: Set<number> = new Set();
    predefinedElevators[buildingName].forEach((e) => {
      const el = { ...e };
      el.id = getNewId(newElevators);
      newElevators[el.id] = el;
      addedElevatorIds.add(el.id);
    });
    setElevators(newElevators);

    const predefinedBuilding = predefinedBuildings[buildingName];
    const newBuildings = { ...buildings };
    const newId = getNewId(buildings);
    newBuildings[newId] = {
      ...predefinedBuilding,
      id: newId,
      elevators: addedElevatorIds,
    };
    setBuildings(newBuildings);
  };

  const handleEditElevator = (model: IElevator) => {
    setElevatorModalContent(null);

    const errorMsg = checkCorrectElevatorForBuilding(model, data);
    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    const newElevators = new Set(data.elevators);
    newElevators.add(model.id);

    setData({
      ...data,
      elevators: newElevators,
    });
  };

  const handleCreateElevator = (model: IElevator) => {
    setCreateElevatorModalContent(null);

    const errorMsg = checkCorrectElevatorForBuilding(model, data);
    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    const newElevatorIds = new Set(data.elevators);
    newElevatorIds.add(model.id);

    setData({
      ...data,
      elevators: newElevatorIds,
    });

    const newElevators = { ...elevators };
    newElevators[model.id] = model;
    setElevators(newElevators);
  };

  const handleDeleteElevator = (id: number) => {
    const newElevatorIds = new Set(data.elevators);
    newElevatorIds.delete(id);

    setData({
      ...data,
      elevators: newElevatorIds,
    });

    const newElevators = { ...elevators };
    delete newElevators[id];
    setElevators(newElevators);
  };

  return (
    <Box>
      {messageContent === null ? null : (
        <Box component={Alert} mb={3} severity="error">
          {messageContent}
        </Box>
      )}

      {modelId === 0 ? (
        <Box mb={1}>
          <Typography component="h3" variant="h6" color="secondary.main">
            Predefined
          </Typography>
          <Box mb={2} mt={1}>
            {Object.keys(predefinedBuildings).map((buildingName) => {
              return (
                <Chip
                  onClick={() => {
                    handleCreatePredefined(buildingName);
                  }}
                  key={buildingName}
                  variant="filled"
                  color={'info'}
                  label={buildingName}
                  sx={{ mr: 1 }}
                />
              );
            })}
          </Box>

          <Typography component="h3" variant="h6" color="secondary.main">
            Custom
          </Typography>
        </Box>
      ) : null}

      <Box component="form" onSubmit={handleSubmit} noValidate>
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
              label="Count of floors"
              name="countFloors"
              type="number"
              inputProps={{
                min: 2,
                step: 1,
              }}
              value={data.countFloors}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const parsed = parseInt(e.currentTarget.value);
                setData({
                  ...data,
                  countFloors: isNaN(parsed) ? 0 : parsed,
                });
              }}
            />
          </Grid>
          <Grid item lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Floor height (metres)"
              name="floorHeight"
              type="number"
              value={data.floorHeight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const parsed = parseFloat(e.currentTarget.value);
                setData({
                  ...data,
                  floorHeight: isNaN(parsed) ? 0 : parsed,
                });
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ overflow: 'auto', maxHeight: 200 }} mt={3}>
          <Box display="flex" justifyContent="space-between" mb={2} mx={2}>
            <Typography component="h3" variant="h6" color="info.main">
              Elevators
            </Typography>
            <Tooltip title="Add elevator">
              <Button
                onClick={() =>
                  setCreateElevatorModalContent(
                    <ElevatorSetter
                      highestFloor={data.countFloors - 1}
                      modelId={0}
                      onCorrectlySet={handleCreateElevator}
                    />
                  )
                }
                variant="contained"
                color="info"
              >
                <AddIcon /> Add
              </Button>
            </Tooltip>
          </Box>

          <Box component={List} mb={3}>
            {data.elevators.size === 0 ? (
              <ListItem>
                <Typography variant="subtitle1" component="p" color="dark.main">
                  No elevators created yet. At least one elevator must be added.
                </Typography>
              </ListItem>
            ) : (
              Array.from(data.elevators).map((id) => {
                const elevator = elevators[id];

                return (
                  <ListItem key={id}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography component="span" variant="subtitle1" color="dark.main">
                        #{elevator.id}, currently in {elevator.currentFloor}, max. {elevator.highestFloor}, min.{' '}
                        {elevator.lowestFloor}, speed {elevator.speed}m/s
                      </Typography>
                      <ButtonGroup size="small">
                        <Tooltip title="Edit elevator">
                          <Button
                            onClick={() =>
                              setElevatorModalContent(
                                <ElevatorSetter modelId={id} onCorrectlySet={handleEditElevator} />
                              )
                            }
                            variant="contained"
                            color="secondary"
                            size="small"
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete elevator">
                          <Button
                            onClick={() => {
                              handleDeleteElevator(id);
                            }}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </Box>
                  </ListItem>
                );
              })
            )}
          </Box>
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
          {modelId === 0 ? 'Create' : 'Save'}
        </Button>
      </Box>

      <AppModal
        title={'Create elevator'}
        content={createElevatorModalContent}
        onClose={setCreateElevatorModalContent}
        ariaPrefix={'create-elevator'}
      ></AppModal>
      <AppModal
        title={'Edit elevator'}
        content={elevatorModalContent}
        onClose={setElevatorModalContent}
        ariaPrefix={'edit-elevator'}
      ></AppModal>
    </Box>
  );
};

export default BuildingSetter;
