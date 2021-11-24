import { createContext, useState } from "react";

const QueryContext = createContext()

export const QUERY_TYPE = {
    HOME: 'HOME',
    ALL_LISTS: 'ALL_LISTS',
    USERS: 'USERS',
    COMMUNITY_LISTS: 'COMMUNITY_LISTS'
}

export const QueryActionType = {
    SET_QUERY: 'SET_QUERY',
    SET_QUERY_TYPE: 'SET_QUERY_TYPE'
}

function QueryContextProvider(props) {
    const [queryState, setQueryState] = useState({
        query: '',
        queryType: QUERY_TYPE.HOME
    })

    const queryStateReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case QueryActionType.SET_QUERY: {
                return setQueryState({
                    query: payload,
                    queryType: queryState.queryType,
                })
            }
            case QueryActionType.SET_QUERY_TYPE: {
                return setQueryState({
                    query: queryState.query,
                    queryType: payload,
                })
            }
            default:
                return queryState
        }
    }

    queryState.setQuery = function (query) {
        queryStateReducer({
            type: QueryActionType.SET_QUERY,
            payload: query
        })
    }

    queryState.setQueryType = function (queryType) {
        queryStateReducer({
            type: QueryActionType.SET_QUERY_TYPE,
            payload: queryType
        })
    }

    return (
        <QueryContext.Provider value={{queryState}}>
            {props.children}
        </QueryContext.Provider>
    )
}

export default QueryContext
export { QueryContextProvider }