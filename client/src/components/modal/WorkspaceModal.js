import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography, useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { SLIDE_UP_TRANSITION } from '../../util/CamposConsts';
import { TextField } from '@mui/material';
import { GlobalStoreContext } from '../../context/store'
import Card from '@mui/material/Card';

export default function WorkspaceModal() {
  const theme = useTheme()
  const { store } = useContext(GlobalStoreContext)
  const [dis, setDis] = useState({ save: false, pub: false })
  let listTitleElement = <ListItem></ListItem>
  let top5itemElements = <List></List>

  const handleTitleChange = (event) => {
    let name = event.target.value
    store.currentList.name = name
    name = name.toLowerCase()
    let idNamePairs = store.top5Lists.map(x => {
      return {
        _id: x._id,
        name: x.name.toLowerCase()
      }
    })
    let names = idNamePairs.filter(x => x._id !== store.currentList._id).map(x => x.name)
    if (names.includes(name) || name === '') {
      setDis({ save: true, pub: true })
    } else {
      setDis({ save: false, pub: false || duplicateItems() })
    }
  }

  const handleItemChange = (event) => {
    let strId = event.target.id
    let index = parseInt(strId.slice(-1))
    let newText = event.target.value
    store.currentList.items[index] = newText

    if (newText === '') {
      setDis({ save: true, pub: false || duplicateItems() })
    } else {
      setDis({ save: false, pub: duplicateItems() })
    }
  }

  const save = () => {
    store.updateCurrentList()
      .then(() => store.closeCurrentList())
  }
  const publish = () => {
    store.publishCurrentList()
      .then(() => store.closeCurrentList())
  }

  const duplicateItems = () => {
    if (store.currentList) {
      let items = store.currentList.items.map(x => x.toLowerCase())
      let arr = []
      for (let i in items) {
        if (!arr.includes(items[i])) {
          arr.push(items[i])
        } else {
          return true
        }
      }
    }
    return false
  }

  // const validChars = () => {
  //   for (let i in store.currentList.items) {
  //     let item = store.currentList.items[i]
  //     if (item === '?' || item === '') {
  //       return false
  //     }
  //   }
  //   return true
  // }

  if (store.currentList) {
    let i = 0
    listTitleElement =
      <ListItem>
        <Card style={{ flex: 1 }}>
          <TextField
            // onKeyPress={handleOnKeyPress}
            onChange={handleTitleChange}
            variant='outlined'
            InputProps={{ style: { fontSize: 40, fontWeight: 'bold' } }}
            fullWidth
            defaultValue={store.currentList.name} />
        </Card>
      </ListItem>
    top5itemElements =
      <List>
        {store.currentList.items.map(item => (
          <ListItem key={'item-' + i}>
            <Card style={{ paddingBlock: 15, paddingInline: 30, marginRight: 15}}>
              <Typography style={{ fontSize: 40 }}>{(i + 1) + '.'}</Typography>
            </Card>
            <Card style={{ flex: 1}}>
              <TextField
                id={'item-' + (i++)}
                // onKeyPress={handleOnKeyPress}
                onChange={handleItemChange}
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
            <Typography variant='h6' sx={{ ml: 2, flex: 1 }}>Workspace</Typography>
            <Button color="inherit" onClick={save} disabled={dis.save}>
              Save
            </Button>
            <Button color='inherit' onClick={publish} disabled={dis.pub || duplicateItems()}>
              Publish
            </Button>
          </Toolbar>
        </AppBar>
        <Card style={{ backgroundColor: theme.palette.primary, margin: 30 }}>
          <List>
            {listTitleElement}
            {top5itemElements}
          </List>
        </Card>
      </Dialog>
    </div>
  );
}
