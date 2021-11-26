import ExpandMore from "@mui/icons-material/ExpandMore"
import { AccordionSummary, Grid, Stack, Typography } from "@mui/material"
import SocialButtons from "./SocialButtons"
import { formatDate } from "../util/ListCardUtils"
export default function Top5CommunityListCardAccordionSummary(props) {
    const { commList, likeCallback, dislikeCallback } = props
    return (
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
                    <SocialButtons
                        likes={commList.likes.length}
                        dislikes={commList.dislikes.length}
                        likeCallback={likeCallback}
                        dislikeCallback={dislikeCallback}
                    />
                </Stack>
                <Stack direction='row' marginLeft={1} spacing={1} marginRight={8}>
                    <Typography variant='caption'>
                        Updated
                    </Typography>
                    <Typography variant='caption' flex={1}>
                        {formatDate(commList.latestUpdate)}
                    </Typography>
                    <Typography variant='caption'>
                        Views:
                    </Typography>
                    <Typography variant='caption'>
                        {commList.views}
                    </Typography>
                </Stack>
            </Grid>
        </AccordionSummary>
    )
}