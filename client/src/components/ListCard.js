import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import { List, Card, CardContent, Accordion, Button, Grid, Typography, TextField } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMore from '@mui/icons-material/ExpandMore'
import Top5ItemCard from './Top5ItemCard';
import QueryContext, { QUERY_TYPE } from '../query';
import AuthContext from '../auth';
import { formatDate } from '../util/ListCardUtils';

export default function ListCard(props) {
    const { auth } = useContext(AuthContext)
    const { queryState } = useContext(QueryContext)
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
    function view() {
        if (top5List.isPublished && !expanded) {
            store.view(top5List)
        }
    }
    function handleDeleteList(event, id) {
        event.stopPropagation()
        store.markListForDeletion(id)
    }

    let elementA =
        <ListItem>
            <Button variant='text' sx={{ fontSize: '8pt' }} onClick={edit}>Edit</Button>
        </ListItem>
    let socialElements = <Box></Box>
    let accorDetailsElement = <Box></Box>
    switch (queryState.queryType) {
        case QUERY_TYPE.COMMUNITY_LISTS:
            break;
        default:
            if (top5List.isPublished) {
                elementA =
                    <ListItem>
                        <Typography variant='caption' fontWeight='fontWeightBold'>Published:</Typography>
                        <Typography flex={1} variant='caption' marginLeft={1} color='green'>{formatDate(top5List.publishDate)}</Typography>
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
                let i = 0
                let j = 0
                accorDetailsElement =
                    <AccordionDetails>
                        <Grid
                            key={'accor-details-grid-root-' + top5List._id + '-' + props.i}
                            container direction='row'>
                            <Grid
                                key={'accor-details-grid-child-1-' + top5List._id + '-' + props.i}
                                sx={{ flex: 1, mb: 1, boxShadow: 5 }}>
                                <Card>
                                    <CardContent>
                                        <List>
                                            {top5List.items.map(item => (
                                                <Top5ItemCard
                                                    key={'published-item-' + (i)}
                                                    i={(++i)}
                                                    item={item}
                                                />
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid
                                key={'accor-details-grid-child-2-' + top5List._id + '-' + props.i}
                                sx={{ flex: 1, ml: 1 }}>
                                <Grid
                                    key={'accor-details-grid-child-2-1-' + top5List._id + '-' + props.i}
                                    sx={{ ml: 1, mr: 1 }}>
                                    <TextField fullWidth label='Add Comment' onKeyPress={addComment} />
                                </Grid>
                                <Grid
                                    key={'accor-details-grid-child-2-2-' + top5List._id + '-' + props.i}
                                    sx={{ overflow: 'auto', height: 350 }}>
                                    {top5List.comments.map(comment => (
                                        <Card
                                            key={'comment-' + top5List._id + '-' + (j++)} sx={{ flex: 1, m: 1, boxShadow: 5 }}>
                                            <CardContent>
                                                <Typography variant='caption' color='blue'>{comment.username}</Typography>
                                                <Typography variant='body2'>{comment.message}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
            }

    }
    return (
        <Accordion
            key={'accor-' + top5List._id}
            expanded={expanded === top5List._id}
            onChange={handleAccorChangeCallback(top5List._id)}
            onClick={view}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid
                    key={'accor-summary-grid-' + top5List._id}
                    container direction='column'>
                    <ListItem>
                        <Typography
                            flex={1}
                            variant='h6'
                            fontWeight='fontWeightBold'
                        >
                            {top5List.name}
                        </Typography>
                        {socialElements}
                        <IconButton
                            disabled={(top5List.owner !== auth.user.username)}
                            onClick={(event) => { handleDeleteList(event, top5List._id) }}>
                            <DeleteForeverIcon
                                fontSize='large'
                                sx={{
                                    color: 'red',
                                    opacity: ((top5List.owner === auth.user.username)
                                        && queryState.queryType === QUERY_TYPE.HOME ? 1 : 0)
                                }} />
                        </IconButton>
                    </ListItem>
                    <ListItem>
                        <Typography variant='caption'>By</Typography>
                        <Typography variant='caption' color='blue' sx={{ ml: 1 }}>{top5List.owner}</Typography>
                    </ListItem>
                    {elementA}
                </Grid >
            </AccordionSummary>
            {accorDetailsElement}
        </Accordion >
    )
}