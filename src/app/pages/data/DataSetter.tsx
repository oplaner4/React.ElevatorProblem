import { Grid, Typography, Box, Button, Tooltip, List, ListItem, ButtonGroup } from '@mui/material';
import AppModal from 'app/components/AppModal';
import { buildingsAtom, elevatorsAtom, peopleAtom } from 'app/state/atom';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import BuildingSetter from '../building/BuildingSetter';
import PersonSetter from '../person/PersonSetter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useNavigate } from 'react-router-dom';
import BuildingProperties from 'app/components/building/BuildingProperties';

const DataSetter = () => {
  const [buildings, setBuildings] = useRecoilState(buildingsAtom);
  const [elevators, setElevators] = useRecoilState(elevatorsAtom);
  const [people, setPeople] = useRecoilState(peopleAtom);

  const [buildingModalContent, setBuildingModalContent] = useState<JSX.Element | null>(null);
  const [personModalContent, setPersonModalContent] = useState<JSX.Element | null>(null);

  const navigate = useNavigate();

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={7} lg={8}>
          <Typography component="h2" variant="h5" color="primary.main">
            Buildings
          </Typography>

          <List sx={{ overflow: 'auto', maxHeight: 200 }}>
            {Object.keys(buildings).length === 0 ? (
              <ListItem>
                <Typography variant="h6" component="p" color="dark.main">
                  No buildings created yet.
                </Typography>
              </ListItem>
            ) : (
              Object.keys(buildings).map((sid) => {
                const id = Number(sid);
                const building = buildings[id];

                return (
                  <ListItem key={id}>
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap" width="100%">
                      <Box>
                        <BuildingProperties building={building} />
                      </Box>

                      <ButtonGroup size="small">
                        <Tooltip title="Edit building">
                          <Button
                            onClick={() =>
                              setBuildingModalContent(
                                <BuildingSetter
                                  modelId={id}
                                  onCorrectlySet={() => {
                                    setBuildingModalContent(null);
                                  }}
                                />
                              )
                            }
                            variant="contained"
                            color="secondary"
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete building">
                          <Button
                            onClick={() => {
                              const newElevators = { ...elevators };
                              buildings[id].elevators.forEach((elevatorId) => {
                                delete newElevators[elevatorId];
                              });
                              setElevators(newElevators);
                              const newBuildings = { ...buildings };
                              delete newBuildings[id];
                              setBuildings(newBuildings);
                            }}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="View building">
                          <Button
                            onClick={() => {
                              navigate(`/viewer?id=${id}`);
                            }}
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Usage of building">
                          <Button
                            onClick={() => {
                              navigate(`/usage?id=${id}`);
                            }}
                            variant="contained"
                            color={'dark' as 'inherit'}
                            size="small"
                          >
                            <AccessTimeIcon />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </Box>
                  </ListItem>
                );
              })
            )}
          </List>
        </Grid>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <Typography component="h2" variant="h5" color="primary.main">
            People
          </Typography>
          <List sx={{ overflow: 'auto', maxHeight: 200 }}>
            {Object.keys(people).length === 0 ? (
              <ListItem>
                <Typography variant="h6" component="p" color="dark.main">
                  No people created yet.
                </Typography>
              </ListItem>
            ) : (
              Object.keys(people).map((sid) => {
                const id = Number(sid);
                const person = people[id];

                return (
                  <ListItem key={id}>
                    <Box display="flex" justifyContent="space-between" width="100%" flexWrap="wrap">
                      <Typography component="span" variant="h6" color="dark.main">
                        #{person.id}, {person.alias}
                      </Typography>

                      <ButtonGroup size="small">
                        <Tooltip title="Edit person">
                          <Button
                            onClick={() =>
                              setPersonModalContent(
                                <PersonSetter
                                  modelId={id}
                                  onCorrectlySet={() => {
                                    setPersonModalContent(null);
                                  }}
                                />
                              )
                            }
                            variant="contained"
                            color="secondary"
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete person">
                          <Button
                            onClick={() => {
                              const newPeople = { ...people };
                              delete newPeople[id];
                              setPeople(newPeople);
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
          </List>
        </Grid>
        <Grid item xs={12} sm={6} md={7} lg={8}>
          <Box mb={2}>
            <Typography component="h2" variant="h5" color="primary.main">
              Create building
            </Typography>
          </Box>

          <BuildingSetter modelId={0} onCorrectlySet={() => {}} />
        </Grid>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <Box mb={2}>
            <Typography component="h2" variant="h5" color="primary.main">
              Create person
            </Typography>
          </Box>

          <PersonSetter modelId={0} onCorrectlySet={() => {}} />
        </Grid>
      </Grid>
      <AppModal
        title={'Edit building'}
        content={buildingModalContent}
        onClose={setBuildingModalContent}
        ariaPrefix={'edit-building'}
      />
      <AppModal
        title={'Edit person'}
        content={personModalContent}
        onClose={setPersonModalContent}
        ariaPrefix={'edit-person'}
      />
    </Box>
  );
};

export default DataSetter;
