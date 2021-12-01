import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GlobalStoreContext from '../../context/store';
import { SLIDE_DOWN_TRANSITION } from '../../util/CamposConsts'

export default function DeleteListModal() {
    const { store } = React.useContext(GlobalStoreContext)

    function closeDialog() {
        store.unmarkListForDeletion()
    }

    function deleteList() {
        store.deleteMarkedList()
        closeDialog()
    }

    let listName = ''
    if (store.listMarkedForDeletion) {
        listName = store.listMarkedForDeletion.name
    }

    return (
        <div>
            <Dialog
                open={Boolean(store.listMarkedForDeletion)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-desc"
                TransitionComponent={SLIDE_DOWN_TRANSITION}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-desc">
                        {'Are you sure you want delete Top 5 ' + listName + ' List?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteList} >Confirm</Button>
                    <Button onClick={closeDialog} >Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}