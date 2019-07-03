import React, {Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

class Register extends Component {

    onButtonClick = () => {
        const user = this.username.value
        const Email = this.email.value
        const pswrd = this.password.value

        // GET, axios.get  -> Mengunduh data
        // GET Username
        axios.get(
            'http://localhost:2019/users',
            {
                params: {
                    username: user
                }
            }
        ).then( res => {

            // Jika Username ditemukan, array.length > 0
            if(res.data.length > 0){
                console.log('Username sudah di gunakan')
            } else {

                // Check berdasarkan email
                axios.get(
                    'http://localhost:2019/users',
                    {
                        params: {
                            email: Email
                        }
                    }
                ).then(res => {
                    // Jika Email di temukan, array.length > 0
                    if(res.data.length > 0){
                        console.log('Email sudah digunakan')
                    } else {
                        // post data
                        axios.post(
                            'http://localhost:2019/users',
                            {
                                username: user,
                                email: Email,
                                password: pswrd
                            }
                        ).then( (res) => {
                            console.log('Data berhasil di input')
                            console.log(res)
                        }).catch( (err) => {
                            console.log('Gagal post data')
                            console.log(err)
                        })
                    }
                })
            }

        }).catch( err => {
            console.log('Gagal request')
        })

        // alert('Success')
    }

    render (){
        return (
            <div> 
                <div className='mt-3 row'> 
                    <div className='col-sm-5 mx-auto card'>
                        <div className='card-body'>
                            <div className='border-bottom border-secondary card-title'>
                                <h1>Register</h1>
                            </div>
                            <div className='card-title'>
                                <h4>Username</h4>
                            </div>
                            <form className='input-group'>
                                <input className='form-control' type='text' ref={(input)=>{this.username = input}}/>
                            </form>
                            <div className='card-title'>
                                <h4>Email</h4>
                            </div>
                            <form className='input-group'>
                                <input className='form-control' ref={(input)=>{this.email = input}}/>
                            </form>
                            <div className='card-title'>
                                <h4>Password</h4>
                            </div>
                            <form className='input-group'>
                                <input className='form-control' type='password' ref={(input)=>{this.password = input}}/>
                            </form>
                            <button className='btn btn-primary' onClick={this.onButtonClick}>
                                Click for Register
                            </button>
                            <p>Sudah memiliki akun ? <Link to='/login'>Login Disini!</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register