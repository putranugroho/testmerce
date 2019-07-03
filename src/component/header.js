import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { onLogoutUser } from '../action'

import {
    Button,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import Axios from 'axios';

    class Header extends Component {
        state = {
            cart : []
        }

        componentDidMount(){
            Axios.get('http://localhost:2019/cart').then(res=>this.setState({cart:res.data}))
        }

        onButtonClick = () => {
            this.props.onLogoutUser()
        }

        // Menampilkan jumlah product yang berada dalam Cart
        jumlahCart = () => {
            var cart = 0
            for (let i = 0; i < this.state.cart.length; i++) {
                if(this.props.user.id === this.state.cart[i].idUser){
                    cart += 1
                }
            }
            return (cart)
        }
    
        render () {
            if(this.props.user.username === ''){
                // Render ketika belum login
                return (
                    <div>
                        <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">Simple E-Commerce</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link to='/' >All Products</Link>
                            </NavItem>
                            <NavItem>
                                <Link to='/register'>
                                    <Button color="primary" className="mx-3">Register</Button>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link to='/login' >
                                    <Button color="success">Login</Button>
                                </Link>
                            </NavItem>
                            </Nav>
                        </Collapse>
                        </Navbar>
                    </div>
                )
            } 
    
            // Render setelah login
            return (
                <div>
                    <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">Simple E-Commerce</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                        <NavItem className='mt-2 ml-auto'>
                            <Link to='/' >All Products</Link>
                        </NavItem>
                        <NavItem className='mt-2 ml-auto'>
                        <Link to='/checkout' >
                            <button className = 'btn btn-primary ml-4 mt-auto'>{this.jumlahCart()}
                            <img id='cart' className='ml-2 mr-2' src='https://image.flaticon.com/icons/svg/34/34568.svg'></img>Shopping Cart 
                            </button>
                        </Link>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Welcome, {this.props.user.username}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                            <Link to='/manageProduct' >Manage Product</Link>
                            </DropdownItem>
                            {/* <DropdownItem>
                            <Link to='/checkout' >Check-out</Link>
                            </DropdownItem> */}
                            <DropdownItem divider />
                            <Link to='/login' >
                            <Button className="dropdown-item" onClick={this.onButtonClick}>
                            Logout
                            </Button>
                            </Link>
                        </DropdownMenu>
                        </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
                
                        
              );
        }
    }
    
    const mapStateToProps = state => {
        return {
            user: state.auth // {id, username}
        }
    }
    
    export default connect(mapStateToProps,{onLogoutUser})(Header)