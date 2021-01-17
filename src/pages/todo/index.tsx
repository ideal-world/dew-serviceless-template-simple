import React from 'react'
import User from "components/User";
import Item from "components/Item";
import {DewSDK} from "@idealworld/sdk";
import {IdentOptInfo} from "@idealworld/sdk/dist/domain/IdentOptInfo";

export type IdentOptInfoAction = {
    type: string
    payload: IdentOptInfo
}

const currentState: IdentOptInfo = {
    token: DewSDK.iam.auth.fetch()?.token ?? '',
    accountName: DewSDK.iam.auth.fetch()?.accountName ?? '',
    accountCode: DewSDK.iam.auth.fetch()?.accountCode ?? '',
    roleInfo: DewSDK.iam.auth.fetch()?.roleInfo ?? [],
    groupInfo: DewSDK.iam.auth.fetch()?.groupInfo ?? []
}

const reducer = (state: IdentOptInfo = currentState, action: IdentOptInfoAction) => {
    const {type} = action
    console.log('reducer....'+type)
    switch (type) {
        case "LOGIN" : {
            return action.payload
        }
        case "LOGOUT" : {
            return action.payload
        }
        default:
            throw new Error();
    }
}

export const AuthContext = React.createContext<{
    state: typeof currentState;
    dispatch: (action: IdentOptInfoAction) => void;
}>({
    state: currentState,
    dispatch: () => null
})

const ToDo = () => {

    const [state, dispatch] = React.useReducer(reducer, currentState);

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <h2>Todo Demo</h2>
            <User/>
            <Item/>
        </AuthContext.Provider>
    )
}

export default ToDo
