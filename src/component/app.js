import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import cookies from 'universal-cookie'
import { connect } from 'react-redux'

import Register from './register'
import Home from './home'
import Header from './header'
import manageProduct from './manageProduct'
import Login from './login'
import { keepLogin } from '../action'
import detailProduct from './detailProduct'
import checkOut from './checkout'

const cookie = new cookies()

class App extends React.Component{
    
    componentDidMount(){
        // Check cookie
        const objCookie = cookie.get("userName")

        if (objCookie !== undefined) {
            // Login ulang
            this.props.keepLogin(objCookie)
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header/>
                    <Route path='/' exact component={Home}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/manageproduct' component={manageProduct}/>
                    <Route path='/detailproduct/:product_id' component={detailProduct}/>
                    <Route path='/checkout' component={checkOut}/>
                </div>
            </BrowserRouter>
        )   
    }
}

export default connect(null, {keepLogin})(App)