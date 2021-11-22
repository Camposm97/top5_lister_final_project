import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { SLIDE_UP_TRANSITION } from '../util/CamposConsts';
import { TextField } from '@mui/material';

export default function ListEditorModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        List Editor Modal
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={SLIDE_UP_TRANSITION}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <TextField variant='outlined' sx={{
              ml: 2, flex: 1, backgroundColor: 'white', borderRadius: 1, margin: 1
            }} defaultValue='LIST NAME' />
            <Button color="inherit" onClick={handleClose}>
              Save
            </Button>
            <Button color='inherit' onClick={handleClose}>
              Publish
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            {/* <ListItemText primary="Phone ringtone" secondary="Titania" /> */}
            <TextField />
          </ListItem>
          <ListItem>
            {/* <ListItemText primary="Default notification ringtone" secondary="Tethys" /> */}
            <TextField />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
