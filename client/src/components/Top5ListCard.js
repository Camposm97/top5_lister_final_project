import { useState, useContext } from 'react'
import { GlobalStoreContext } from '../context/store'
import { List, Card, CardContent, Accordion, Button, Grid, Typography, TextField, Stack } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMore from '@mui/icons-material/ExpandMore'
import SocialButtons from './SocialButtons';
import Top5ItemCard from './Top5ItemCard';
import QueryContext, { QUERY_TYPE } from '../context/query';
import AuthContext from '../context/auth';
import { formatDate } from '../util/ListCardUtils';

export default function Top5ListCard(props) {
    const { auth } = useContext(AuthContext)
    const { queryState } = useContext(QueryContext)
    const { store } = useContext(GlobalStoreContext)
    // const { top5List, expanded, handleAccorChangeCallback } = props
    const { top5List } = props
    const [expanded, setExpanded] = useState(false)
    const bgColor = top5List.isPublished ? '#e3f2fd' : '#ffffff'
    const handleAccorChange = (panel) => (event, isExpanaded) => {
        setExpanded(isExpanaded ? panel : false)
    }
    const addComment = (event) => {
        if (event.key === 'Enter') {
            let comment = event.target.value
            if (comment) {
                store.addComment(top5List, comment)
                event.target.value = ''
            }
        }
    }
    const like = () => {
        store.likeTop5List(top5List)
    }
    const dislike = () => {
        store.dislikeTop5List(top5List)
    }
    const edit = (event) => {
        event.stopPropagation()
        store.setCurrentList(top5List._id)
    }
    const view = () => {
        if (top5List.isPublished && !expanded) {
            store.view(top5List)
        }
    }
    const handleDeleteList = (event, id) => {
        event.stopPropagation()
        store.markListForDeletion(id)
    }

    let statusElement =
        <Stack direction='row'>
            <Button variant='text' sx={{ fontSize: '8pt' }} onClick={edit}>Edit</Button>
        </Stack>
    let socialButtons = <Stack></Stack>
    let trashButton = <Stack></Stack>
    let accorDetailsElement = <Stack></Stack>
    if (auth.user && queryState.queryType === QUERY_TYPE.HOME) {
        if (auth.user.username === top5List.owner) {
            trashButton =
                <IconButton
                    onClick={(event) => { handleDeleteList(event, top5List._id) }}>
                    <DeleteForeverIcon />
                </IconButton>
        }
    }
    if (top5List.isPublished) {
        let commentField = auth.user ?
            <TextField
                fullWidth
                label='Add Comment'
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                onKeyPress={addComment} />
            : ''
        statusElement =
            <Stack direction='row'>
                <Typography variant='caption' fontWeight='fontWeightBold'>
                    Published:
                </Typography>
                <Typography variant='caption' flex={1} marginLeft={1} color='#2e7d32'>
                    {formatDate(top5List.publishDate)}
                </Typography>
                <Typography variant='caption' fontWeight='fontWeightBold'>
                    Views:
                </Typography>
                <Typography variant='caption' marginLeft={1} marginRight={8} color='red'>
                    {top5List.views}
                </Typography>
            </Stack>
        socialButtons =
            <SocialButtons
                likes={top5List.likes.length}
                dislikes={top5List.dislikes.length}
                likeCallback={like}
                dislikeCallback={dislike}
            />
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
                            {commentField}
                            {/* <TextField
                                fullWidth
                                label='Add Comment'
                                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                                onKeyPress={addComment} /> */}
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

    return (
        <Accordion
            key={'accor-' + top5List._id}
            expanded={expanded === top5List._id}
            onChange={handleAccorChange(top5List._id)}
            // onChange={handleAccorChangeCallback(top5List._id)}
            onClick={view}
            sx={{ backgroundColor: bgColor }}
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid
                    key={'accor-summary-grid-' + top5List._id}
                    container direction='column'

                >
                    <Stack direction='row' alignItems='center' >
                        <Typography
                            flex={1}
                            variant='h6'
                            fontWeight='fontWeightBold'
                        >
                            {top5List.name}
                        </Typography>
                        {socialButtons}
                        {trashButton}
                    </Stack>
                    <Stack direction='row'>
                        <Typography variant='caption'>By</Typography>
                        <Typography variant='caption' color='blue' sx={{ ml: 1 }}>{top5List.owner}</Typography>
                    </Stack>
                    {statusElement}
                </Grid >
            </AccordionSummary>
            {accorDetailsElement}
        </Accordion >
    )
}