import React from 'react'
import { Footer, Navbar, Product } from "../components"
import { Link } from "react-router-dom"

const Products = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <div className="row justify-content-center">
          <Product />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Products