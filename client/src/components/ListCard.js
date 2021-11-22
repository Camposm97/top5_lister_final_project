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
    const { top5List } = props;

    function like(event) {
        event.stopPropagation()
        store.likeTop5List(top5List)
    }
    function dislike(event) {
        event.stopPropagation()
        store.dislikeTop5List(top5List)
    }
    function edit(event) {
        event.stopPropagation()
        store.setCurrentList(top5List._id)
    }
    function handleDeleteList(event, id) {
        event.stopPropagation()
        store.markListForDeletion(id)
    }

    function formatDate() {
        let date = new Date(top5List.publishDate)
        let strDate = null
        switch (date.getUTCMonth()) {
            case 0:
                strDate = 'Jan'
                break;
            case 1:
                strDate = 'Feb'
                break;
            case 2:
                strDate = 'Mar'
                break;
            case 3:
                strDate = 'Apr'
                break;
            case 4:
                strDate = 'May'
                break;
            case 5:
                strDate = 'Jun'
                break;
            case 6:
                strDate = 'Jul'
                break;
            case 7:
                strDate = 'Aug'
                break;
            case 8:
                strDate = 'Sep'
                break;
            case 9:
                strDate = 'Oct'
                break;
            case 10:
                strDate = 'Nov'
                break;
            case 11:
                strDate = 'Dec'
                break;
            default:
                strDate = null
        }
        strDate = strDate + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
        return strDate
    }

    let elementA =
        <ListItem>
            <Button variant='text' sx={{ fontSize: '8pt' }} onClick={edit}>Edit</Button>
        </ListItem>
    let socialElements = <Box></Box>
    let accordionDetailsElement = <Box></Box>
    if (top5List.isPublished) {
        elementA =
            <ListItem>
                <Typography variant='caption' fontWeight='fontWeightBold'>Published:</Typography>
                <Typography variant='caption' marginLeft={1} color='green'>{formatDate()}</Typography>
            </ListItem>
        socialElements =
            <Box>
                <IconButton onClick={like}>
                    <ThumbUpIcon color='primary' fontSize='large' />
                    <Typography variant='h6' marginLeft={1} >{top5List.likes.length}</Typography>
                </IconButton>
                <IconButton onClick={dislike}>
                    <ThumbDownIcon color='secondary' fontSize='large' />
                    <Typography variant='h6' marginLeft={1} >{top5List.dislikes.length}</Typography>
                </IconButton>
            </Box>
        accordionDetailsElement = <AccordionDetails></AccordionDetails>
    }
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid container direction='column'>
                    <ListItem >
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h6' fontWeight='fontWeightBold' >
                                {top5List.name}
                            </Typography>
                        </Box>
                        {socialElements}
                        <IconButton
                            onClick={(event) => { handleDeleteList(event, top5List._id) }}>
                            <DeleteForeverIcon fontSize='large' style={{ color: 'red' }} />
                        </IconButton>
                    </ListItem>
                    <ListItem>
                        <Typography variant='body1'>
                            By {auth.user.username}
                        </Typography>
                    </ListItem>
                    {elementA}
                </Grid >
            </AccordionSummary>
            {accordionDetailsElement}
        </Accordion >
    )
}