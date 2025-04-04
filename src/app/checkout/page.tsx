import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      
      {/* Checkout form for user to enter shipping details */}
      <form>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input type="text" className="w-full p-2 border rounded" placeholder="Enter your name" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Address</label>
          <input type="text" className="w-full p-2 border rounded" placeholder="Enter your address" />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
