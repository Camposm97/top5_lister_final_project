import * as React from 'react';
import { Box, FormControl, Grid, Menu, MenuItem } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp';
import FunctionsSharpIcon from '@mui/icons-material/FunctionsSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { TextField } from "@mui/material";
import { MENU_PAPER_PROPS } from '../util/CamposConsts';

export default function NavigationBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleSortMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };
    return (
        <Grid container direction='row' alignItems='center' justifyItems='flex-end' style={{ padding: '10px' }}>
            <Tooltip title='Home' arrow>
                <IconButton color='inherit'>
                    <HomeSharpIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title='All Lists' arrow>
                <IconButton color='inherit'>
                    <GroupsSharpIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title='Users' arrow>
                <IconButton color='inherit'>
                    <PersonSharpIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <Tooltip title='Community Lists' arrow>
                <IconButton color='inherit'>
                    <FunctionsSharpIcon fontSize='large' />
                </IconButton>
            </Tooltip>
            <FormControl sx={{ width: '300px' }}>
                <TextField
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchSharpIcon /></InputAdornment>) }}
                    variant='outlined'
                    size='small'
                />
            </FormControl>
            <Box sx={{ paddingLeft: '15px', display: 'flex', alignItems: 'center', }}>
                <Typography><b>SORT BY</b></Typography>
                <IconButton color='inherit' onClick={handleSortMenuClick}>
                    <MenuIcon fontSize='large' />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleSortMenuClose}
                PaperProps={MENU_PAPER_PROPS}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>Publish Date (Newest)</MenuItem>
                <MenuItem>Publish Date (Oldest)</MenuItem>
                <MenuItem>Views</MenuItem>
                <MenuItem>Likes</MenuItem>
                <MenuItem>Dislikes</MenuItem>
            </Menu>
        </Grid >
    )
}