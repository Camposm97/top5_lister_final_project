import { useContext, useEffect, useState } from 'react';
import { Box, FormControl, Grid, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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
import GlobalStoreContext from '../context/store';
import { QUERY_TYPE } from '../context/query';
import QueryContext from '../context/query';
import AuthContext from '../context/auth';

export default function NavigationBar() {
    const { auth } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl);
    const { queryState } = useContext(QueryContext)
    const { store } = useContext(GlobalStoreContext)
    const [alignment, setAlignment] = useState('home')

    useEffect(() => {
        if (auth.user) {
            setAlignment('home')
        } else {
            setAlignment('community_lists')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateAlignment = (e, newAlignment) => {
        if (newAlignment !== null) {    // Enforce one button must always be on
            setAlignment(newAlignment)
        }
    }
    const handleHomeClick = () => {
        queryState.setQueryType(QUERY_TYPE.HOME)
        store.loadTop5Lists(queryState.query, QUERY_TYPE.HOME)
    }
    const handleAllListsClick = () => {
        queryState.setQueryType(QUERY_TYPE.ALL_LISTS)
        store.loadTop5Lists(queryState.query, QUERY_TYPE.ALL_LISTS)
    }
    const handleUsersClick = () => {
        queryState.setQueryType(QUERY_TYPE.USERS)
        store.loadTop5Lists(queryState.query, QUERY_TYPE.USERS)
    }
    const handleCommunityListsClick = () => {
        queryState.setQueryType(QUERY_TYPE.COMMUNITY_LISTS)
        store.loadTop5Lists(queryState.query, QUERY_TYPE.COMMUNITY_LISTS)
    }
    const handleQueryFieldOnChange = (event) => {
        let query = event.target.value
        queryState.setQuery(event.target.value)
        store.loadTop5Lists(query, queryState.queryType)
    }
    const handleSortByDateNewest = () => {
        store.sortByNewest()
        handleSortMenuClose()
    }
    const handleSortByDateOldest = () => {
        store.sortByOldest()
        handleSortMenuClose()
    }
    const handleSortByViews = () => {
        store.sortByViews()
        handleSortMenuClose()
    }
    const handleSortByLikes = () => {
        store.sortByLikes()
        handleSortMenuClose()
    }
    const handleSortByDislikes = () => {
        store.sortByDislikes()
        handleSortMenuClose()
    }
    const handleSortMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleSortMenuClose = () => {
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
                <ToggleButton value='home' onClick={handleHomeClick} disabled={!auth.user}>
                    <Tooltip title='Home' arrow>
                        <HomeSharpIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='all_lists' onClick={handleAllListsClick}>
                    <Tooltip title='All Lists' arrow>
                        <GroupsSharpIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='users' onClick={handleUsersClick}>
                    <Tooltip title='Users' arrow>
                        <PersonSharpIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value='community_lists' onClick={handleCommunityListsClick}>
                    <Tooltip title='Community Lists' arrow>
                        <FunctionsSharpIcon />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
            <FormControl sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: 1 }}>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchSharpIcon />
                            </InputAdornment>)
                    }}
                    variant='outlined'
                    size='small'
                    onChange={handleQueryFieldOnChange}
                />
            </FormControl>
            <Box sx={{ paddingLeft: '15px', display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: 1 }}><b>SORT BY</b></Typography>
                <ToggleButton value='list_sort_by' onClick={handleSortMenuClick}>
                    <MenuIcon />
                </ToggleButton>
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