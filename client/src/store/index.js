import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
import Cookies from '../util/Cookies'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_TOP_5_LISTS: "LOAD_TOP_5_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
}


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        top5Lists: [],
        currentList: null,
        listMarkedForDeletion: null,
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: null,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_TOP_5_LISTS: {
                return setStore({
                    top5Lists: payload,
                    currentList: null,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    listMarkedForDeletion: null,
                });
            }
            default:
                return store;
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        store.loadTop5Lists()
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        const NEW_LIST_COUNTER = 'newListCounter'
        let value = Cookies.getCookie(NEW_LIST_COUNTER)
        if (value === '') {
            Cookies.setCookie(NEW_LIST_COUNTER, 0, 365)
            value = Cookies.getCookie(NEW_LIST_COUNTER)
        }
        let payload = {
            name: 'Untitled ' + value,
            items: ["?", "?", "?", "?", "?"],
            owner: auth.user.username,
            isPublished: false,
            publishDate: null,
            comments: [],
            likes: [],
            dislikes: [],
            views: 0
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            });
            Cookies.setCookie(NEW_LIST_COUNTER, ++value, 365)
        } else {
            console.log("API FAILED TO CREATE A NEW LIST")
        }

    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadTop5Lists = async function () {
        const response = await api.getTop5ListPairs({
            owner: auth.user.username
        });
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
                payload: pairsArray
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadTop5Lists();
            history.push("/");
        }
    }

    store.deleteMarkedList = async function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = async function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
            }
        }
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.likeTop5List = async function (top5List) {
        const username = auth.user.username
        if (!top5List.dislikes.includes(username)) {
            if (top5List.likes.includes(username)) {
                top5List.likes = top5List.likes.filter(x => x !== username)
            } else {
                top5List.likes.push(username)
            }
            store.updateTop5ListById(top5List)
        }
    }

    store.dislikeTop5List = async function (top5List) {
        const username = auth.user.username
        if (!top5List.likes.includes(username)) {
            if (top5List.dislikes.includes(username)) {
                top5List.dislikes = top5List.dislikes.filter(x => x !== username)
            } else {
                top5List.dislikes.push(username)
            }
            store.updateTop5ListById(top5List)
        }
    }

    store.updateTop5ListById = async function (top5List) {
        const response = await api.updateTop5ListById(top5List._id, top5List)
        if (response.data.success) {
            store.loadTop5Lists()
        }
    }

    store.publishCurrentList = async function () {
        store.currentList.isPublished = true
    }

    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };