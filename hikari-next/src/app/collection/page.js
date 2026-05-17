'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

function CollectionContent() {
    const searchParams = useSearchParams();
    const categoryName = searchParams.get('category');
    const searchQuery = searchParams.get('q');

    const [data, setData] = useState({
        title: 'Koleksiyon',
        subtitle: 'Tüm Ürünler',
        description: 'Tüm ürünler listeleniyor.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
        seller: 'HIKARI Boutique',
        sellerLogo: 'HB',
        products: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);

            if (searchQuery) {
                // Handle Search
                const { data: searchResults, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('productname', `%${searchQuery}%`)
                    .limit(40);

                if (!error && searchResults) {
                    setData({
                        title: `"${searchQuery}" İçin Sonuçlar`,
                        subtitle: 'Arama Sonuçları',
                        description: `Aramanızla eşleşen ${searchResults.length} ürün bulundu.`,
                        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
                        seller: 'HIKARI Boutique',
                        sellerLogo: 'HB',
                        products: searchResults
                    });
                    document.title = `HIKARI | ${searchQuery} Arama Sonuçları`;
                }
            } else if (categoryName) {
                // Handle Category
                // First try to treat categoryName as a slug
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('id, name')
                    .eq('slug', categoryName)
                    .single();

                let catProducts = null;
                let displayTitle = categoryName;

                if (!catError && catData) {
                    displayTitle = catData.name;
                    const { data } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_id', catData.id)
                        .limit(40);
                    catProducts = data;
                } else {
                    // Fallback to exact text match in sub_category or main_category
                    const { data } = await supabase
                        .from('products')
                        .select('*')
                        .or(`sub_category.eq."${categoryName}",main_category.eq."${categoryName}"`)
                        .limit(40);
                    catProducts = data;
                }

                if (catProducts && catProducts.length > 0) {
                    setData({
                        title: displayTitle,
                        subtitle: 'Kategori Seçimi',
                        description: `${displayTitle} kategorisindeki en yeni ve en şık ürünleri keşfedin.`,
                        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
                        seller: 'HIKARI Boutique',
                        sellerLogo: 'HB',
                        products: catProducts
                    });
                    document.title = `HIKARI | ${displayTitle}`;
                } else {
                    // Category not found or empty
                    setData(prev => ({ ...prev, title: displayTitle, products: [] }));
                }
            } else {
                // Fallback (e.g., just show random products)
                const { data: randomProducts } = await supabase
                    .from('products')
                    .select('*')
                    .limit(20);

                if (randomProducts) {
                    setData({
                        title: 'Tüm Koleksiyon',
                        subtitle: 'Genel Seçki',
                        description: 'Mağazamızdaki öne çıkan ürünleri keşfedin.',
                        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
                        seller: 'HIKARI Boutique',
                        sellerLogo: 'HB',
                        products: randomProducts
                    });
                    document.title = `HIKARI | Koleksiyon`;
                }
            }
            setIsLoading(false);
        };

        fetchProducts();
    }, [categoryName, searchQuery]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
                {data.heroImage ? <img src={data.heroImage} className="absolute inset-0 w-full h-full object-cover" alt="Banner" /> : null}
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
                {data.products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {data.products.map(product => (
                            <ProductCard key={product.id} product={product} isGrid={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-secondary">
                        Bu kategori/arama için ürün bulunamadı.
                    </div>
                )}
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
