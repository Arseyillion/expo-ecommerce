import React from 'react'

const ProductsPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Products</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample product row */}
            <tr>
              <td>1</td>
              <td>Sample Product</td>     
              <td>$29.99</td>
              <td>100</td>
              <td>Electronics</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsPage
