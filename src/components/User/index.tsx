import React, {useState} from 'react'
import {IdentOptInfo} from "@idealworld/sdk/dist/domain/IdentOptInfo";
import {DewSDK} from "@idealworld/sdk";
import {AuthContext} from "../../pages/todo";


const User = () => {

    const {dispatch} = React.useContext(AuthContext);

    const [userInfo, setUserInfo] = useState<IdentOptInfo | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function login(): Promise<void> {
        const info = await DewSDK.iam.account.login(userName, password)
        setUserInfo(info)
        dispatch({
            type: 'LOGIN',
            payload: info
        })
    }

    async function logout(): Promise<void> {
        await DewSDK.iam.account.logout()
        setUserInfo(null)
        dispatch({
            type: 'LOGOUT',
            payload: {
                token: '',
                accountName: '',
                accountCode: '',
                roleInfo: [],
                groupInfo: []
            }
        })
    }

    return (
        <div id='user-info'>
            {
                userInfo != null ?
                    <div>Hi,{userInfo.accountName}
                        <button onClick={logout}>Logout</button>
                    </div>
                    :
                    <div>
                        User Name: <input value={userName} onChange={event => setUserName(event.target.value)}/>
                        &nbsp;Password: <input value={password} onChange={event => setPassword(event.target.value)}/>
                        &nbsp;
                        <button onClick={login}>Login</button>
                    </div>
            }
        </div>
    )
}

export default User
