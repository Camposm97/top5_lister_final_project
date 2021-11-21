import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Accordion, Button, Grid, Typography } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMore from '@mui/icons-material/ExpandMore'

export default function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id).then(() => {
            props.setShowAlertCallback(true)
            props.setListNameCallback(idNamePair.name)
        })
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let newText = event.target.value
            if (newText === '') {
                newText = 'Untitled'
            }
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, newText);
            toggleEdit();
        }
    }        
    if (editActive) {
        return (
            <TextField
                margin="normal"
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                autoComplete="Top 5 List Name"
                onKeyPress={handleKeyPress}
                defaultValue={idNamePair.name}
                InputProps={{ style: { fontSize: '18pt' } }}
                InputLabelProps={{ style: { fontSize: '18pt' } }}
                autoFocus
            />
        )
    }
    return (
        <Accordion>
            <AccordionSummary  expandIcon={<ExpandMore />}>
                <Grid container direction='column' spacing={0}>
                    <ListItem
                        disabled={store.isListNameEditActive}
                        id={idNamePair._id}
                        key={idNamePair._id}
                        onClick={(event) => {
                            handleLoadList(event, idNamePair._id)
                        }}
                        style={{ fontSize: '18pt' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h5'>{idNamePair.name}</Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <ThumbUpIcon color='primary' fontSize='large' />
                            </IconButton>
                        </Box >
                        <Box>
                            <IconButton>
                                <ThumbDownIcon color='secondary' fontSize='large' />
                            </IconButton>
                        </Box >
                        <Box>
                            <IconButton
                                onClick={(event) => { handleDeleteList(event, idNamePair._id) }}>
                                <DeleteForeverIcon fontSize='large' style={{ color: 'red' }} />
                            </IconButton>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <Button variant='contained' sx={{ fontSize: '8pt' }} 
                        onClick={function(event) {
                            event.stopPropagation();
                            
                        }}>Edit</Button>
                    </ListItem>
                </Grid >
            </AccordionSummary>
            <AccordionDetails>
                TODO
            </AccordionDetails>
        </Accordion>
    )
}