'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { productsData } from '@/data/products';
import { reviewsData } from '@/data/reviews';
import Link from 'next/link';

const formatPrice = (price) => {
    const val = parseFloat(price) || 0;
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' TL';
};

const HighlightText = ({ text, highlight }) => {
    if (!highlight || !highlight.trim() || !text) {
        return <>{text}</>;
    }
    // Escape special regex characters
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.toString().split(regex);
    
    return (
        <>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() ? 
                    <mark key={i} className="bg-primary/20 text-primary font-medium px-1 rounded">{part}</mark> 
                    : <span key={i}>{part}</span>
            )}
        </>
    );
};

function ReviewsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const productId = searchParams.get('id');
    const sortParam = searchParams.get('sort') || 'recommended';
    const searchParam = searchParams.get('q') || '';
    const starsParam = searchParams.get('stars');
    const pageParam = parseInt(searchParams.get('page')) || 1;

    const [product, setProduct] = useState(null);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isRatingFilterOpen, setIsRatingFilterOpen] = useState(false);

    useEffect(() => {
        if (productId) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            const foundProduct = productsData.find(p => p.image === productId);
            if (foundProduct) {
                setProduct(foundProduct);
            }
        }
    }, [productId]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            const params = new URLSearchParams(searchParams);
            if (query) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        }
    };

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', newSort);
        params.set('page', '1');
        setIsSortMenuOpen(false);
        router.push(`?${params.toString()}`);
    };

    const handleRatingChange = (star) => {
        const selectedStars = starsParam ? starsParam.split(',').map(s => parseInt(s)) : [];
        let newSelected = [...selectedStars];
        
        if (newSelected.includes(star)) {
            newSelected = newSelected.filter(s => s !== star);
        } else {
            newSelected.push(star);
        }

        const params = new URLSearchParams(searchParams);
        if (newSelected.length > 0) {
            params.set('stars', newSelected.join(','));
        } else {
            params.delete('stars');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleAddToCart = () => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Sepete eklemek için lütfen giriş yapın.');
            window.location.href = '/login';
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.cart) userData.cart = [];

        const existingItem = userData.cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            userData.cart.push({ productId: productId, quantity: 1 });
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));
    };

    const filteredReviewsData = useMemo(() => {
        let allProductReviews = reviewsData.filter(r => r.productId === productId);

        if (searchParam) {
            const lowerSearch = searchParam.toLowerCase();
            allProductReviews = allProductReviews.filter(r =>
                (r.reviewText && r.reviewText.toLowerCase().includes(lowerSearch)) ||
                (r.reviewerName && r.reviewerName.toLowerCase().includes(lowerSearch)) ||
                (r.summary && r.summary.toLowerCase().includes(lowerSearch))
            );
        }

        const selectedStars = starsParam ? starsParam.split(',').map(s => parseInt(s)) : [];
        if (selectedStars.length > 0) {
            allProductReviews = allProductReviews.filter(r => {
                const rating = Math.floor(r.overall || 5);
                return selectedStars.includes(rating);
            });
        }

        if (sortParam === 'newest') {
            allProductReviews.sort((a, b) => b.unixReviewTime - a.unixReviewTime);
        } else if (sortParam === 'oldest') {
            allProductReviews.sort((a, b) => a.unixReviewTime - b.unixReviewTime);
        } else if (sortParam === 'rating_asc') {
            allProductReviews.sort((a, b) => a.overall - b.overall);
        } else if (sortParam === 'rating_desc') {
            allProductReviews.sort((a, b) => b.overall - a.overall);
        }

        return allProductReviews;
    }, [productId, searchParam, starsParam, sortParam]);


    if (!product) return <div className="min-h-[50vh] flex items-center justify-center">Yükleniyor...</div>;

    const actualReviewCount = filteredReviewsData.length;
    const photoCount = Math.max(0, Math.floor(actualReviewCount * 0.25));

    const sortLabels = {
        'recommended': 'Önerilen Sıralama',
        'newest': 'Yeniden Eskiye',
        'oldest': 'Eskiden Yeniye',
        'rating_asc': 'Artan Puan',
        'rating_desc': 'Azalan Puan'
    };

    const itemsPerPage = 10;
    const totalPages = Math.ceil(actualReviewCount / itemsPerPage) || 1;
    const startIndex = (pageParam - 1) * itemsPerPage;
    const productReviews = filteredReviewsData.slice(startIndex, startIndex + itemsPerPage);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            );
        }
        return <div className="flex items-center gap-0.5">{stars}</div>;
    };

    const generatePaginationLink = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        return `?${params.toString()}`;
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <Link href={`/detail?id=${encodeURIComponent(product.image)}`} className="flex items-center hover:text-primary transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Geri
                </Link>
                <span>/</span>
                <span>{product.category}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    {/* Product Quick Card */}
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex gap-4 items-start lg:sticky lg:top-24">
                        <div className="w-20 h-24 flex-shrink-0 border border-gray-100 rounded overflow-hidden">
                            <img alt={product['display name']} className="w-full h-full object-cover" src={`/datas/data/${product.image}`} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <h2 className="text-sm font-medium text-gray-900 leading-tight truncate sm:whitespace-normal">{product['display name']}</h2>
                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mt-1">
                                {renderStars(product.stars || 5)}
                                <span className="whitespace-nowrap">{actualReviewCount} Değerlendirme</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                                <span className="text-sm text-gray-400 line-through whitespace-nowrap">{formatPrice(product.price * 1.25)}</span>
                            </div>
                            <button onClick={handleAddToCart} className="mt-3 w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors">Sepete Ekle</button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4 lg:sticky lg:top-[250px]">
                        <h3 className="font-medium text-gray-900">Filtreler</h3>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer">
                            <span className="text-sm text-gray-700">Fotoğraflı Yorumlar</span>
                            <span className="text-xs text-gray-500">({photoCount})</span>
                        </div>
                        <div className="border-b border-gray-100">
                            <div onClick={() => setIsRatingFilterOpen(!isRatingFilterOpen)} className="flex items-center justify-between py-2 cursor-pointer">
                                <span className="text-sm text-gray-700">Puan</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isRatingFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                            {isRatingFilterOpen && (
                                <div className="pb-2 flex flex-col gap-2">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const selectedStars = starsParam ? starsParam.split(',').map(s => parseInt(s)) : [];
                                        return (
                                            <label key={star} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={selectedStars.includes(star)} onChange={() => handleRatingChange(star)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                                                {renderStars(star)}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Tüm Değerlendirmeler</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-3xl font-bold text-gray-900">{product.stars || 5}</span>
                                    {renderStars(product.stars || 5)}
                                    <span className="text-sm text-gray-500">{actualReviewCount} Değerlendirme</span>
                                </div>
                            </div>
                        </div>

                        {/* Search & Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                            <div className="relative flex-1 w-full min-w-0">
                                <input defaultValue={searchParam} onKeyDown={handleSearch} className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary" placeholder="Değerlendirmelerde Ara" type="text" />
                                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </button>
                            </div>
                            <div className="relative">
                                <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[170px] justify-between">
                                    <span>{sortLabels[sortParam]}</span>
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                </button>
                                {isSortMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100 py-1">
                                            {Object.entries(sortLabels).map(([key, label]) => (
                                                <button key={key} onClick={() => handleSortChange(key)} className={`block w-full text-left px-4 py-2 text-sm ${sortParam === key ? 'text-primary bg-primary-container/10 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="flex flex-col">
                        {productReviews.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-lg font-medium">Yorum bulunamadı</p>
                                <p className="text-sm mt-1">Aradığınız kelimeyle eşleşen bir yorum yok.</p>
                            </div>
                        ) : (
                            productReviews.map((review, idx) => (
                                <div key={idx} className="py-6 border-b border-gray-100 flex flex-col gap-3">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {renderStars(review.overall || 5)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium text-gray-900">{review.reviewerName || 'Gizli Kullanıcı'}</span>
                                        <span>•</span>
                                        <span>{review.reviewTime}</span>
                                    </div>
                                    <p className="text-sm text-gray-800 leading-relaxed"><HighlightText text={review.reviewText} highlight={searchParam} /></p>
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                        <span>HIKARI satıcısından alındı</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <nav className="flex gap-1">
                                {pageParam > 1 && (
                                    <Link href={generatePaginationLink(pageParam - 1)} className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    </Link>
                                )}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Link key={page} href={generatePaginationLink(page)} className={`w-8 h-8 flex items-center justify-center rounded border ${page === pageParam ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                        {page}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function Reviews() {
    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
            <Header />
            <Suspense fallback={<div className="min-h-screen">Yükleniyor...</div>}>
                <ReviewsContent />
            </Suspense>
            <Footer />
        </div>
    );
}
