import { Stack } from "@mui/material"
import { IconButton } from "@mui/material"
import { Typography } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function SocialButtons(props) {
    const { likes, dislikes, likeCallback, dislikeCallback } = props
    const like = (event) => {
        event.stopPropagation()
        likeCallback()
    }
    const dislike = (event) => {
        event.stopPropagation()
        dislikeCallback()
    }
    return (
        <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton onClick={like}>
                <ThumbUpIcon />
            </IconButton>
            <Typography>
                {likes}
            </Typography>
            <IconButton onClick={dislike}>
                <ThumbDownIcon />
            </IconButton>
            <Typography>
                {dislikes}
            </Typography>
        </Stack>
    )
}