import React, {useEffect, useState} from 'react'

type ItemDTO = {
    id: number,
    content: string
    createUserName: string
    createUserId: string
}

type Props = {
    loginUserId: string
}

const Item = (props: Props) => {

    const [items, setItems] = useState<ItemDTO[]>([]);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        setItems([{
            id:0,
            content: '测试测试测试测试',
            createUserName:'jzy',
            createUserId: '1'
        },{
            id:0,
            content: '测试测试测试测试',
            createUserName:'jzy',
            createUserId: '1'
        }])
    }, [])

    function deleteItem(itemId: number): void {
        alert(itemId)
    }

    function addItem(): void {
        setContent('')
    }

    return (
        <div className='item'>
            <ul className='item-ul'>
                {
                    items.map(item =>
                        <li className='item-li' key={item.id}>
                            <b className='item-li-content'>{item.content}</b>
                            <b className='item-li-info'>{item.createUserName}</b>
                            {props.loginUserId != null && props.loginUserId == item.createUserId ?
                                <button className='item-li-action'
                                        onClick={deleteItem.bind(this, item.id)}>[删除]</button>
                                :
                                ''
                            }
                        </li>)
                }
            </ul>
            <div className='item-add'>
                <input value={content} onChange={event => setContent(event.target.value)}/>
                &nbsp;<button onClick={addItem}>ADD</button>
            </div>
        </div>
    )
}

export default Item