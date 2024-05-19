'use client';

import Modal from "@/components/modal";
import axiosInstance from "@/helpers/axios_interceptor";
import withAdmin from "@/hoc/with_admin";
import withAuth from "@/hoc/with_auth";
import Image from "next/image";
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
}

function AdminDashboardPage() {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        address: ""
    });
    const [error, setError] = useState({ name: "", address: "" });
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const handleCreateSupermarket = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", address: "" };
        let formIsValid = true;

        if (!formData.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }
        
        setError(newError);
        if (!formIsValid) return;
        
        const res = await axiosInstance.post('/api/store/supermarket/create-supermarket', formData);
        setOpenCreateModal(false);
    }

    useEffect(() => {
        axiosInstance.get('/api/store/supermarket/all-supermarket')
            .then(res => {
                setSupermarkets(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
    }, [openCreateModal]);

    const displayedItems = supermarkets
        // .filter(
        //     (item) =>
        //     // selectedCategories.length === 0 ||
        //     // selectedCategories.includes(item.category)
        // )
        // .filter(
        //     (item) =>
        //     item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        //     item.category
        //         .toLowerCase()
        //         .includes(searchQuery.trim().toLowerCase())
        // )
        .map((item) => (
            <div className="flex flex-col rounded-lg w-[200px] h-[200px] bg-white items-center justify-center hover:cursor-pointer hover:drop-shadow-lg space-y-4">
                <Image src={`https://ui-avatars.com/api/?rounded=true&name=${item.name}`} width={50} height={50} alt={item.name}/>
                <h1 className="font-bold text-black text-sm">{item.name}</h1>
            </div>
        ));

    return (
        <>
            <title>Admin Dashboard</title>
            <section className="flex flex-col bg-light-green min-h-screen items-start justify-start pt-[100px] min-w-svw max-w-svw">
                <div className="flex w-svw px-[100px] space-x-10 justify-center">
                    <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg">
                        <h1 className="font-bold text-lg">
                            Number of Supermarkets:
                        </h1>
                        <h1 className="font-bold text-6xl m-auto">
                            {supermarkets.length}
                        </h1>
                    </div>
                    <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg">
                        <h1 className="font-bold text-lg">
                            Number of Products:
                        </h1>
                        <h1 className="font-bold text-6xl m-auto">
                            {supermarkets.reduce((sum, supermarket) => sum + supermarket.products.length, 0)}
                        </h1>
                    </div>
                    <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg">
                        <h1 className="font-bold text-lg">
                            Number of Managers:
                        </h1>
                        <h1 className="font-bold text-6xl m-auto">
                            {supermarkets.reduce((sum, supermarket) => sum + supermarket.managers.length, 0)}
                        </h1>
                    </div>
                </div>
                <div className="px-8 w-full my-8">
                    <div className="w-full h-[600px] bg-white/30 backdrop-blur-lg z-1 rounded-lg">
                        <div className="flex justify-end px-5">
                            <button onClick={(e) => setOpenCreateModal(!openCreateModal)} className="my-5 h-[50px] w-[120px] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                {/* <Image src="/vercel.svg" className="text-slate-100" alt="plus icon" width={40} height={40} /> */}
                                Create new
                            </button>
                        </div>
                        <article className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-content-center justify-items-center p-2">
                            {displayedItems}
                        </article>
                    </div>
                </div>
                {/* create supermarket modal */}
                <Modal open={openCreateModal} onClose={() => setOpenCreateModal(!open)} className="w-[600px]">
                    <form onSubmit={handleCreateSupermarket} className="space-y-6">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" name="name" id="name" className="p-2 rounded-lg"/>
                            {
                                error.name && <p className="text-red-500 text-sm">{error.name}</p>
                            }
                        </div>
                        {/* <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="address">Address</label> 
                            <input onChange={(e) => setFormData({...formData, address: e.target.value})} type="text" name="address" id="address" className="p-2 rounded-lg"/>
                            {
                                error.name && <p className="text-red-500 text-sm">{error.name}</p>
                            }
                        </div> */}
                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                        </div>
                    </form>
                </Modal>
                {/* modify supermarket modal */}
            </section>
        </>
    );
};

export default withAdmin(AdminDashboardPage);