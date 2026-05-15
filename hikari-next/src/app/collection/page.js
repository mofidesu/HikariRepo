'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import { CollectionsData } from '@/data/components';

function CollectionContent() {
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('id');
    const categoryName = searchParams.get('category');

    const [data, setData] = useState({
        title: '',
        subtitle: '',
        description: '',
        heroImage: '',
        seller: '',
        sellerLogo: '',
        products: []
    });

    useEffect(() => {
        if (categoryName) {
            const displayTitle = categoryName === 'Accessories' ? 'Aksesuar Koleksiyonu' : categoryName;
            let filtered;
            if (categoryName === 'Accessories') {
                const accessoryCats = ['Watches', 'Handbags', 'Wallets', 'Belts', 'Jewellery', 'Earrings', 'Ties', 'Caps', 'Sunglasses', 'Socks'];
                filtered = productsData.filter(p => accessoryCats.includes(p.category));
            } else {
                filtered = productsData.filter(p => p.category === categoryName);
            }

            setData({
                title: displayTitle,
                subtitle: 'Tüm Ürünler',
                description: `${displayTitle} kategorisindeki en yeni ve en şık ürünleri keşfedin.`,
                heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
                seller: 'HIKARI Boutique',
                sellerLogo: 'HB',
                products: filtered
            });
            document.title = `HIKARI | ${displayTitle}`;
        } else {
            const collData = CollectionsData[collectionId] || CollectionsData['autumn'];
            if (collData) {
                const collProducts = productsData.filter(p => collData.products.includes(p.image));
                setData({
                    title: collData.title,
                    subtitle: collData.subtitle,
                    description: collData.description,
                    heroImage: collData.heroImage,
                    seller: collData.seller,
                    sellerLogo: collData.sellerLogo,
                    products: collProducts
                });
                document.title = `HIKARI | ${collData.title}`;
            }
        }
    }, [collectionId, categoryName]);

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
                <img src={data.heroImage} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                <div className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-white">
                    <div className="max-w-2xl">
                        <span className="text-primary-fixed-dim font-bold tracking-[0.3em] uppercase mb-4 block">{data.subtitle}</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">{data.title}</h1>
                        <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">{data.description}</p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl border border-white/30">
                                {data.sellerLogo}
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Küratör</p>
                                <p className="font-bold text-lg">{data.seller}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-on-surface">Koleksiyon Ürünleri</h2>
                    <span className="text-secondary">{data.products.length} Ürün Listeleniyor</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {data.products.map(product => (
                        <ProductCard key={product.image} product={product} isGrid={true} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function Collection() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen">Yükleniyor...</div>}>
                <CollectionContent />
            </Suspense>
            <Footer />
        </>
    );
}
