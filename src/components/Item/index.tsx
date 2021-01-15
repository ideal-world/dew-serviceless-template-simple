import React, {useEffect, useState} from 'react'
import * as TodoAction1 from "../../actions/TodoAction1";
import {ItemDTO} from "../../actions/TodoAction1";
import * as TodoAction2 from "../../actions/TodoAction2";
import {AuthContext} from "../../pages/todo";

const Item = () => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {state, dispatch} = React.useContext(AuthContext);

    const [items, setItems] = useState<ItemDTO[]>([]);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        loadItems()
    }, [])

    async function loadItems(): Promise<void> {
        setItems(await TodoAction1.fetchItems())
    }

    async function deleteItem(itemId: number): Promise<void> {
        await TodoAction2.removeItem(itemId)
        await loadItems()
    }

    async function addItem(): Promise<void> {
        await TodoAction1.addItem(content)
        await loadItems()
    }

    return (
        <div className='item'>
            <ul className='item-ul'>
                {
                    items.map(item =>
                        <li className='item-li' key={item.id}>
                            <b className='item-li-content'>{item.content}</b>
                            <b className='item-li-info'>{item.createUserName}</b>
                            {state != null ?
                                <button className='item-li-action'
                                        onClick={deleteItem.bind(this, item.id)}>[删除]</button>
                                :
                                ''
                            }
                        </li>)
                }
            </ul>
            {state != null ?
                <div className='item-add'>
                    <input value={content} onChange={event => setContent(event.target.value)}/>
                    &nbsp;
                    <button onClick={addItem}>ADD</button>
                </div>
                : ''
            }
        </div>
    )
}

export default Item
