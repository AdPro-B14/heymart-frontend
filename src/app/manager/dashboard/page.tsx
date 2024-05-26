'use client';

import Modal from "@/components/modal";
import axiosInstance from "@/helpers/axios_interceptor";
import withManager from "@/hoc/with_manager";
import withAuth from "@/hoc/with_auth";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from "@/context/auth_context";


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
    supermarketId: number;
}

function ManagerDashboardPage() {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product>({ id: "", name: "", price:0, stock:0, supermarketId: 0});
    const [formCreateProductData, setFormCreateProductData] = useState({
        name: "",
        price: 0,
        stock: 0,
        supermarketId:0
    });
    const { user, isLoggedIn } = useAuth();

    const [errorProduct, setErrorProduct] = useState({ name: "", price: "", stock: ""  });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", stock: "", price: "" };
        let formIsValid = true;

        if (!formCreateProductData.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }

        else if (formCreateProductData.stock < 0) {
            formIsValid = false;
            newError.stock = "Stock is not valid";
        }

        else if (formCreateProductData.price < 0) {
            formIsValid = false;
            newError.price = "Price is not valid";
        }
        
        setErrorProduct(newError);

        if (!formIsValid) return;
        try {
            formCreateProductData.supermarketId = user.manager_supermarket_id;
            const res = await axiosInstance.post('/api/store/product/create', formCreateProductData);
            setOpenCreateModal(false);
        } 
        catch (error) {
            console.log(error);
            setOpenCreateModal(false);
        }
    }

    const handleEditProduct = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newError = { name: "", stock: "", price: "" };
        let formIsValid = true;

        if (!selectedProduct.name) {
            formIsValid = false;
            newError.name = "Name is required";
        }

        else if (selectedProduct.price < 0) {
            formIsValid = false;
            newError.price = "Price is not valid"
        }

        else if (selectedProduct.stock < 0) {
            formIsValid = false;
            newError.stock = "Stock is not valid";
        }
        
        setErrorProduct(newError);
        if (!formIsValid) return;
        const res = await axiosInstance.post('/api/store/product/edit', selectedProduct);
        setOpenEditModal(false);
    }

    useEffect(() => {
        axiosInstance.get(`/api/store/product/all-product/${user.manager_supermarket_id}`)
            .then(res => {
                setProducts(res.data);
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            });
    }, [openCreateModal, openEditModal]);

    const displayedItems = products
        .map((item) => (
            <div key={`product-${item.id}`} id={`product-${item.id}`} onClick={() => { setOpenEditModal(true); setSelectedProduct(item); }} className="flex flex-col rounded-lg w-[200px] h-[200px] bg-white items-center justify-center hover:cursor-pointer hover:drop-shadow-lg space-y-4">
                <Image src={`https://ui-avatars.com/api/?rounded=true&name=${item.name}`} width={50} height={50} alt={item.name}/>
                <h1 className="font-bold text-black text-sm">{item.name}</h1>
                <h1 className="font-bold text-black text-sm">Stock: {item.stock}</h1>
                <h1 className="font-bold text-black text-sm">Price: {item.price}</h1>
            </div>
        ));

    return (
        <>
            <title>Manager Dashboard</title>
            <section className="flex flex-col bg-light-green min-h-screen items-start justify-start pt-[100px] min-w-svw max-w-svw">
                <div className="flex w-svw px-[100px] space-x-10 justify-center">
                    <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg">
                        <h1 className="font-bold text-lg">
                            Number of Products:
                        </h1>
                        <h1 className="font-bold text-6xl m-auto">
                            {products.length}
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
                <Modal open={openCreateModal} onClose={() => setOpenCreateModal(!openCreateModal)} className="w-[600px]">
                    <form onSubmit={handleCreateProduct} className="space-y-6">
                    <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setFormCreateProductData({...formCreateProductData, name: e.target.value})} type="text" name="name" id="" placeholder="Nama" className="p-2 rounded-lg"/>
                            {
                                errorProduct.name && <p className="text-red-500 text-sm">{errorProduct.name}</p>
                            }
                        </div>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="stock">Stock</label> 
                            <input onChange={(e) => setFormCreateProductData({...formCreateProductData, stock: e.target.value})} type="number" name="stock" id="stock" placeholder="0" className="p-2 rounded-lg"/>
                            {
                                errorProduct.stock && <p className="text-red-500 text-sm">{errorProduct.stock}</p>
                            }
                        </div>
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="price">Price</label> 
                            <input onChange={(e) => setFormCreateProductData({...formCreateProductData, price: e.target.value})} type="number" name="price" id="price" placeholder="0" className="p-2 rounded-lg"/>
                            {
                                errorProduct.price && <p className="text-red-500 text-sm">{errorProduct.price}</p>
                            }
                        </div>

                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                        </div>
                    </form>
                </Modal>
                
                <Modal title="Edit Product" open={openEditModal} onClose={() => setOpenEditModal(!openEditModal)} className="w-[700px]">
                    <form onSubmit={handleEditProduct} className="space-y-6 flex flex-col">
                        <div className="flex flex-col text-black space-y-2">
                            <label className="text-black font-bold" htmlFor="name">Name</label> 
                            <input onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} defaultValue={selectedProduct.name} type="text" name="name" id="name" className="p-2 rounded-lg"/>
                            {
                                errorProduct.name && <p className="text-red-500 text-sm">{errorProduct.name}</p>
                            }

                            <label className="text-black font-bold" htmlFor="stock">Stock</label> 
                            <input onChange={(e) => setSelectedProduct({...selectedProduct, stock: e.target.value})} defaultValue={selectedProduct.stock} type="number" name="stock" id="stock" className="p-2 rounded-lg"/>
                            {
                                errorProduct.stock && <p className="text-red-500 text-sm">{errorProduct.stock}</p>
                            }
                            <label className="text-black font-bold" htmlFor="price">Price</label> 
                            <input onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})} defaultValue={selectedProduct.price} type="number" name="price" id="price" className="p-2 rounded-lg"/>
                            {
                                errorProduct.price && <p className="text-red-500 text-sm">{errorProduct.price}</p>
                            }

                        </div>
                        <div className="space-y-2 my-2">
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none focus:ring-slate-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Done</button>
                        </div>
                    </form>
                </Modal>
            
            </section>
        </>
    );
};

export default withManager(ManagerDashboardPage);