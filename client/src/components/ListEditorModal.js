import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { SLIDE_UP_TRANSITION } from '../util/CamposConsts';
import { TextField } from '@mui/material';
import { GlobalStoreContext } from '../store'
import Card from '@mui/material/Card';

export default function ListEditorModal() {
  const { store } = React.useContext(GlobalStoreContext)
  let listNameElement = <ListItem></ListItem>
  let itemElements = <List></List>

  const save = (event) => {
    store.updateCurrentList()
      .then(() => store.closeCurrentList())
  }
  const publish = (event) => {
    store.publishCurrentList()
      .then(() => store.updateCurrentList()
        .then(() => store.closeCurrentList()))
  }

  if (store.currentList) {
    let i = 0
    listNameElement =
      <ListItem>
        <Card style={{ flex: 1 }}>
          <TextField
            onChange={(event) => {
              let newName = event.target.value
              store.currentList.name = newName
            }}
            variant='outlined'
            InputProps={{ style: { fontSize: 40, fontWeight: 'bold' } }}
            fullWidth
            defaultValue={store.currentList.name} />
        </Card>
      </ListItem>
    itemElements =
      <List>
        {store.currentList.items.map(item => (
          <ListItem key={'item-' + i}>
            <Card style={{ paddingBlock: 15, paddingInline: 30, marginRight: 15 }}>
              <Typography style={{ fontSize: 40 }}>{(i + 1) + '.'}</Typography>
            </Card>
            <Card style={{ flex: 1 }}>
              <TextField
                id={'item-' + (i++)}
                onChange={(event) => {
                  let strId = event.target.id
                  let index = parseInt(strId.slice(-1))
                  let newText = event.target.value
                  console.log('ListEditorModal: id=' + index + ', newText=' + newText)
                  store.currentList.items[index] = newText
                }}
                InputProps={{ style: { fontSize: 40 } }}
                fullWidth
                defaultValue={item} />
            </Card>
          </ListItem>
        ))}
      </List>
  }
  return (
    <div>
      <Dialog
        fullScreen
        open={Boolean(store.currentList)}
        TransitionComponent={SLIDE_UP_TRANSITION}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography variant='h6' sx={{ ml: 2, flex: 1 }}>List Editor Mode</Typography>
            <Button color="inherit" onClick={save}>
              Save
            </Button>
            <Button color='inherit' onClick={publish}>
              Publish
            </Button>
          </Toolbar>
        </AppBar>
        <Card style={{ backgroundColor: '#1976d2', margin: 30 }}>
          <List>
            {listNameElement}
            {itemElements}
          </List>
        </Card>
      </Dialog>
    </div>
  );
}
