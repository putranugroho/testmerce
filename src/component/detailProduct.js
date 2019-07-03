import React, { Component } from 'react'
import axios from 'axios'

class DetailProduct extends Component {
    state = {
        products : {
            // id: '',
            // nama: '',
            // price: '',
            // desc: '',
            // price: ''
        }
    }
    
    componentDidMount(){
        let pro_id = this.props.match.params.product_id

        axios.get('http://localhost:2019/products/' + pro_id)
        .then(res => {
            this.setState({products: res.data})
            console.log(res.data);
            
        })
    }
    
    render() {
        // this.props.match.params.product_id
        // /detailproduct/:product_id -> definisi
        // /detailproduct/78 -> menggunakan\
        var {id, nama, price, desc, src} = this.state.products
            return (
                <div className='card-body col-3 m-5'>       
                    <img className='card-img-top' src={src}/>
                    <div className='card-body'>
                        <h5 className='card-title'>{nama}</h5>
                        <p className='card-text'>{desc}</p>
                        <p className='card-text'>Rp. {price}</p>
                        <button className='btn btn-outline-primary btn-block'>Detail</button>
                        <button className='btn btn-primary btn-block'>Add To Cart</button>
                    </div>
                </div>
            )
    }
}

export default DetailProduct