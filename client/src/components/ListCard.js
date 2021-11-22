import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import { List, Card, CardContent,  Accordion, Button, Grid, Typography, TextField } from '@mui/material';
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
    const { top5List, expanded, handleAccorChangeCallback } = props;

    function addComment(event) {
        if (event.key === 'Enter') {
            let comment = event.target.value
            if (comment) {
                store.addComment(top5List, comment)
                event.target.value = ''
            }
        }
    }
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
    function view(event) {
        if (top5List.isPublished && !expanded) {
            store.view(top5List)
        }
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
    let accorDetailsElement = <Box></Box>
    if (top5List.isPublished) {
        let i = 0
        elementA =
            <ListItem>
                <Typography variant='caption' fontWeight='fontWeightBold'>Published:</Typography>
                <Typography flex={1} variant='caption' marginLeft={1} color='green'>{formatDate()}</Typography>
                <Typography variant='caption' fontWeight='fontWeightBold'>Views:</Typography>
                <Typography variant='caption' marginLeft={1} marginRight={15} color='red'>{top5List.views}</Typography>
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
        let j = 0
        accorDetailsElement =
            <AccordionDetails>
                <Grid container direction='row'>
                    <Card style={{ flex: 1 }}>
                        <List>
                            {top5List.items.map(item => (
                                <ListItem key={'item-pub-' + i}>
                                    <Typography variant='h5' >{(++i) + '. ' + item}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                    <Grid sx={{ flex: 1, marginLeft: 2 }}>
                        <List sx={{ marginBottom: 5, height: 250, overflow: 'auto' }}>
                            {top5List.comments.map(comment => (
                                <ListItem key={'comment-' + (j++)}>
                                    <Card sx={{flex: 1}}>
                                        <CardContent>
                                        <Typography variant='caption' color='blue'>{comment.username}</Typography>
                                        <Typography variant='body2'>{comment.message}</Typography>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                        <TextField label='Add Comment' onKeyPress={addComment} fullWidth />
                    </Grid>
                </Grid>
            </AccordionDetails>
    }
    return (
        <Accordion
            expanded={expanded === top5List._id}
            onChange={handleAccorChangeCallback(top5List._id)}
            onClick={view}>
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
                        <Typography variant='caption'>
                            By {top5List.owner}
                        </Typography>
                    </ListItem>
                    {elementA}
                </Grid >
            </AccordionSummary>
            {accorDetailsElement}
        </Accordion >
    )
}