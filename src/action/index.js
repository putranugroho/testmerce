import axios from 'axios'
import cookies from 'universal-cookie'

const cookie = new cookies()

export const onLoginUser = (user, pswrd) => {
    return (dispatch) => {
        axios.get(
            'http://localhost:2019/users',
            {
                params: {
                    username: user,
                    password: pswrd
                }
            }
        ).then( res => {
            // Jika Username ditemukan, array.length > 0
            if(res.data.length > 0){
                const {id, username} = res.data[0]
                // console.log(res.data[0].username + " berhasil login");
                dispatch(
                    {
                        type: 'LOGIN_SUCCESS', // untuk menentukan reducer mana yang akan memproses
                        payload: {
                            id,username
                        } // berisi data yang akan di taruh di state
                    }
                )
                // Save data kedalam cookie
                cookie.set('userName', {id,username}, {path: '/'})
            } else {
                console.log('Username / Password salah')
            }
        })

    }
}

export const keepLogin = (objUser) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: {
            id: objUser.id,
            username: objUser.username
        }
    }
}

export const onLogoutUser = () => {
    cookie.remove('userName')
    return {
        type: "LOGOUT_SUCCESS"
    }
}