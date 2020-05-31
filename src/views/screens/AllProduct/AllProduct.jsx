import React from "react";
import ProductCard from "../../components/Cards/ProductCard";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faGrinHearts, faHeart as heartOutlined } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid, faKissWinkHeart } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { cartUpdate, wishlistUpdate } from '../../../redux/actions'
import swal from 'sweetalert'
import "./AllProduct.css"
const CircleBg = ({ children }) => {
  return <div className="lingkaran">{children}</div>;
};

class AllProduct extends React.Component {
  state = {
    liked: false,
    productData: [],
    wishtlistProductId: []
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ productData: res.data });
        this.props.wishlistUpdate(this.props.user.id)
      })
      .catch((err) => {
        console.log(err);
      });
  };


  addToWishListHandler = (id) => {
    Axios.post(`${API_URL}/wishlist`, {
      userId: this.props.user.id,
      productId: id,
    })
      .then((res) => {
        console.log(res);
        swal("Add to cart", "Your item has been added to your wishlist", "success");
        this.getProductData()
      })
      .catch((err) => {
        console.log(err);
      });
  }


  deleteWishList = (idToDelete) => {
    
    Axios.get(`${API_URL}/wishlist/`, {
      params: {
        userId: this.props.user.id,
        productId: idToDelete
      }
    })
      .then(res => {
        console.log(res.data)
        Axios.delete(`${API_URL}/wishlist/${res.data[0].id}`)
          .then(res => {
            swal("Add to cart", "Your item has been deleted from your wishlist", "success");
            this.getProductData()
            console.log(res)
          })
          .catch(err => {
            alert('sad')
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })

  }
  renderProducts = () => {
    const { productData } = this.state
    // console.log(this.state.bestSellerData)
    return productData.map((val) => {
      return <>
        <div key={`best-seller${val.id}`}>
          <div style={{ position: "absolute", zIndex: "2", marginTop: "15px", marginLeft: "20px", color: "red" }}>
            {this.props.user.wishListItems.includes(val.id) ?
              <CircleBg>
                <FontAwesomeIcon
                  style={{ fontSize: "20px" }}
                  icon={heartSolid} onClick={() => this.deleteWishList(val.id)}
                />
              </CircleBg>

              :

              <CircleBg>
                <FontAwesomeIcon
                  style={{ fontSize: "20px" }}
                  icon={heartOutlined} onClick={() => this.addToWishListHandler(val.id)}
                />
              </CircleBg>
            }
          </div>
          <div style={{ zIndex: "1", position: "relative" }}>
            <Link to={`/product/${val.id}`}>
              <ProductCard data={val} className="m-2" />
            </Link>
          </div>
        </div>
      </>
    })
  }
  render() {
    console.log(this.props.user.wishListItems)
    return (
      <div className="container">
        {/* BEST SELLER SECTION */}
        <h2 className="text-center font-weight-bolder mt-5">All Product Available</h2>
        <div className="row d-flex flex-wrap justify-content-center">
          {this.renderProducts()}
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  cartUpdate, wishlistUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProduct);