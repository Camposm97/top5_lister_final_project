import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import EditToolbar from './EditToolbar'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MeetingRoomSharpIcon from '@mui/icons-material/MeetingRoomSharp';
import { ListItemIcon, ListItemText } from '@mui/material';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
        store.closeCurrentList()
    }

    const handleTop5L = () => {
        if (!store.isListNameEditActive) {
            store.closeCurrentList()
        }
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose} component={Link} to={'/login/'} >
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText>Login</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to='/register/'>
                <ListItemIcon><PersonAddAlt1Icon /></ListItemIcon>
                <ListItemText>Create New Account</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to='/guest/'>
                <ListItemIcon><PersonSearchIcon /></ListItemIcon>
                <ListItemText>Continue as Guest</ListItemText>
            </MenuItem>
        </Menu>
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>
                <ListItemIcon><MeetingRoomSharpIcon/></ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = <EditToolbar />;
        }
    }

    function getAccountMenu(loggedIn) {
        if (loggedIn) {
            let firstInitial = auth.user.firstName.charAt(0).toUpperCase()
            let lastInitial = auth.user.lastName.charAt(0).toUpperCase()
            let initials = firstInitial + lastInitial;
            return <span>{initials}</span>
        }
        return <AccountCircle fontSize='large'/>;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                        onClick={handleTop5L}
                    >
                        <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>T<sup>5</sup>L</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {menu}
        </Box>
    );
}