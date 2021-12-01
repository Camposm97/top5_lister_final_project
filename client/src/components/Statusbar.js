import { useContext } from "react";
import { Typography, Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { QUERY_TYPE } from "../context/query";
import QueryContext from "../context/query";
import GlobalStoreContext from "../context/store";

export default function Statusbar(props) {
    const { createListCallback } = props
    const { store } = useContext(GlobalStoreContext)
    const { queryState } = useContext(QueryContext)
    switch (queryState.queryType) {
        case QUERY_TYPE.ALL_LISTS:
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">
                        {queryState.query ? queryState.query + ' Lists' : 'All Lists'}
                    </Typography>
                </div>
            )
        case QUERY_TYPE.USERS:
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">
                        {queryState.query ? queryState.query + ' Lists' : 'Users'}
                    </Typography>
                </div>
            )
        case QUERY_TYPE.COMMUNITY_LISTS:
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">{'Community Lists'}</Typography>
                </div>
            )
        default:
            return (
                <div id="top5-statusbar">
                    <Fab size='small'
                        disabled={store.isListNameEditActive}
                        color="primary"
                        onClick={createListCallback}>
                        <AddIcon fontSize='medium' />
                    </Fab>
                    <Typography variant="h4">Your Lists</Typography>
                </div>
            )
    }
}