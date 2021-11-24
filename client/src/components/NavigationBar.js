import { useContext, useState } from 'react';
import { Box, FormControl, Grid, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
import { TextField } from '@mui/material';
import { MENU_PAPER_PROPS } from '../util/CamposConsts';
import GlobalStoreContext from '../store';
import { QUERY_TYPE } from '../store';

export default function NavigationBar() {
    const [anchorEl, setAnchorEl] = useState(null)
    const { store } = useContext(GlobalStoreContext)
    const [alignment, setAlignment] = useState('home')
    const open = Boolean(anchorEl);
    function updateAlignment(e, newAlignment) {
        setAlignment(newAlignment)
    }
    function handleHomeClick() {
        store.setQueryType(QUERY_TYPE.HOME)
    }
    function handleAllListsClick() {
        store.setQueryType(QUERY_TYPE.ALL_LISTS)
    }
    function handleUsersClick() {
        store.setQueryType(QUERY_TYPE.USERS)
    }
    function handleCommunityListsClick() {
        store.setQueryType(QUERY_TYPE.COMMUNITY_LISTS)
    }
    function handleQueryFieldKeyPress(event) {
        if (event.key === 'Enter') {
            console.log('query=' + store.query + ', queryType=' + store.queryType)
            store.loadTop5Lists()
        }
    }
    function handleSortByDateNewest() {
        console.log('Sort by Date Newest')
        handleSortMenuClose()
    }
    function handleSortByDateOldest() {
        console.log('Sort by Date Oldest')
        handleSortMenuClose()
    }
    function handleSortByViews() {
        console.log('Sort by Views')
        handleSortMenuClose()
    }
    function handleSortByLikes() {
        console.log('Sort by Likes')
        handleSortMenuClose()
    }
    function handleSortByDislikes() {
        console.log('Sort by Dislikes')
        handleSortMenuClose()
    }
    function handleSortMenuClick(event) {
        setAnchorEl(event.currentTarget);
    }
    function handleSortMenuClose() {
        setAnchorEl(null);
    }
    return (
        <Grid container direction='row' alignItems='center' justifyItems='flex-end' style={{ padding: '10px' }}>
            <ToggleButtonGroup
                color='primary'
                value={alignment}
                sx={{ marginRight: 1 }}
                exclusive
                onChange={updateAlignment}
            >
                <ToggleButton value='home' onClick={handleHomeClick}>
                    <Tooltip title='Home' arrow>
                        <HomeSharpIcon fontSize='large' />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='all-lists' onClick={handleAllListsClick}>
                    <Tooltip title='All Lists' arrow>
                        <GroupsSharpIcon fontSize='large' />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='users' onClick={handleUsersClick}>
                    <Tooltip title='Users' arrow>

                        <PersonSharpIcon fontSize='large' />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='comm-lists' onClick={handleCommunityListsClick}>
                    <Tooltip title='Community Lists' arrow>
                        <FunctionsSharpIcon fontSize='large' />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
            <FormControl sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: 1 }}>
                <TextField
                    InputProps={{ startAdornment: (<InputAdornment position='start'><SearchSharpIcon /></InputAdornment>) }}
                    variant='outlined'
                    size='small'
                    onChange={(event) => store.setQuery(event.target.value)}
                    onKeyPress={handleQueryFieldKeyPress}
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
                <MenuItem onClick={handleSortByDateNewest} >Publish Date (Newest)</MenuItem>
                <MenuItem onClick={handleSortByDateOldest} >Publish Date (Oldest)</MenuItem>
                <MenuItem onClick={handleSortByViews} >Views</MenuItem>
                <MenuItem onClick={handleSortByLikes} >Likes</MenuItem>
                <MenuItem onClick={handleSortByDislikes} >Dislikes</MenuItem>
            </Menu>
        </Grid >
    )
}