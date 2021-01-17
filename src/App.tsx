import React from 'react'
import { render } from 'react-dom'
import Todo from './pages/todo/index'

import pack from "../package.json";
import {DewSDK} from "@idealworld/sdk";

DewSDK.init(pack.dew.serverUrl,pack.dew.appId)

render(<Todo />, document.getElementById("app"))
