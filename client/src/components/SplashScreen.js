import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function SplashScreen() {
    return (
        <Box id='splash-screen'>
            <Typography variant='h2' style={{paddingBottom: '100px'}}><b>Top 5 Lister</b></Typography>
            <Typography variant='h4'>A place where everyone can share</Typography>
            <Typography variant='h4'>their top 5 of any topic!</Typography>
            <Box style={{paddingTop: '220px'}}>
                <Typography variant='h5'>Developed by Michael Campos</Typography>
            </Box>
        </Box>
    )
}