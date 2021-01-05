import React, {useState} from 'react'

type UserInfoDTO = {
    token: string,
    userName: string,
    roleName: string,
    userId: string
}

const User = () => {

    const [userInfo, setUserInfo] = useState<UserInfoDTO | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    function login(): void {
        alert("")
    }

    function logout(): void {
        alert("")
    }

    return (
        <div id='user-info'>
            {
                userInfo != null ?
                    <div>Hi,{userInfo.userName}
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
