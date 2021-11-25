import { ListItem, Typography } from "@mui/material"

export default function Top5ItemCard(props) {
    const { i, item } = props
    return (
        <ListItem
            key={'item-pub-' + i}
            sx={{ mb: 3 }}>
            <Typography
                variant='h5' >
                {i + '. ' + item}
            </Typography>
        </ListItem>
    )
}