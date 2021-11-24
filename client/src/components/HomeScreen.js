import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import QueryContext, { QUERY_TYPE } from '../query'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import WorkspaceModal from './modal/WorkspaceModal'
import DeleteListModal from './modal/DeleteListModal'

export default function HomeScreen() {
    const {queryState } = useContext(QueryContext)
    const { store } = useContext(GlobalStoreContext)
    const [expanded, setExpanded] = useState(false)

    const handleAccorChange = (panel) => (event, isExpanaded) => {
        setExpanded(isExpanaded ? panel : false)
    }

    useEffect(() => {
        console.log('HomeScreen')
        store.loadTop5Lists()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty Array tells React to run this function only once

    function handleCreateNewList() {
        store.createNewList()
    }
    let listCards = ''
    let statusbar = ''
    switch (queryState.queryType) {
        case QUERY_TYPE.ALL_LISTS:
            statusbar =
                <div id="top5-statusbar">
                    <Typography variant="h4">All Lists</Typography>
                </div>
            break;
        case QUERY_TYPE.USERS:
            statusbar =
                <div id="top5-statusbar">
                    <Typography variant="h4">Users</Typography>
                </div>
            break;
        case QUERY_TYPE.COMMUNITY_LISTS:
            statusbar =
                <div id="top5-statusbar">
                    <Typography variant="h4">Community Lists</Typography>
                </div>
            break;
        default:
            statusbar =
                <div id="top5-statusbar">
                    <Fab size='small'
                        disabled={store.isListNameEditActive}
                        color="primary"
                        onClick={handleCreateNewList}>
                        <AddIcon fontSize='medium' />
                    </Fab>
                    <Typography variant="h4">Your Lists</Typography>
                </div>
    }
    let id = 0
    if (store.top5Lists) {
        listCards =
            <List sx={{ width: '90%', left: '5%' }}>
                {store.top5Lists.map((top5List) => (
                    <ListCard
                        i={(id++)}
                        key={top5List._id}
                        top5List={top5List}
                        selected={false}
                        expanded={expanded}
                        handleAccorChangeCallback={handleAccorChange}
                    />
                ))}
            </List>
    }
    return (
        <div id="top5-list-selector">
            <WorkspaceModal />
            <DeleteListModal />
            <div id="list-selector-list">
                {listCards}
            </div>
            {statusbar}
        </div>
    )
}