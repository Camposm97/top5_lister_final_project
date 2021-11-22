import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AuthContext from '../auth';

/**
 * 
 * @deprecated since version 6.0
 */
function Statusbar() {
    const { auth } = useContext(AuthContext)
    const { store } = useContext(GlobalStoreContext);
    let text = "";
    if (auth.user) {
        if (store.currentList) {
            text = store.currentList.name;
        }
    }
    return (
        <div id="top5-statusbar">
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;