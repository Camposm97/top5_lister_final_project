import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import QueryContext, { QUERY_TYPE } from '../query'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import WorkspaceModal from './modal/WorkspaceModal'
import DeleteListModal from './modal/DeleteListModal'
import Top5CommunityListCard from './Top5CommunityListCard'

export default function HomeScreen() {
    const { queryState } = useContext(QueryContext)
    const { store } = useContext(GlobalStoreContext)
    const [expanded, setExpanded] = useState(false)

    const handleAccorChange = (panel) => (event, isExpanaded) => {
        setExpanded(isExpanaded ? panel : false)
    }

    useEffect(() => {
        store.loadTop5Lists('', QUERY_TYPE.HOME)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty Array tells React to run this function only once when this component is mounted

    function handleCreateNewList() {
        store.createNewList()
    }
    function initStatusbar() {
        switch (queryState.queryType) {
            case QUERY_TYPE.ALL_LISTS:
                return (
                    <div id="top5-statusbar">
                        <Typography variant="h4">All Lists</Typography>
                    </div>
                )
            case QUERY_TYPE.USERS:
                return (
                    <div id="top5-statusbar">
                        <Typography variant="h4">Users</Typography>
                    </div>
                )
            case QUERY_TYPE.COMMUNITY_LISTS:
                return (
                    <div id="top5-statusbar">
                        <Typography variant="h4">Community Lists</Typography>
                    </div>
                )
            default:
                return (
                    <div id="top5-statusbar">
                        <Fab size='small'
                            disabled={store.isListNameEditActive}
                            color="primary"
                            onClick={handleCreateNewList}>
                            <AddIcon fontSize='medium' />
                        </Fab>
                        <Typography variant="h4">Your Lists</Typography>
                    </div>
                )
        }
    }

    let listCards = ''
    let statusbar = initStatusbar()

    let i = 0
    if (store.top5Lists) {
        listCards =
            <List sx={{ width: '90%', left: '5%' }}>
                {store.top5Lists.map((top5List) => {
                    if (queryState.isCommunityLists()) {
                        return (
                            <Top5CommunityListCard
                                key={top5List._id}
                                i={(i++)}
                                commList={top5List}
                                expanded={expanded}
                                handleAccorChangeCallback={handleAccorChange}
                            />)
                    } else {
                        return (
                            <ListCard
                                i={(i++)}
                                key={top5List._id}
                                top5List={top5List}
                                expanded={expanded}
                                handleAccorChangeCallback={handleAccorChange}
                            />
                        )
                    }
                })}
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