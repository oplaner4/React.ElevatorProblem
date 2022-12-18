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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { predefinedBuildings } from 'app/data/buildings';
import Chip from '@mui/material/Chip';
import { getNewId } from 'app/utils/data/idIncrementer';
import { predefinedElevators } from 'app/data/elevators';
import IElevator from 'app/models/IElevator';
import ElevatorProperties from 'app/components/elevator/ElevatorProperties';
import { seedBuilding, seedElevator } from 'app/utils/data/dataSeeder';
import { addRecord, deleteRecord, updateRecord } from 'app/utils/data/dataManipulator';

const BuildingSetter = ({ modelId, onCorrectlySet }: ISetterProps<IBuilding>) => {
  const [buildings, setBuildings] = useRecoilState(buildingsAtom);
  const [elevators, setElevators] = useRecoilState(elevatorsAtom);

  const [data, setData] = useState<IBuilding>(modelId === 0 ? seedBuilding() : { ...buildings[modelId] });

  const [messageContent, setMessageContent] = useState<React.ReactElement | null>(null);
  const [elevatorModalContent, setElevatorModalContent] = useState<JSX.Element | null>(null);
  const [createElevatorModalContent, setCreateElevatorModalContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (modelId > 0) {
      return;
    }

    const newElevator = seedElevator(1);
    setElevators(addRecord(newElevator, elevators));

    const newData = { ...data, elevators: new Set(data.elevators) };
    newData.elevators.add(newElevator.id);
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errorMsg = checkCorrectBuilding(data, elevators);

    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
      return;
    }

    if (modelId === 0) {
      setBuildings(addRecord(data, buildings));
      setData(seedBuilding());
    } else {
      setBuildings(updateRecord(data, buildings));
    }

    onCorrectlySet(data);

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

    setBuildings(
      addRecord(
        {
          ...predefinedBuildings[buildingName],
          elevators: addedElevatorIds,
        },
        buildings
      )
    );
  };

  const handleEditElevator = (model: IElevator) => {
    setElevatorModalContent(null);

    const errorMsg = checkCorrectElevatorForBuilding(model, data);
    if (errorMsg.length > 0) {
      setMessageContent(<>{errorMsg}</>);
    }
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
  };

  const handleDeleteElevator = (id: number) => {
    const newElevatorIds = new Set(data.elevators);
    newElevatorIds.delete(id);

    setData({
      ...data,
      elevators: newElevatorIds,
    });

    setElevators(deleteRecord(id, elevators));
  };

  const handleCloneElevator = (id: number) => {
    const newElevator = { ...elevators[id] };
    setElevators(addRecord(newElevator, elevators));

    const newElevatorIds = new Set(data.elevators);
    newElevatorIds.add(newElevator.id);

    setData({
      ...data,
      elevators: newElevatorIds,
    });
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
        <Grid container spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
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
                      <Box>
                        <ElevatorProperties elevator={elevator} />
                      </Box>
                      <ButtonGroup size="small" sx={{ alignSelf: 'center' }}>
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
                        <Tooltip title="Clone elevator">
                          <Button
                            onClick={() => {
                              handleCloneElevator(id);
                            }}
                            variant="contained"
                            color={'dark' as 'inherit'}
                            size="small"
                          >
                            <ContentCopyIcon />
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
