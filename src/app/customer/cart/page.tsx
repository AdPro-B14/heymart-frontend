'use client';

import axiosInstance from "@/helpers/axios_interceptor";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/auth_context";
import withCustomer from "@/hoc/with_customer";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface CartItem {
    productId: string;
    amount: number;
}

interface Cart {
    id: number;
    supermarketId: number | null;
    listKeranjangItem: CartItem[];
}

function CartPage() {
    const { user, isLoggedIn, token } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart();
        }
    }, [isLoggedIn]);

    const fetchCart = async () => {
        try {
            const res = await axiosInstance.get(`/api/order/keranjang`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCart(res.data);
            fetchProducts(res.data.listKeranjangItem);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const fetchProducts = async (cartItems: CartItem[]) => {
        try {
            const productIds = cartItems.map(item => item.productId);
            const fetchedProducts: Product[] = [];
    
            for (const productId of productIds) {
                try {
                    const res = await axiosInstance.get(`/api/store/product/findById/${productId}`);
                    fetchedProducts.push(res.data);
                } catch (error) {
                    console.error(`Error fetching product with ID ${productId}:`, error);
                }
            }
    
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleRemoveFromCart = async (productId: string) => {
        try {
            const res = await axiosInstance.post(`/api/order/keranjang/remove-product`, {
                productId: productId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCart(res.data);
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            const res = await axiosInstance.post(`/api/order/keranjang/add-product`, {
                productId: productId,
                supermarketId : cart?.supermarketId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCart(res.data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            const res = await axiosInstance.post(`/api/order/keranjang/clear`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCart(res.data);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            const res = await axiosInstance.post(`/api/order/checkout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Handle checkout response as needed
            console.log('Checkout successful:', res.data);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };
    

    if (!cart) return <div>Loading...</div>;

    const displayedItems = cart.listKeranjangItem.map(item => {
        const product = products.find(p => p.id === item.productId);
        return (
            <div key={`cart-item-${item.productId}`} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                    {product && (
                        <>
                            <Image src={`https://ui-avatars.com/api/?rounded=true&name=${product.name}`} width={50} height={50} alt={product.name} />
                            <div className="ml-4">
                                <h1 className="font-bold text-lg">{product.name}</h1>
                                <p className="text-sm">Price: {product.price}</p>
                                <p className="text-sm">Amount: {item.amount}</p>
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="bg-green-500 text-white p-2 rounded-lg"
                >
                    Add
                </button>
                <button
                    onClick={() => handleRemoveFromCart(item.productId)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                >
                    Remove
                </button>
            </div>
        );
    });

    return (
        <>
            <title>Cart</title>
            <section className="flex flex-col bg-light-green min-h-screen items-center pt-[100px] min-w-svw max-w-svw">
                <div className="flex flex-col bg-dark-green-2 w-[300px] h-[150px] justify-start items-center p-4 rounded-lg mb-8">
                    <h1 className="font-bold text-lg">
                        Number of Items:
                    </h1>
                    <h1 className="font-bold text-6xl m-auto">
                        {cart.listKeranjangItem.length}
                    </h1>
                </div>
                <div className="w-full px-8 my-8">
                    <div className="w-full bg-white/30 backdrop-blur-lg z-1 rounded-lg">
                        <article className="w-full mx-auto grid grid-cols-1 gap-6 place-content-center justify-items-center p-2">
                            {displayedItems}
                        </article>
                    </div>
                </div>
                <div className="flex justify-between w-full px-8 my-8">
                    <button
                        onClick={handleClearCart}
                        className="bg-yellow-500 text-white p-2 rounded-lg"
                    >
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Checkout
                    </button>
                </div>
            </section>
        </>
    );
}

export default withCustomer(CartPage);
