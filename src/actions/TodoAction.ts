import {DewSDK} from "@idealworld/sdk";
import {ResourceKind} from "@idealworld/sdk/dist/domain/Enum";

export type ItemDTO = {
    id: number
    content: string
    createUserName: string
    createUserId: string
}

const DB_URL = "mysql://127.0.0.1:6379/test"
const DB_USER = "test"
const DB_PWD = "test"

export const db = DewSDK.reldb.subject("todoDB")

async function init() {
    await DewSDK.iam.resource.subject.create('todoDB', ResourceKind.RELDB, "ToDo数据库", DB_URL, DB_USER, DB_PWD)
    await db.exec(`create table if not exists todo
(
    id bigint auto_increment primary key,
    create_time timestamp default CURRENT_TIMESTAMP null comment '创建时间',
    create_user varchar(255) not null comment '创建者OpenId',
    content varchar(255) not null comment '内容'
)
comment '任务表'`, [])
    await db.exec('insert into todo(content,create_user) values (?,?)', ['这是个示例', ''])
}

init()

export async function fetchItems(): Promise<ItemDTO[]> {
    return doFetchItems()
}

async function doFetchItems(): Promise<any> {
    if (DewSDK.iam.auth.fetch() === null) {
        return []
    }
    if (DewSDK.iam.auth.fetch()?.roleInfo.some(r => r.defCode === 'APP_ADMIN')) {
        return db.exec('select * from todo', [])
    }
    const xxx = await db.exec<ItemDTO>('select * from todo where create_user = ?', [DewSDK.iam.auth.fetch()?.accountCode])
    return xxx
}

export async function addItem(content: string): Promise<null> {
    if (DewSDK.iam.auth.fetch() == null) {
        throw '请先登录'
    }
    await DewSDK.cache.set("xxx", content)
    return db.exec('insert into todo(content,create_user) values (?, ?)', [content, DewSDK.iam.auth.fetch()?.accountCode])
        .then(() => null)
}

export async function removeItem(itemId: number): Promise<null> {
    if (DewSDK.iam.auth.fetch()?.roleInfo.some(r => r.defCode === 'APP_ADMIN')) {
        return db.exec('delete from todo where id = ? ', [itemId])
            .then(() => null)
    }
    return db.exec('delete from todo where id = ? and create_user = ?', [itemId, DewSDK.iam.auth.fetch()?.accountCode])
        .then(delRowNumber => {
            // TODO
            if (delRowNumber[0] === 1) {
                return null
            }
            throw '权限错误'
        })
}
