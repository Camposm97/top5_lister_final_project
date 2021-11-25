import ExpandMore from "@mui/icons-material/ExpandMore"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useContext } from "react"
// import GlobalStoreContext from "../store"
import { formatDate } from "../util/ListCardUtils";
import Top5CommunityItemCard from "./Top5CommunityItemCard";

export default function Top5CommunityListCard(props) {
    // const { store } = useContext(GlobalStoreContext)
    const { i, commList, expanded, handleAccorChangeCallback } = props
    let j = 0, k = 0
    return (
        <Accordion
            key={'comm-accor-' + commList._id}
            expanded={expanded === commList._id}
            onChange={handleAccorChangeCallback(commList._id)}
        >
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid
                    key={'comm-accor-summary-grid-' + commList._id}
                    container direction='column'
                >
                    <Stack direction='row' alignItems='center'>
                        <Typography
                            flex={1}
                            variant='h6'
                            fontWeight='fontWeightBold'
                        >
                            {commList.name}
                        </Typography>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <IconButton>
                                <ThumbUpIcon />
                            </IconButton>
                            <Typography>
                                {commList.likes.length}
                            </Typography>
                            <IconButton>
                                <ThumbDownIcon />
                            </IconButton>
                            <Typography>
                                {commList.dislikes.length}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction='row' marginLeft={1} spacing={1}>
                        <Typography variant='caption'>
                            Updated
                        </Typography>
                        <Typography variant='caption'>
                            {formatDate(commList.latestUpdate)}
                        </Typography>
                    </Stack>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid
                    key={'comm-accor-details-grid-root' + commList._id + '-' + i}
                    container direction='row'
                >
                    <Grid
                        key={'comm-accor-details-grid-child-1-' + commList._id + '-' + i}
                        flex={1} mb={1} boxShadow={5}
                    >
                        <Card>
                            <CardContent>
                                <Stack>
                                    {commList.items.map(item => (
                                        <Top5CommunityItemCard
                                            key={'comm-item-' + j}
                                            i={(++j)}
                                            item={item}
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid
                        key={'comm-accor-details-grid-child-2-' + commList._id + '-' + i}
                        flex={1} ml={1}
                    >
                        <Grid
                            key={'comm-accor-details-grid-child-2-1-' + commList._id + '-' + i}
                            ml={1} mr={1}
                        >
                            <TextField fullWidth label='Add Comment' />
                        </Grid>
                        <Grid
                            key={'comm-accor-details-grid-child-2-2-' + commList._id + '-' + i}
                            overflow={'auto'} height={350}
                        >
                            {commList.comments.map(comment => (
                                <Card
                                    key={'comm-comment-' + commList._id + '-' + (k++)} sx={{ flex: 1, m: 1, boxShadow: 5 }}>
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
        </Accordion>
    )
}