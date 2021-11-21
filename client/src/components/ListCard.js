import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Grid } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function ListCard(props) {
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

    let cardElement =
        <Grid container direction='column' spacing={0}
            sx={{
                display: 'flex',
                border: 1,
                borderRadius: 5,
                mb: 1,
                backgroundColor: 'white'
            }}
        >
            <ListItem
                disabled={store.isListNameEditActive}
                id={idNamePair._id}
                key={idNamePair._id}
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
                style={{ fontSize: '18pt' }}>
                <Box sx={{ flexGrow: 1 }}>
                    {idNamePair.name}
                </Box>
                <Box>
                    <IconButton>
                        <ThumbUpIcon fontSize='large' />
                    </IconButton>
                </Box >
                <Box>
                    <IconButton>
                        <ThumbDownIcon fontSize='large' />
                    </IconButton>
                </Box >
                <Box>
                    <IconButton
                        onClick={(event) => { handleDeleteList(event, idNamePair._id) }}>
                        <DeleteIcon fontSize='large' />
                    </IconButton>
                </Box>
            </ListItem>
            <ListItem>
                <Button variant='contained' sx={{ fontSize: '8pt' }} onClick={handleToggleEdit}>Edit</Button>
            </ListItem>
        </Grid>
    if (editActive) {
        cardElement =
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
    }
    return (
        cardElement
    );
}

export default ListCard;