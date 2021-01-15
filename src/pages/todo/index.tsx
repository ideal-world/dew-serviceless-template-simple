import React from 'react'
import User from "components/User";
import Item from "components/Item";
import {DewSDK} from "@idealworld/sdk";
import {IdentOptInfo} from "@idealworld/sdk/dist/domain/IdentOptInfo";

export interface IdentOptInfoAction {
    type: string
    payload: IdentOptInfo
}

export const AuthContext = React.createContext<IdentOptInfo>({
    token: DewSDK.iam.auth.fetch()?.token ?? '',
    accountName: DewSDK.iam.auth.fetch()?.accountName ?? '',
    accountCode: DewSDK.iam.auth.fetch()?.accountCode ?? '',
    roleInfo: DewSDK.iam.auth.fetch()?.roleInfo ?? [],
    groupInfo: DewSDK.iam.auth.fetch()?.groupInfo ?? []
});

const ToDo = () => {

    const [state, dispatch] = React.useReducer((prevState: IdentOptInfo, action: IdentOptInfoAction) => {
        const {type, payload} = action
        switch (type) {
            case "LOGIN" : {
                return payload
            }
            case "LOGOUT" : {
                return payload
            }
            default: {
                return payload
            }
        }
    }, {
        token: DewSDK.iam.auth.fetch()?.token ?? '',
        accountName: DewSDK.iam.auth.fetch()?.accountName ?? '',
        accountCode: DewSDK.iam.auth.fetch()?.accountCode ?? '',
        roleInfo: DewSDK.iam.auth.fetch()?.roleInfo ?? [],
        groupInfo: DewSDK.iam.auth.fetch()?.groupInfo ?? []
    });

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
