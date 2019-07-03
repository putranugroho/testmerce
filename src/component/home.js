import React, { Component } from 'react'
import axios from 'axios'

import ProductItem from './productItem'
import { parse } from '@babel/parser';

class Home extends Component {
    state = {
        products: [],
        searchProducts: []
    }

    componentDidMount(){
        this.getProduct()
    }

    onBtnSearch = () => {
        const name = this.name.value
        const max = parseInt(this.max.value) 
        const min = parseInt(this.min.value)

        var arrSearch = this.state.searchProducts.filter (item => {
            if(isNaN(min) && isNaN(max)){ // Search by Name
                return (
                    item.nama.toLowerCase().includes(name.toLowerCase())
                )
            } else if (isNaN(min)){ // Name and Max
                return (
                    item.nama.toLowerCase().includes(name.toLowerCase())
                    &&
                    item.price <= max
                )
            } else if (isNaN(max)){ // Name and Max
                return (
                    item.nama.toLowerCase().includes(name.toLowerCase())
                    &&
                    item.price >= min
                )
            } else if (item.price <= max && item.price >= min){
                return (
                    item.nama.toLowerCase().includes(name.toLowerCase())
                    &&
                    (item.price <= max && item.price >= min)
                )
            }
        })

        this.setState({products: arrSearch})
    }

    getProduct = () => {
        axios.get('http://localhost:2019/products')
            .then(res => {
               this.setState({products: res.data, searchProducts: res.data})
            })
    }

    renderList = () => {
        return this.state.products.map(item => { // hasil map = item{id,name,desc,price,src}
            return (
                <ProductItem products={item}/>
            )
        })
    }

    render () {
        return (
            <div className="row">
                <div className="col">
                    <div className="mt-5">
                        <div className="mx-auto card">
                            <div className="card-body">
                                <div className="border-bottom border-secondary card-title">
                                    <h1>Search</h1>
                                </div>
                                <div className="card-title mt-1">
                                    <h4>Name</h4>
                                </div>
                                <form className="input-group"><input ref={input => this.name = input} className="form-control" type="text"/></form>
                                <div className="card-title mt-1">
                                    <h4>Price</h4>
                                </div>
                                <form className="input-group"><input placeholder="Minimum" ref={input => this.min = input} className="form-control mb-2" type="text" /></form>
                                <form className="input-group"><input placeholder="Maximum" ref={input => this.max = input} className="form-control" type="text" /></form>
                                <button onClick={this.onBtnSearch} className="btn btn-outline-secondary btn-block mt-5">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-10">
                    {this.renderList()}
                </div>
            </div>
        )
    }
}

export default Home