import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography, useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { SLIDE_UP_TRANSITION } from '../../util/CamposConsts';
import { TextField } from '@mui/material';
import { GlobalStoreContext } from '../../store'
import Card from '@mui/material/Card';

let names = []

export default function WorkspaceModal() {
  const theme = useTheme()
  const { store } = useContext(GlobalStoreContext)
  const [dis, setDis] = useState({ save: false, pub: false })
  // let names = [] 
  useEffect(() => {
    if (store.currentList) {
      names = store.top5Lists.map(x => x.name.toLowerCase())
      names = names.filter(x => x !== store.currentList.name.toLowerCase())
      console.log(names)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) 

  let listTitleElement = <ListItem></ListItem>
  let top5itemElements = <List></List>

  const handleOnTitleChange = (event) => {
    let name = event.target.value
    store.currentList.name = name
    name = name.toLowerCase()
    // let names = store.top5Lists.map(x => x.name.toLowerCase())
    // if (names.length === 1) { // One top5list and one upcoming
    //   if (store.top5Lists[0]._id === store.currentList._id) {
    //     console.log(names)
    //   } else { // Check if new created list name equal to name in top5lists
    //     if (names.includes(name)) {
    //       setDis({ save: true, pub: true })
    //     } else {
    //       setDis({ save: false, pub: (false || duplicate()) }) // check if dup items to set pub state
    //     }
    //   }
    // } else if (names.length === 2) { // Two top5lists 
    //   let arr = names.filter(x => x !== name)
    //   if (arr.length === 1) {
    //     if (arr[0] === name) {
    //       console.log('gotcha')
    //     }
    //   }
    //   console.log(arr)
    //   console.log(arr.length + ', name=' + name)
    // } else {

    // }
  }

  const handleOnItemChange = (event) => {
    let strId = event.target.id
    let index = parseInt(strId.slice(-1))
    let newText = event.target.value
    store.currentList.items[index] = newText
    setDis({ save: dis.save, pub: duplicate() })
  }

  const save = () => {
    // let name = store.currentList.name.toLowerCase()
    // console.log(name)
    // console.log(store.top5Lists.map(x => x.name))
    // let duplicateListName = store.top5Lists.filter(
    //   x => x.name.toLowerCase() === name).length > 1
    // console.log(duplicateListName)
    // if (!duplicateListName) {
    store.updateCurrentList()
      .then(() => store.closeCurrentList())
    // }
  }
  const publish = () => {
    if (!duplicate() && validChars()) {
      store.publishCurrentList()
        .then(() => store.closeCurrentList())
    }
  }

  const duplicate = () => {
    let items = store.currentList.items.map(x => x.toLowerCase())
    let arr = []
    for (let i in items) {
      if (!arr.includes(items[i])) {
        arr.push(items[i])
      } else {
        return true
      }
    }
    return false
  }

  const validChars = () => {
    for (let i in store.currentList.items) {
      let item = store.currentList.items[i]
      if (item === '?' || item === '') {
        return false
      }
    }
    return true
  }

  if (store.currentList) {
    let i = 0
    listTitleElement =
      <ListItem>
        <Card style={{ flex: 1 }}>
          <TextField
            // onKeyPress={handleOnKeyPress}
            onChange={handleOnTitleChange}
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
            <Card style={{ paddingBlock: 15, paddingInline: 30, marginRight: 15 }}>
              <Typography style={{ fontSize: 40 }}>{(i + 1) + '.'}</Typography>
            </Card>
            <Card style={{ flex: 1 }}>
              <TextField
                id={'item-' + (i++)}
                // onKeyPress={handleOnKeyPress}
                onChange={handleOnItemChange}
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
            <Button color='inherit' onClick={publish} disabled={dis.pub}>
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
