import { Stack, Typography } from "@mui/material"

export default function Top5CommunityItemCard(props) {
    const { i, item } = props
    return (
        <Stack
            key={'item-pub-comm-' + i}
            sx={{ mb: 3 }}>
            <Typography variant='h6'>
                {i + '. ' + item.name}
            </Typography>
            <Typography variant='caption'>
                {'(' + item.score + ' Votes)'}
            </Typography>
        </Stack>
    )
}