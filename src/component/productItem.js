import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux'

class ProductItem extends Component {

    refresh = (reload) => {
        document.location.reload(reload)
    }

    addToCart = () => {
        const idUsername = this.props.user.id
        const qty = parseInt(this.qty.value)
        var {id,nama,price,stock,src} = this.props.products
        
        // melakukan validasi apakah user telah login & memasukan qty saat menekan "Add to Cart"
        if(qty > 0 && idUsername !== ""){
                axios.get(
                    'http://localhost:2019/cart',
                    {
                        params: {
                            idUser: idUsername,
                            idProduct: id
                        }
                    }
                ).then( res => {
                    if(res.data.length > 0){     
                        const totalQty = parseInt(res.data[0].qty) + parseInt(qty)  
                        if (totalQty<stock) { // mengecek apakah qty yg dibeli melebihi stock barang
                            axios.put('http://localhost:2019/cart/'+res.data[0].id,
                            { // jika user tsb telah memasukan product tersebut maka jumlah qty akan di update
                                idUser: idUsername,
                                idProduct: id,
                                nama: nama,
                                qty: totalQty,
                                price: price,
                                src: src
                            }).then(res=>{
                                alert('UPDATE: quantity product telah ditambahkan')
                                document.location.reload(true)
                            })
                        } else {
                            alert('Jumlah barang yang dibeli melibihi stock')
                        }
                    } else { // jika belum ada productnya maka akan menambahkan product baru kedalam Cart
                        axios.post('http://localhost:2019/cart',
                        {
                            idUser: idUsername,
                            idProduct: id,
                            nama: nama,
                            qty: qty,
                            price: price,
                            src: src
                        }).then(res=>{
                            alert('NEW: product baru telah dimasukan kedalam cart')
                            document.location.reload(true)
                        })
                    }
                })    
        } else {
            if(idUsername === ""){ // memunculkan alert jika blom login
                alert('Silahkan login terlebih dahulu untuk melanjutkan transaksi')
            } else{ // memunculkan alert jika belom memasukan qty
                alert('masukan jumlah barang yang ingin dibeli')
            }
            
        }
        return (
            this.qty.value = 0
        )
    }

    
    // ADDTOCART TANPA MENGGUNAKAN STOCK

    // addToCart = () => {
    //     const idUsername = this.props.user.id
    //     const qty = parseInt(this.qty.value)
    //     var {id,nama,price,src} = this.props.products
        
    //     // melakukan validasi apakah user telah login & memasukan qty saat menekan "Add to Cart"
    //     if(qty >= 0 && idUsername !== ""){
    //             axios.get(
    //                 'http://localhost:2019/cart',
    //                 {
    //                     params: {
    //                         idUser: idUsername,
    //                         idProduct: id
    //                     }
    //                 }
    //             ).then( res => {
    //                 if(res.data.length > 0){     
    //                     const totalQty = parseInt(res.data[0].qty) + parseInt(qty)  
    //                         axios.put('http://localhost:2019/cart/'+res.data[0].id,
    //                         { // jika user tsb telah memasukan product tersebut maka jumlah qty akan di update
    //                             idUser: idUsername,
    //                             idProduct: id,
    //                             nama: nama,
    //                             qty: totalQty,
    //                             price: price,
    //                             src: src
    //                         }).then(res=>{
    //                             alert('UPDATE: quantity product telah ditambahkan')
    //                         })
    //                 } else { // jika belum ada productnya maka akan menambahkan product baru kedalam Cart
    //                     axios.post('http://localhost:2019/cart',
    //                     {
    //                         idUser: idUsername,
    //                         idProduct: id,
    //                         nama: nama,
    //                         qty: qty,
    //                         price: price,
    //                         src: src
    //                     }).then(res=>{
    //                         alert('NEW: product baru telah dimasukan kedalam cart')
    //                     })
    //                 }
    //             })    
    //     } else {
    //         if(idUsername === ""){ // memunculkan alert jika blom login
    //             alert('Silahkan login terlebih dahulu untuk melanjutkan transaksi')
    //         } else{ // memunculkan alert jika belom memasukan qty
    //             alert('masukan jumlah barang yang ingin dibeli')
    //         }
            
    //     }
    //     return this.qty.value = 0
    // }

    render () {
        var {id,nama,price,src,stock} = this.props.products
            return (
                <div className='card-body col-3 m-5'>
                    <img className='card-img-top' src={src}/>
                    <div className='card-body'>
                        <h5 className='card-title'>{nama}</h5>
                        <p className='card-text'>Rp. {price}</p>
                        <p className='card-text'>Stock Barang = {stock}</p>
                        <input className="form-control" ref={input => {this.qty = input}} type="text" defaultValue='0'/>
                        <Link to={'/detailproduct/' + id}>
                        <button className='btn btn-outline-primary btn-block'>Detail</button>
                        </Link>                   
                        <button className='btn btn-primary btn-block' onClick={()=>{this.addToCart(this.props.products)}}>Add To Cart</button>
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

export default connect(mapStateToProps)(ProductItem)