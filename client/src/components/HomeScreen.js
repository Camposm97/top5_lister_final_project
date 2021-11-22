import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListEditorModal from './ListEditorModal'
import DeleteListModal from './DeleteListModal'

export default function HomeScreen() {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadTop5Lists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleCreateNewList() {
        store.createNewList()
    }
    let listCards = "";
    if (store) {
        listCards =
            <List sx={{ width: '90%', left: '5%' }}>
                {store.top5Lists.map((top5List) => (
                        <ListCard
                            key={top5List._id}
                            top5List={top5List}
                            selected={false}
                        />
                    ))}
            </List>
    }
    return (
        <div id="top5-list-selector">
            <ListEditorModal />
            <DeleteListModal />
            <div id="list-selector-list">
                {listCards}
            </div>
            <div id="list-selector-bottom">
                <Fab size='small'
                    disabled={store.isListNameEditActive}
                    color="primary"
                    onClick={handleCreateNewList}>
                    <AddIcon fontSize='medium' />
                </Fab>
                <Typography variant="h4">Your Lists</Typography>
            </div>
        </div>
    )
}