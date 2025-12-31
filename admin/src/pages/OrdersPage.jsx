import React from 'react'

const OrdersPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample order row */}
            <tr>
              <td>1001</td>
              <td>John Doe</td>     
              <td>2023-05-15</td>
              <td>$149.99</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersPage
