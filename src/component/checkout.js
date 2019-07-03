import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class checkOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false, // state untuk toggle pop-up "Pembayaran"
            bayar: false, // state untuk toggle pop-up "Bayar"
            cart : [], // state cart
            item : [], // menampung item pada saat EDIT
            selectedID: 0 // state untuk membuka fitur EDIT
        };
    
        this.toggle = this.toggle.bind(this);
        this.toggleBayar = this.toggleBayar.bind(this);
    }

    componentDidMount(){
        this.getCart()
    }

    getCart = () => {
        axios.get('http://localhost:2019/cart')
            .then(res => {
                this.setState({cart: res.data, selectedID: 0})
            })
    }

    toggle() { // Memunculkan pop-up "Pembayaran"
        this.setState(prevState => ({
          modal: !prevState.modal // membalikan state modal menjadi true
        }));
    }

    toggleBayar() { // Memunculkan pop-up "Bayar"
        this.setState(prevState => ({
          bayar: !prevState.bayar
        }));
    }

    totalQty = () => { // Menjumlahkan Qty yang dibeli user
        var totalQty = 0 // menampung qty saat dijumlahkan
        
        for (let i = 0; i < this.state.cart.length; i++) {
            if (this.props.user.id === this.state.cart[i].idUser) {    
                totalQty += parseInt(this.state.cart[i].qty);
            }  
        }
        return (
            <td>{totalQty}</td>
        )
    }

    totalHarga = () => { // Menjumlahkan Harga barang yang dibeli user
        var cekHarga = this.state.cart.map(item=>{
            return {
                price: item.qty*item.price, // mengambil harga product yang sudah dikalikan dengan qty-nya
                idUser: item.idUser
            }
        })
        var subTotalHarga = 0 // menampung hasil penjumlahan seluruh harga

        for (let i = 0; i < this.state.cart.length; i++) {
            if (this.props.user.id === cekHarga[i].idUser) {
            subTotalHarga += parseInt(cekHarga[i].price);
            }
        }
        return (
            <td>Rp. {subTotalHarga}</td>
        )
    }

    saveProduct = () => { // menyimpan data yand sudah di-EDIT
        const qtyBaru = parseInt(this.editQty.value) 

        axios.get( // axios.get digunakan untuk mengambil stock dalam product
            'http://localhost:2019/products/'+this.state.item.idProduct
        ).then( res => {
            if (qtyBaru <= res.data.stock) { // validasi apakah qty yang akan disimpan melibihi stock
                axios.patch('http://localhost:2019/cart/'+this.state.item.id,
                            {
                                qty:qtyBaru
                            }).then(res=>{
                                alert('UPDATE: quantity product telah berhasil dirubah')
                                this.getCart()
                            })
            } else{
                alert('Stock tidak mencukupi')
            }
        })


        // VERSI TANPA STOCK

        // const qtyBaru = parseInt(this.editQty.value) 
        // axios.patch('http://localhost:2019/cart/'+this.state.item.id,
        // {
        //     qty:qtyBaru
        // }).then(res=>{
        //     this.getCart()
        // })
    }

    deleteProduct = (item) => { // menghapus product dalam cart
        axios.delete('http://localhost:2019/cart/'+item.id).then(res=>{
            this.getCart()
        })
    }

    pembayaran = () => { // me-Render cart kedalam pop-up "Pembayaran"
        return this.state.cart.map( item => { 
            if(this.props.user.id === item.idUser){
                return (
                    <tr>
                        <td>
                        <img className='list' src={item.src}/>
                        </td>
                        <td>{item.nama}</td>
                        <td>{item.price}</td>
                        <td>{item.qty}</td>
                    </tr>
                )
            }
        })
    }

    bayar = () => { // menyelesaikan transaksi
        return this.state.cart.map( item => { 
            if(this.props.user.id === item.idUser){
                axios.get( 
                        'http://localhost:2019/products',{
                            params : {
                                id:item.idProduct
                            }
                        }
                    ).then( res => { // mengurangi stock dalam product
                        const stockBaru = parseInt(res.data[0].stock) - parseInt(item.qty)
                        axios.patch( // mengupdate stock
                            'http://localhost:2019/products/'+item.idProduct,{
                            stock: stockBaru
                        }).then( // setelah selesai update database product di Cart dihapuskan
                            axios.delete('http://localhost:2019/cart/'+item.id)
                        )
                    })
            }
            this.toggleBayar() // memunculkan pop-up "Bayar"
        })

        // VERSI TANPA STOCK

        // return this.state.cart.map( item => { 
        //     if(this.props.user.id === item.idUser){
        //         axios.delete('http://localhost:2019/cart/'+item.id)
        //     }
        //     this.toggleBayar() // memunculkan pop-up "Bayar"
        // })
    }

    renderList = () => {
        if(this.props.user.username !== ''){ // udah login apa blom   
            return this.state.cart.map( item => { // ngerender
                if(item.id !== this.state.selectedID){ 
                    if(this.props.user.id === item.idUser){
                        return (
                            <tr>
                                <td>
                                <img className='list' src={item.src}/>
                                </td>
                                <td>{item.nama}</td>
                                <td>{item.price}</td>
                                <td>{item.qty}</td>
                                <td>{item.price*item.qty}</td>
                                <td>            
                                    <button className = 'btn btn-danger m-1' onClick={()=>{this.setState({selectedID : item.id, item: item})}}>Edit</button>
                                    <button className = 'btn btn-warning m-1' onClick={()=>{this.deleteProduct(item)}}>Delete</button>
                                </td>
                            </tr>
                        )
                    }
                }else {
                    if(this.props.user.id === item.idUser){
                        return (
                            <tr>
                                <td>
                                <img className='list' src={item.src}/>
                                </td>
                                <td>{item.nama}</td>
                                <td>{item.price}</td>
                                <td>
                                <input className="form-control" ref={input => {this.editQty = input}} type="text" defaultValue={item.qty}/>
                                </td>
                                <td>{item.price*item.qty}</td>
                                <td>            
                                <button className = 'btn btn-danger m-1' onClick={()=>{this.saveProduct(item)}}>Save</button>
                                <button className = 'btn btn-warning m-1' onClick={()=>{this.setState({selectedID : 0})}}>Cancel</button>
                                </td>
                            </tr>
                        )
                    }
                }
            })
        }
        return <Redirect to='/login'/>
        }

    render(){
        return(
            <div class="card row shopping-cart">
            <div className="container">
                <div class="card-header bg-dark text-light row">
                    <i class="fa fa-shopping-cart col-4" aria-hidden="true">Shopping Cart</i>
                    <Button color="primary" className="btn btn-sm col-3 m-1" onClick={this.toggle}>Pembayaran</Button>
                    <a href="/" class="btn btn-success btn-sm col-3 m-1">Continue Shopping</a>
                    <div class="clearfix"></div>
                </div>
                <table className="table table-hover mb-5">
                    <thead>
                        <tr>
                            <th scope="col">PRODUCT</th>
                            <th scope="col">NAME</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">QTY</th>
                            <th scope="col">SUBTOTAL</th>
                            <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                    </tbody>
                </table>
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader className="mx-auto">Pembayaran</ModalHeader>
                    <ModalBody>
                        <table className="table table-hover mb-5">
                        <thead>
                            <tr>
                                <th scope="col">PRODUCT</th>
                                <th scope="col">NAME</th>
                                <th scope="col">PRICE</th>
                                <th scope="col">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.pembayaran()}
                            <tr>
                                <td><b>TOTAL BARANG = </b></td>
                                {this.totalQty()}
                            </tr>
                            <tr>
                                <td><b>TOTAL HARGA = </b></td>
                                {this.totalHarga()}
                            </tr>
                        </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=>{this.bayar()}}>Bayar</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    
                    </Modal>
                    <Modal isOpen={this.state.bayar} toggle={this.toggleBayar} className={this.props.className}>
                    <ModalHeader className="mx-auto">Belanja Selesai</ModalHeader>
                    <ModalBody>
                        Terima kasih telah berbelanja di Simple E-Commerce
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" href='/'>Cancel</Button>
                    </ModalFooter>
                    </Modal>
                </div>    
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth // {id, username}
    }
}

export default connect(mapStateToProps)(checkOut)