import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Row, Col} from 'antd'

const colors = new Array(36).fill('#dbdbdb')
const COLOR_LIST = ['#FFFFFF', '#000000', '#FF00000','#ff7a7a', '#ffd49c', '#fffeb3', '#f0ffb3', '#bafffd', '#baf8ff', '#abd6ff', '#d1abff', '#fbabff']

import {post} from '../../utilities'
import { socket } from '../../client-socket'

function ColoredButton (props) {
    const [color, setColor] = useState(props.color || '#dbdbdb')
    const [hovered, setHovered] = useState(false)

    function changeColor () {
        if (props.editable) {
            const currentColor = COLOR_LIST.indexOf(color)
            console.log(currentColor + 1, COLOR_LIST.length)
            if (currentColor + 1 > COLOR_LIST.length - 1) {
                setColor(COLOR_LIST[0])
                props.colorUpdated(COLOR_LIST[0])
                console.log('color', COLOR_LIST[0])
                socket.emit('color-change')
            } else {
                setColor(COLOR_LIST[currentColor + 1])
                console.log('color', COLOR_LIST[currentColor + 1])
                props.colorUpdated(COLOR_LIST[currentColor + 1])
                socket.emit('color-change')
            }
        }
    }

    return <div className={`colored-button ${hovered && 'hovered'}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => changeColor()} style={{ backgroundColor: color }} /> 
}

ColoredButton.propTypes = {
    color: PropTypes.string.isRequired,
    editable: PropTypes.boolean
}

function Board (props) {
    const [isShown, setIsShown] = useState(false);

    function colorUpdated (position, newColor) {
        post('/api/boards/color', { position, newColor }).then((res) => {
            console.log(res)
        })
    }

    return <div className='board' onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
        <div className={'colored-board'}>
            {
                props.colors.map((color, key) => {
                    return <ColoredButton key={key} color={color} editable={props.isMine} colorUpdated={(newColor) => colorUpdated(key, newColor)}/> 
                })
            } 
        </div>
        {
            (!props.isMine && isShown) && <div className={'overlay'}>
                <p> {props.ownerName} </p> 
            </div>
        }
    </div>
}

Board.propTypes = {
    isMine: PropTypes.bool,
    ownerName: PropTypes.string.isRequired
}

export default Board