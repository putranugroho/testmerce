import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class manageProduct extends Component {
    
   state = {
        products: [],
        selectedID: 0
    }

    componentDidMount(){
        
        this.getProduct()
    }

    getProduct = () => {
        axios.get('http://localhost:2019/products')
            .then(res => {
               this.setState({products: res.data, selectedID : 0})
            })
    }

    addProduct = () => {
        const nama = this.nama.value
        const desc = this.desc.value
        const price = this.price.value
        const stock = this.stock.value
        const src = this.pict.value

        axios.post(
            'http://localhost:2019/products',
            {
                nama: nama,
                desc: desc,
                price: price,
                stock: stock,
                src: src
            }
        ).then( (res) => {
            console.log('Data berhasil di input')
            console.log(res)
            this.getProduct()
        }).catch( (err) => {
            console.log('Gagal post data')
            console.log(err)
        })
    }

    deleteProduct = (item) => {
        
        axios.delete('http://localhost:2019/products/'+item.id).then(res=>{
            console.log("data telah dihapus");
            console.log(res);
            this.getProduct() 
        })
    }

    saveProduct = (item) => {
        const nama = this.editNama.value
        const desc = this.editDesc.value
        const price = this.editPrice.value
        const stock = this.editStock.value
        
        axios.patch('http://localhost:2019/products/'+item.id,
        {
            nama: nama,
            desc: desc,
            price: price,
            stock: stock
        }).then(res=>{
            console.log("data telah disimpan");
            console.log(res);
            this.getProduct()
        })


        // VERSI TANPA STOCK

        // const nama = this.editNama.value
        // const desc = this.editDesc.value
        // const price = this.editPrice.value
        
        // axios.patch('http://localhost:2019/products/'+item.id,
        // {
        //     nama: nama,
        //     desc: desc,
        //     price: price,
        // }).then(res=>{
        //     console.log("data telah disimpan");
        //     console.log(res);
        //     this.getProduct()
        // })
    }

    renderList = () => {
        return this.state.products.map( item => { // {id, name, price, desc, src}
            if(item.id !== this.state.selectedID){
                return (
                <tr>
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>{item.desc}</td>
                    <td>{item.price}</td>
                    <td>{item.stock}</td>
                    <td>
                        <img className='list' src={item.src}/>
                    </td>
                    <td>            
                        <Button color="danger" onClick={()=>{this.setState({selectedID : item.id})}}>Edit</Button>
                        <button className = 'btn btn-warning m-1' onClick={()=>{this.deleteProduct(item)}}>Delete</button>
                    </td>
                </tr>
                )
            } else {
                return (
                    <tr>
                        <td>{item.id}</td>
                        <td>
                            <input className="form-control" ref={input => {this.editNama = input}} type="text" defaultValue={item.nama}/>
                        </td>
                        <td>
                            <input className="form-control" ref={input => {this.editDesc = input}} type="text" defaultValue={item.desc}/>
                        </td>
                        <td>
                            <input className="form-control" ref={input => {this.editPrice = input}} type="text" defaultValue={item.price}/>
                        </td>
                        <td>
                            <input className="form-control" ref={input => {this.editStock = input}} type="text" defaultValue={item.stock}/>
                        </td>
                        <td>
                            <img className='list' src={item.src}/>
                        </td>
                        <td>            
                            <button className = 'btn btn-danger m-1' onClick={()=>{this.saveProduct(item)}}>Save</button>
                            <button className = 'btn btn-warning m-1' onClick={()=>{this.setState({selectedID : 0})}}>Cancel</button>
                        </td>
                    </tr>
                )
            }
        })
        
    }

    render () {
    if (this.props.user.username !== '') {
        return (
            <div className="container">
                <h1 className="display-4 text-center">List Product</h1>
                <table className="table table-hover mb-5">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">NAME</th>
                            <th scope="col">DESC</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">STOCK</th>
                            <th scope="col">PICTURE</th>
                            <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                    </tbody>
                </table>
                <h1 className="display-4 text-center">Input Product</h1>
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th scope="col">NAME</th>
                            <th scope="col">DESC</th>
                            <th scope="col">PRICE</th>
                            <th scope='col'>STOCK</th>
                            <th scope="col">PICTURE</th>
                            <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="col"><input ref={input => this.nama = input} className="form-control" type="text" /></th>
                            <th scope="col"><input ref={input => this.desc = input} className="form-control" type="text" /></th>
                            <th scope="col"><input ref={input => this.price = input} className="form-control" type="text" /></th>
                            <th scope="col"><input ref={input => this.stock = input} className="form-control" type="text" /></th>
                            <th scope="col"><input ref={input => this.pict = input} className="form-control" type="text" /></th>
                            <th scope="col"><button className="btn btn-outline-warning" onClick={this.addProduct}>Add</button></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    } return <Redirect to='/login'/>
    }

}

const mapStatetoProps = state => {
    return {
        user: state.auth
    }
}


export default connect(mapStatetoProps)(manageProduct)
