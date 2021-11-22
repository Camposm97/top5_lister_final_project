import { useContext } from 'react'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
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
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair } = props;

    // function handleLoadList(event, id) {
    //     if (!event.target.disabled) {
    //         store.setCurrentList(id);
    //     }
    // }
    function like(event) {
        event.stopPropagation()
    }
    function dislike(event) {
        event.stopPropagation()
    }
    function edit(event) {
        event.stopPropagation()
        store.setCurrentList(idNamePair._id)
    }
    async function handleDeleteList(event, id) {
        event.stopPropagation()
        store.markListForDeletion(id).then(() => {
            props.setShowAlertCallback(true)
            props.setListNameCallback(idNamePair.name)
        })
    }
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid container direction='column'>
                    <ListItem disabled={store.isListNameEditActive} >
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h6'>
                                {idNamePair.name}
                            </Typography>
                        </Box>
                        <IconButton onClick={like}>
                            <ThumbUpIcon color='primary' fontSize='large' />
                        </IconButton>
                        <IconButton onClick={dislike}>
                            <ThumbDownIcon color='secondary' fontSize='large' />
                        </IconButton>
                        <IconButton
                            onClick={(event) => { handleDeleteList(event, idNamePair._id) }}>
                            <DeleteForeverIcon fontSize='large' style={{ color: 'red' }} />
                        </IconButton>
                    </ListItem>
                    <ListItem>
                        <Typography variant='body1'>
                            By {auth.user.username}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Button variant='text' sx={{ fontSize: '8pt' }} onClick={edit}>Edit</Button>
                    </ListItem>
                </Grid >
            </AccordionSummary>
            <AccordionDetails>
                <ListItem>
                    <Typography>TODO</Typography>
                </ListItem>
            </AccordionDetails>
        </Accordion >
    )
}