import { AccordionDetails } from "@mui/material"
import { Grid, Stack } from "@mui/material"
import { Card, CardContent, TextField, Typography } from "@mui/material"
import Top5CommunityItemCard from "./Top5CommunityItemCard"
export default function Top5CommunityListCardAccordionDetails(props) {
    const { i, commList, commentCallback } = props
    let j = 0, k = 0
    return (
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
                        <TextField fullWidth label='Add Comment' onKeyPress={commentCallback} />
                    </Grid>
                    <Grid
                        key={'comm-accor-details-grid-child-2-2-' + commList._id + '-' + i}
                        overflow={'auto'} height={350}
                    >
                        {commList.comments.map(comment => (
                            <Card
                                key={'comm-comment-' + commList._id + '-' + (k++)}
                                sx={{ flex: 1, m: 1, boxShadow: 5 }}>
                                <CardContent>
                                    <Typography variant='caption' color='blue'>
                                        {comment.username}
                                    </Typography>
                                    <Typography variant='body2'>
                                        {comment.message}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    )
}