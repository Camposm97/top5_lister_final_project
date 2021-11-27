import { createContext, useContext, useState } from 'react'
// import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'
import QueryContext from '../query'
import Cookies from '../util/Cookies'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_TOP_5_LISTS: "LOAD_TOP_5_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        top5Lists: [],
        currentList: null,
        listMarkedForDeletion: null,
    });

    // const history = useHistory();
    const { auth } = useContext(AuthContext);
    const { queryState } = useContext(QueryContext)

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: null,
                })
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: payload,
                    listMarkedForDeletion: null
                })
            }
            case GlobalStoreActionType.LOAD_TOP_5_LISTS: {
                return setStore({
                    top5Lists: payload,
                    currentList: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: payload
                });
            }
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    top5Lists: store.top5Lists,
                    currentList: null,
                    listMarkedForDeletion: null
                });
            }
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

    store.closeCurrentList = async function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        })
        store.loadTop5Lists() // Call this to display new created list in HomeScreen
    }

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

    store.clearTop5Lists = async function () {
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: null
        })
    }

    /**
     * Retrieves Top5Lists based on store query and queryType
     * @param {String} query
     * @param {QUERY_TYPE} queryType
     */
    store.loadTop5Lists = async function (query = queryState.query, queryType = queryState.queryType) {
        console.log({ query: query, queryType: queryType })
        let payload = auth.user ? {
            owner: auth.user.username,
            query: query,
            queryType: queryType
        } : { query: query, queryType: queryType }
        let response = await api.getTop5ListPairs(payload)
        if (response.data.success) {
            let top5Lists = response.data.top5Lists;
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
                payload: top5Lists
            });
        } else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    store.markListForDeletion = async function (id) {
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
            // history.push("/");
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

    store.addComment = async function (top5List, comment) {
        top5List.comments.unshift({
            username: auth.user.username,
            message: comment
        })
        store.updateTop5ListById(top5List)
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

    store.view = async function (top5List) {
        top5List.views = top5List.views + 1
        store.updateTop5ListById(top5List)
    }

    store.updateTop5ListById = async function (top5List) {
        // Update the top5List on the server-side
        const response = await api.updateTop5ListById(top5List._id, top5List)
        if (response.data.success) {
            storeReducer({ // Update top5Lists with updated list client-side
                type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
                payload: store.top5Lists
            })
        }
    }

    store.publishCurrentList = async function () {
        store.currentList.isPublished = true
        store.updateTop5ListById(store.currentList)
    }

    store.commentCommList = async (commList, comment) => {
        commList.comments.unshift({
            username: auth.user.username,
            message: comment
        })
        store.updateCommListById(commList)
    }

    store.likeCommList = async (commList) => {
        const username = auth.user.username
        if (!commList.dislikes.includes(username)) {
            if (commList.likes.includes(username)) {
                commList.likes = commList.likes.filter(x => x !== username)
            } else {
                commList.likes.push(username)
            }
            store.updateCommListById(commList)
        }
    }

    store.dislikeCommList = async (commList) => {
        const username = auth.user.username
        if (!commList.likes.includes(username)) {
            if (commList.dislikes.includes(username)) {
                commList.dislikes = commList.dislikes.filter(x => x !== username)
            } else {
                commList.dislikes.push(username)
            }
            store.updateCommListById(commList)
        }
    }

    store.viewCommList = async (commList) => {
        commList.views++
        store.updateCommListById(commList)
    }

    store.updateCommListById = async function (commList) {
        const response = await api.updateTop5CommunityListById(commList._id, commList)
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
                payload: store.top5Lists
            })
        }
    }

    store.sortByNewest = () => {
        let arr = store.top5Lists.sort((a, b) => {
            if (a.publishDate == null || b.publishDate == null) {
                return new Date(a.latestUpdate) - new Date(b.latestUpdate)
            }
            return new Date(a.publishDate) - new Date(b.publishDate)
        })
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: arr
        })
    }

    store.sortByOldest = () => {
        let arr = store.top5Lists.sort((a, b) => {
            if (a.publishDate == null || b.publishDate == null) {
                return new Date(a.latestUpdate) - new Date(b.latestUpdate)
            }
            return new Date(b.publishDate) - new Date(a.publishDate)
        })
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: arr
        })
    }

    store.sortByViews = () => {
        let arr = store.top5Lists.sort((a, b) => a.views < b.views ? 1 : -1)
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: arr
        })
    }

    store.sortByLikes = () => {
        let arr = store.top5Lists.sort((a, b) => {
            return a.likes.length < b.likes.length ? 1 : -1
        })
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: arr
        })
    }

    store.sortByDislikes = () => {
        let arr = store.top5Lists.sort((a, b) => {
            return a.dislikes.length < b.dislikes.length ? 1 : -1
        })
        storeReducer({
            type: GlobalStoreActionType.LOAD_TOP_5_LISTS,
            payload: arr
        })
    }

    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };