import ExpandMore from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Grid, Stack } from "@mui/material";

export default function Top5ListHeader(props) {
    const { top5List } = props

    return (
        <AccordionSummary expandIcon={<ExpandMore />}>
            <Grid
                key={'accor-summary-grid-' + top5List._id}
                container direction='column'
            >
                <Stack direction='row' alignItems='center' >
                    <Typography
                        flex={1}
                        variant='h6'
                        fontWeight='fontWeightBold'>
                        {top5List.name}
                    </Typography>
                    {socialButtons}
                    {trashButton}
                </Stack>
                <Stack direction='row'>
                    <Typography variant='caption'>
                        By:
                    </Typography>
                    <Typography variant='caption'
                        color='blue'
                        sx={{ ml: 1 }}>
                        {top5List.owner}
                    </Typography>
                </Stack>
                {statusElement}
            </Grid>
        </AccordionSummary>
    )
}