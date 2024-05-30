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

interface Coupon {
    couponId: string;
    supermarketId: number;
    couponName: string;
    couponNominal: number;
    minimumBuy: number;
}

function AdminDashboardPage() {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket>({ id: 0, name: "", managers: [], products: []});
    const [formCreateSupermarketData, setFormCreateSupermarketData] = useState({
        name: "",
        address: ""
    });
    const [formAddManagerData, setFormAddManagerData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [formCreateCouponData, setFormCreateCouponData] = useState<Coupon>({
        couponId: "",
        supermarketId: 0,
        couponName: "",
        couponNominal: 0,
        minimumBuy: 0
    });
    const [errorSupermarket, setErrorSupermarket] = useState({ name: "", address: "" });
    const [errorManager, setErrorManager] = useState({ name: "", email: "", password: "" });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openManagerModal, setOpenManagerModal] = useState(false);
    const [openCouponModal, setOpenCouponModal] = useState(false);
    const [errorCoupon, setErrorCoupon] = useState({ couponName: "", couponNominal: "", minimumBuy: "" }); // Define errorCoupon state variable



    const handleCreateSupermarket = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", address: "" };
        let formIsValid = true;

        if (!formCreateSupermarketData.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }
        
        setErrorSupermarket(newError);
        if (!formIsValid) return;
        
        const res = await axiosInstance.post('/api/store/supermarket/create-supermarket', formCreateSupermarketData);
        setOpenCreateModal(false);
    }

    const handleEditSupermarket = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", address: "" };
        let formIsValid = true;

        if (!selectedSupermarket.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }
        
        setErrorSupermarket(newError);
        if (!formIsValid) return;
        
        console.log(selectedSupermarket);
        const res = await axiosInstance.put(`/api/store/supermarket/edit-supermarket/${selectedSupermarket.id}`, selectedSupermarket);
        setOpenEditModal(false);
    }

    const handleAddManager = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", email: "", password: "" };
        let formIsValid = true;

        if (!formAddManagerData.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }

        if (!formAddManagerData.email) {
            formIsValid = false;
            newError.email = "Email is required";
        }
        
        if (!formAddManagerData.password) {
            formIsValid = false;
            newError.password = "Password is required";
        }
        
        setErrorManager(newError);
        if (!formIsValid) return;
        
        const res = await axiosInstance.put(`/api/store/supermarket/add-manager/${selectedSupermarket.id}`, formAddManagerData);
        
        axiosInstance.get('/api/store/supermarket/supermarket', { params: { id: selectedSupermarket.id } })
            .then(res => {
                setSelectedSupermarket(res.data);
            }).catch(err => {
                console.log(err);
            });

        setOpenManagerModal(false);
        setOpenEditModal(true);
    }

    const handleCreateCoupon = async (event: FormEvent<HTMLFormElement>) => {
        // Function to create a new coupon
        event.preventDefault();

        const newError = { couponName: "", couponNominal: "", minimumBuy: "" };
        let formIsValid = true;

        if (!formCreateCouponData.couponName) {
            formIsValid = false;
            newError.couponName = "Coupon name is required";
        }
        
        if (formCreateCouponData.couponNominal <= 0) {
            formIsValid = false;
            newError.couponNominal = "Coupon nominal must be greater than 0";
        }
        
        if (formCreateCouponData.minimumBuy <= 0) {
            formIsValid = false;
            newError.minimumBuy = "Minimum buy must be greater than 0";
        }

        setErrorCoupon(newError);
        if (!formIsValid) return;
        try {
            const res = await axiosInstance.post('/api/order/transaction-coupon/create-transaction-coupon', formCreateCouponData);
            // Handle successful response
          } catch (error) {
            console.error('Error creating transaction coupon:', error);
            // Handle error (e.g., display error message to the user)
          }
        // const res = await axiosInstance.post('/api/order/transaction-coupon/create-transaction-coupon', formCreateCouponData);
        setOpenCouponModal(false);
    }

    useEffect(() => {
        axiosInstance.get('/api/store/supermarket/all-supermarket')
            .then(res => {
                setSupermarkets(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
    }, [openCreateModal, openEditModal]);

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
            <div key={`supermarket-${item.id}`} id={`supermarket-${item.id}`} onClick={() => { setOpenEditModal(true); setSelectedSupermarket(item); }} className="flex flex-col rounded-lg w-[200px] h-[200px] bg-white items-center justify-center hover:cursor-pointer hover:drop-shadow-lg">
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
                        <div className="flex justify-between px-5">
                            <button onClick={() => setOpenCouponModal(true)} className="my-5 h-[50px] w-[120px] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5">
                                Create New Coupon
                            </button>
                            <button onClick={(e) => setOpenCreateModal(!openCreateModal)} className="my-5 h-[50px] w-[120px] focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                {/* <Image src="/vercel.svg" className="text-slate-100" alt="plus icon" width={40} height={40} /> */}
                                Create new
                            </button>
                        </div>
                        <div className="w-full h-[500px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center overflow-scroll">
                            {displayedItems}
                        </div>
                    </div>
                </div>
                {/* create supermarket modal */}
                <Modal open={openCreateModal} onClose={() => setOpenCreateModal(!openCreateModal)} className="w-[600px]">
                    <form onSubmit={handleCreateSupermarket} className="space-y-6">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setFormCreateSupermarketData({...formCreateSupermarketData, name: e.target.value})} type="text" name="name" id="name" className="p-2 rounded-lg"/>
                            {
                                errorSupermarket.name && <p className="text-red-500 text-sm">{errorSupermarket.name}</p>
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
                <Modal title="Edit Supermarket" open={openEditModal} onClose={() => setOpenEditModal(!openEditModal)} className="w-[700px]">
                    <form onSubmit={handleEditSupermarket} className="space-y-6 flex flex-col">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setSelectedSupermarket({...selectedSupermarket, name: e.target.value})} defaultValue={selectedSupermarket.name} type="text" name="name" id="name" className="p-2 rounded-lg"/>
                            {
                                errorSupermarket.name && <p className="text-red-500 text-sm">{errorSupermarket.name}</p>
                            }
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <label className="text-black font-bold" htmlFor="managers">Manager</label>
                            {
                                selectedSupermarket.managers.map(manager => (
                                    <div key={`manager-${manager}`} id={`manager-${manager}`} className="flex space-x-2">
                                        <input readOnly={true} type="text" defaultValue={manager} className="p-2 rounded-lg w-full font-bold text-black"/>
                                        <button className="text-white bg-red-500 hover:bg-red-700 p-2 rounded-lg" onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedSupermarket({
                                                ...selectedSupermarket,
                                                managers: selectedSupermarket.managers.filter(m => m !== manager)
                                            })
                                        }}>Remove</button>
                                    </div>
                                ))
                            }
                            {/* button to create new manager */}
                            <button onClick={() => {setOpenManagerModal(true); setOpenEditModal(false);}} className="text-white bg-green-500 p-2 rounded-lg">Add Manager</button>
                        </div>
                        {/* <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="address">Address</label> 
                            <input onChange={(e) => setFormData({...formData, address: e.target.value})} type="text" name="address" id="address" className="p-2 rounded-lg"/>
                            {
                                error.name && <p className="text-red-500 text-sm">{error.name}</p>
                            }
                        </div> */}
                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Done</button>
                        </div>
                    </form>
                </Modal>
                {/* add manager modal */}
                <Modal title="Create Manager Account" open={openManagerModal} onClose={() => {setOpenManagerModal(!openManagerModal); setOpenEditModal(true)}} className="w-[700px]">
                    <form className="space-y-6" onSubmit={handleAddManager}>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setFormAddManagerData({...formAddManagerData, name: e.target.value})} type="text" name="name" id="name" placeholder="Andi" className="p-2 rounded-lg"/>
                            {
                                errorManager.name && <p className="text-red-500 text-sm">{errorManager.name}</p>
                            }
                        </div>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="email">Email</label> 
                            <input onChange={(e) => setFormAddManagerData({...formAddManagerData, email: e.target.value})} type="text" name="email" id="email" placeholder="youremail@gmail.com" className="p-2 rounded-lg"/>
                            {
                                errorManager.email && <p className="text-red-500 text-sm">{errorManager.email}</p>
                            }
                        </div>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="password">Password</label> 
                            <input onChange={(e) => setFormAddManagerData({...formAddManagerData, password: e.target.value})} type="password" name="password" id="password" className="p-2 rounded-lg"/>
                            {
                                errorManager.password && <p className="text-red-500 text-sm">{errorManager.password}</p>
                            }
                        </div>
                        <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                    </form>
                </Modal>
                <Modal open={openCouponModal} onClose={() => setOpenCouponModal(!openCouponModal)} className="w-[700px]">
                <form onSubmit={handleCreateCoupon} className="space-y-6">
                    <div className="flex flex-col text-black space-y-2">
                        <label className="text-black font-bold" htmlFor="couponName">Coupon Name</label> 
                        <input onChange={(e) => setFormCreateCouponData({...formCreateCouponData, couponName: e.target.value})} type="text" name="couponName" id="couponName" className="p-2 rounded-lg"/>
                        {
                            errorCoupon.couponName && <p className="text-red-500 text-sm">{errorCoupon.couponName}</p>
                        }
                    </div>
                    <div className="flex flex-col text-black space-y-2">
                        <label className="text-black font-bold" htmlFor="couponNominal">Coupon Nominal</label> 
                        <input onChange={(e) => setFormCreateCouponData({...formCreateCouponData, couponNominal: parseInt(e.target.value)})} type="number" name="couponNominal" id="couponNominal" className="p-2 rounded-lg"/>
                        {
                            errorCoupon.couponNominal && <p className="text-red-500 text-sm">{errorCoupon.couponNominal}</p>
                        }
                    </div>
                    <div className="flex flex-col text-black space-y-2">
                        <label className="text-black font-bold" htmlFor="minimumBuy">Minimum Buy</label> 
                        <input onChange={(e) => setFormCreateCouponData({...formCreateCouponData, minimumBuy: parseInt(e.target.value)})} type="number" name="minimumBuy" id="minimumBuy" className="p-2 rounded-lg"/>
                        {
                            errorCoupon.minimumBuy && <p className="text-red-500 text-sm">{errorCoupon.minimumBuy}</p>
                        }
                    </div>
                    <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5">Create Coupon</button>
                </form>
            </Modal>
            </section>
        </>
    );
};

export default withAdmin(AdminDashboardPage);