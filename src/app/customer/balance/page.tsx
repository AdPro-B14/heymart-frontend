"use client";

import Modal from "@/components/modal";
import React, { FormEvent, useEffect, useState } from 'react';
import axiosInstance from "@/helpers/axios_interceptor";

interface CustomerBalance {
  id: number;
  amount: number;
  customerId: number;
}

const CustomerBalancePage: React.FC = () => {
  const [balance, setBalance] = useState<CustomerBalance>();
  const [newAmount, setNewAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get('/api/order/customer-balance/get-balance')
      .then(res => {
        setBalance(res.data);
        console.log(res.data);
      }).catch(err => {
        console.log(err);
      });
  }, []);

  const handleOpenModal = () => {
    if (balance) {
      setNewAmount(0);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNewAmount = () => {
    axiosInstance.put('/api/order/customer-balance/top-up', { amount: newAmount })
      .then(res => {
        setBalance(res.data);
        setIsModalOpen(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <section className="flex flex-col bg-light-green min-h-screen items-center justify-center">
      <div className="px-8 w-full my-8 max-w-2xl">
        <div className="w-full h-auto bg-white/30 backdrop-blur-lg rounded-lg p-8">
          <article className="w-full text-center">
            <div>
              {balance ? (
                <div>
                  <h1 className="text-4xl font-bold mb-4">Customer Balance</h1>
                  <p className="text-2xl mb-2">ID: {balance.id}</p>
                  <p className="text-2xl mb-2">Customer ID: {balance.customerId}</p>
                  <p className="text-2xl mb-4">Amount: {balance.amount}</p>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleOpenModal}
                  >
                    Top Up
                  </button>
                </div>
              ) : (
                <div className="text-2xl">No balance data available</div>
              )}
            </div>
          </article>
        </div>
      </div>

      <Modal
        title="Top Up"
        open={isModalOpen}
        onClose={handleCloseModal}
        className="w-96"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveNewAmount();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newAmount">
              Top Up Amount
            </label>
            <input
              type="number"
              id="newAmount"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default CustomerBalancePage;
