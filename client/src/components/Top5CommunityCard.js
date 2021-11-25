export default function Top5CommunityCard(props) {
    const { i, item } = props
    return (
        <ListItem
            key={'item-pub-comm-' + i}
            sx={{ mb: 3 }}>
            <Typography
                variant='h5' >
                {i + '. ' + item.name}
            </Typography>
        </ListItem>
    )
}