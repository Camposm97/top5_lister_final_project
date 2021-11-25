import { ListItem, Typography } from "@mui/material"
// import { QUERY_TYPE } from "../query"

export default function ItemCard(props) {
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