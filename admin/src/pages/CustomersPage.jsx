import React from 'react'

const CustomersPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Customers</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Addresses</th>
              <th>Wishlist</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample customer row */}
            <tr>
              <td className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    {/* Placeholder image */}
                    <span className="text-xs">JD</span>
                  </div>
                </div>
                <div className="font-semibold">John Doe</div>
              </td>

              <td>john.doe@example.com</td>

              <td>
                <div className="badge badge-ghost">2 address(es)</div>
              </td>

              <td>
                <div className="badge badge-ghost">5 item(s)</div>
              </td>

              <td><span className="text-sm opacity-60">2023-05-15</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomersPage
