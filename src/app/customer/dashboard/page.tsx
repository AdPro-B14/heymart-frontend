'use client';

import Modal from "@/components/modal";
import axiosInstance from "@/helpers/axios_interceptor";
import withCustomer from "@/hoc/with_customer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface Supermarket {
    id: number;
    name: string;
    managers: string[];
    products: Product[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    supermarket_id: number;
}

function AdminDashboardPage() {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket>({ id: 0, name: "", managers: [], products: []});
    const [openProductModal, setOpenProductModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axiosInstance.get('/api/store/supermarket/all-supermarket')
            .then(res => {
                setSupermarkets(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
    }, []);

    const displayedItems = supermarkets
        .map((item) => (
            <div key={`supermarket-${item.id}`} id={`supermarket-${item.id}`} onClick={() => { router.push(`/customer/dashboard/${item.id}`);  }} className="flex flex-col rounded-lg w-[200px] h-[200px] bg-white items-center justify-center hover:cursor-pointer hover:drop-shadow-lg space-y-4">
                <Image src={`https://ui-avatars.com/api/?rounded=true&name=${item.name}`} width={50} height={50} alt={item.name}/>
                <h1 className="font-bold text-black text-sm">{item.name}</h1>
            </div>
        ));

    return (
        <>
            <title>Customer Dashboard</title>
            <section className="flex flex-col bg-light-green min-h-screen items-start justify-start pt-[100px] min-w-svw max-w-svw">
            <div className="flex justify-center w-full my-4">
                    <button
                        onClick={() => router.push('/customer/balance')}
                        className="bg-dark-green-3 text-white p-2 rounded-lg"
                    >
                        Balance
                    </button>
                </div>
                <div className="px-8 w-full my-8">
                    <div className="w-full h-[600px] bg-white/30 backdrop-blur-lg z-1 rounded-lg">
                        <article className="w-full h-[500px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center overflow-scroll">
                            {displayedItems}
                        </article>
                    </div>
                </div>
                {/* create supermarket modal */}
                {/* <Modal open={openCreateModal} onClose={() => setOpenCreateModal(!openCreateModal)} className="w-[600px]">
                    <form onSubmit={handleCreateSupermarket} className="space-y-6">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setFormCreateSupermarketData({...formCreateSupermarketData, name: e.target.value})} type="text" name="name" id="name" className="p-2 rounded-lg"/>
                            {
                                errorSupermarket.name && <p className="text-red-500 text-sm">{errorSupermarket.name}</p>
                            }
                        </div>
                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                        </div>
                    </form>
                </Modal> */}
            </section>
        </>
    );
};

export default withCustomer(AdminDashboardPage);