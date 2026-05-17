'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const formatPrice = (price) => {
    const val = parseFloat(price) || 0;
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' TL';
};

export default function Cart() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        const items = userData.cart || [];
        setCartItems(items);
        
        const fetchProducts = async () => {
            if (items.length > 0) {
                const productIds = items.map(i => i.productId);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds);
                
                if (data && !error) {
                    setCartProducts(data);
                }
            } else {
                setCartProducts([]);
            }
            setIsLoaded(true);
        };
        fetchProducts();
    }, [router]);

    const updateCart = (newCart) => {
        setCartItems(newCart);
        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        userData.cart = newCart;
        sessionStorage.setItem('userData', JSON.stringify(userData));

        sessionStorage.setItem('userData', JSON.stringify(userData));

        if (userData.id) {
            supabase.from('profiles').update({ cart: newCart }).eq('id', userData.id).then(({ error }) => {
                if (error) console.error("Error updating cart:", error);
            });
        }

        window.dispatchEvent(new Event('storage'));
    };

    const handleRemove = (productId) => {
        const newCart = cartItems.filter(item => item.productId !== productId);
        updateCart(newCart);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemove(productId);
            return;
        }
        const newCart = cartItems.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        updateCart(newCart);
    };

    if (!isLoaded) return <div className="min-h-screen"></div>;

    let subtotal = 0;
    let totalItems = 0;

    const enrichedCartProducts = cartItems.map(cartItem => {
        const product = cartProducts.find(p => p.id === cartItem.productId);
        if (!product) return null;
        
        const price = parseFloat(product.price || 0);
        const itemTotal = price * cartItem.quantity;
        subtotal += itemTotal;
        totalItems += cartItem.quantity;

        return { ...product, quantity: cartItem.quantity, itemTotal };
    }).filter(Boolean);

    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-8 py-8">
                <h1 className="text-3xl font-bold text-on-surface mb-8">Sepetim</h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-xl border border-surface-variant">
                        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
                        <h2 className="text-xl font-bold text-on-surface mb-2">Sepetiniz şu an boş</h2>
                        <p className="text-secondary mb-6 text-center max-w-md">Binlerce ürün arasından size en uygun olanı bulmak için alışverişe başlayın.</p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">Alışverişe Başla</Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Cart Items */}
                        <div className="flex-grow">
                            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden">
                                <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                                    <h2 className="font-bold text-lg">Ürünler (<span>{totalItems}</span>)</h2>
                                </div>
                                <div className="divide-y divide-surface-variant">
                                    {enrichedCartProducts.map(item => (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                            {/* Image */}
                                            <div className="w-24 h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden cursor-pointer flex items-center justify-center p-2" onClick={() => router.push(`/detail?id=${item.id}&reviews=128`)}>
                                                <img src={item.imgUrl} alt={item.productname} className="w-full h-full object-contain" />
                                            </div>
                                            
                                            {/* Details */}
                                            <div className="flex-grow flex flex-col justify-between">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <span className="text-xs text-secondary mb-1 uppercase tracking-wider">{item.sub_category || item.main_category || 'Kategori'}</span>
                                                        <h3 className="font-medium text-lg text-on-surface mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => router.push(`/detail?id=${item.id}&reviews=128`)}>{item.productname}</h3>
                                                        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                                                    </div>
                                                    <button onClick={() => handleRemove(item.id)} className="text-secondary hover:text-error transition-colors p-2 bg-surface-container hover:bg-error-container/20 rounded-lg">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                                
                                                {/* Quantity & Total */}
                                                <div className="flex justify-between items-end mt-4">
                                                    <div className="flex items-center border border-outline-variant rounded-lg h-10 overflow-hidden bg-surface-container-lowest">
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="px-3 h-full text-secondary hover:text-primary hover:bg-surface-container transition-colors flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[18px]">remove</span>
                                                        </button>
                                                        <input type="number" min="1" value={item.quantity} readOnly className="w-12 text-center font-medium text-on-surface border-none focus:ring-0 p-0 h-full bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="px-3 h-full text-secondary hover:text-primary hover:bg-surface-container transition-colors flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-[18px]">add</span>
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm text-secondary block mb-1">Ara Toplam</span>
                                                        <span className="font-bold text-on-surface">{formatPrice(item.itemTotal)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 sticky top-24">
                                <h2 className="font-bold text-lg mb-6">Sipariş Özeti</h2>

                                <div className="flex justify-between items-center mb-4 text-on-surface-variant">
                                    <span>Ara Toplam</span>
                                    <span className="font-medium text-on-surface">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4 text-on-surface-variant">
                                    <span>Kargo Tutarı</span>
                                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-on-surface'}`}>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span>
                                </div>

                                <hr className="border-surface-variant my-4" />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-bold text-lg">Genel Toplam</span>
                                    <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
                                </div>

                                <button className="w-full bg-primary text-white font-medium py-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                                    Sepeti Onayla
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-secondary">
                                    <span className="material-symbols-outlined text-base">lock</span>
                                    Güvenli Alışveriş
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
