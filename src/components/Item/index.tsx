import React, {useEffect, useState} from 'react'
import * as TodoAction from "../../actions/TodoAction";
import {ItemDTO} from "../../actions/TodoAction";
import {AuthContext} from "../../pages/todo";

const Item = () => {

    console.log('...............2222........')

    const {state} = React.useContext(AuthContext);

    const [items, setItems] = useState<ItemDTO[]>([]);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        loadItems()
    }, [state])

    async function loadItems(): Promise<void> {
        const fetchItems = await TodoAction.fetchItems()
        setItems(fetchItems)
    }

    async function deleteItem(itemId: number): Promise<void> {
        await TodoAction.removeItem(itemId)
        await loadItems()
    }

    async function addItem(): Promise<void> {
        await TodoAction.addItem(content)
        setContent('')
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
                            {state.accountCode !== '' ?
                                <button className='item-li-action'
                                        onClick={deleteItem.bind(this, item.id)}>[删除]</button>
                                :
                                ''
                            }
                        </li>)
                }
            </ul>
            {state.accountCode !== '' ?
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
