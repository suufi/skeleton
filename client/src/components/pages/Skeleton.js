import React, { useEffect, useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import PropTypes from 'prop-types'

import "../../utilities.css";
import "./Skeleton.css";

import Board from '../modules/Board'
import { Spin } from 'antd'

import {get, post} from '../../utilities'
import { socket } from '../../client-socket'

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "429916370949-ivcnbiuudv30q9t4nvjm5bnu6s3mim59.apps.googleusercontent.com";

function Skeleton (props) {

    const [boards, setBoards] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        socket.on('colors', (payload) => {
            console.log('colors', payload)
            setBoards(payload)
        })


        get('/api/boards').then((res) => {
            if (res) {
                console.log(res)
                setBoards(res)
                setLoaded(true)
            }
        })

    }, [])

    function createBoard() {
        post('/api/boards').then((res) => {
            if (res) {
                setBoards(res)
            }
        })
    }

    return loaded ? (
      <main>
        {props.userId ? (
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={(res) => { props.handleLogin(res); setTimeout(() => { createBoard() }, 1000) }}
            onFailure={(err) => console.log(err)}
          />
        )}

        <h1> Colorscape! </h1>
        <div className='boards-container'> 
            {
                boards.map((board) => {
                    return <Board ownerName={board.author.name} isMine={board.author._id === props.userId} colors={board.colors} />
                })
            }
        </div>
      </main>
    ) : (
        <main>
            <Spin />
        </main>
    )
}

Skeleton.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired
}


export default Skeleton;
