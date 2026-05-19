'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Vitrins() {
    const router = useRouter();
    const [vitrins, setVitrins] = useState([]);
    const [expandedVitrin, setExpandedVitrin] = useState(null);
    const [vitrinProducts, setVitrinProducts] = useState({});
    const [loadingProducts, setLoadingProducts] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            router.push('/login');
            return;
        }

        const loadVitrins = () => {
            const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
            const saved = userData.saved_vitrins || [];
            // En yeniden en eskiye sırala
            setVitrins([...saved].reverse());
        };

        loadVitrins();
        setIsLoaded(true);

        window.addEventListener('storage', loadVitrins);
        return () => window.removeEventListener('storage', loadVitrins);
    }, [router]);

    // Bir vitrinin ürünlerini Supabase'den yükle
    const loadVitrinProducts = async (vitrin) => {
        const key = vitrin.msgId;
        if (vitrinProducts[key]) return; // Zaten yüklü

        setLoadingProducts(prev => ({ ...prev, [key]: true }));

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', vitrin.productIds || []);

        if (data && !error) {
            setVitrinProducts(prev => ({ ...prev, [key]: data }));
        }
        setLoadingProducts(prev => ({ ...prev, [key]: false }));
    };

    // Vitrin aç/kapa toggle
    const handleToggleVitrin = (vitrin) => {
        if (expandedVitrin === vitrin.msgId) {
            setExpandedVitrin(null);
        } else {
            setExpandedVitrin(vitrin.msgId);
            loadVitrinProducts(vitrin);
        }
    };

    // Vitrin sil
    const handleDeleteVitrin = async (e, msgId) => {
        e.stopPropagation();
        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.saved_vitrins) return;

        userData.saved_vitrins = userData.saved_vitrins.filter(v => v.msgId !== msgId);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setVitrins([...userData.saved_vitrins].reverse());

        if (expandedVitrin === msgId) setExpandedVitrin(null);

        // Supabase sync
        if (userData.id) {
            await supabase.from('profiles')
                .update({ saved_vitrins: userData.saved_vitrins })
                .eq('id', userData.id);
        }
        window.dispatchEvent(new Event('storage'));
    };

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return ''; }
    };

    if (!isLoaded) return <div className="min-h-screen"></div>;

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-8 py-8">
                {/* Sayfa Başlığı */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#8a3100] flex items-center justify-center text-white shadow-lg">
                            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Kaydedilmiş Vitrinlerim</h1>
                            <p className="text-secondary text-sm mt-0.5">Hikai&apos;nin sizin için hazırladığı özel ürün koleksiyonları</p>
                        </div>
                    </div>
                    {vitrins.length > 0 && (
                        <span className="text-xs font-bold text-white bg-primary px-4 py-1.5 rounded-full shadow-sm hidden md:inline-block">
                            {vitrins.length} vitrin
                        </span>
                    )}
                </div>

                <div className="h-px bg-outline-variant/30 my-6"></div>

                {vitrins.length === 0 ? (
                    /* Boş Durum */
                    <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-xl border border-surface-variant">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-5xl text-primary/60">bookmarks</span>
                        </div>
                        <h2 className="text-xl font-bold text-on-surface mb-2">Henüz kaydedilmiş vitrininiz yok</h2>
                        <p className="text-secondary mb-6 text-center max-w-md text-sm">
                            Hikai sohbetinde beğendiğiniz ürün listelerini <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold"><span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span> kaydet</span> butonuyla saklayın.
                        </p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Alışverişe Başla
                        </Link>
                    </div>
                ) : (
                    /* Vitrin Listesi */
                    <div className="space-y-4">
                        {vitrins.map((vitrin, idx) => {
                            const isExpanded = expandedVitrin === vitrin.msgId;
                            const products = vitrinProducts[vitrin.msgId] || [];
                            const isLoading = loadingProducts[vitrin.msgId];

                            return (
                                <div key={vitrin.msgId || idx} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Vitrin Başlık Kartı — Tıkla aç/kapa */}
                                    <div
                                        onClick={() => handleToggleVitrin(vitrin)}
                                        role="button"
                                        tabIndex={0}
                                        className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            {/* Vitrin İkonu + Numara */}
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-colors ${isExpanded ? 'bg-gradient-to-br from-primary to-[#8a3100]' : 'bg-gradient-to-br from-secondary/70 to-secondary'}`}>
                                                    <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                                                </div>
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                                    {vitrins.length - idx}
                                                </span>
                                            </div>

                                            {/* Sorgu + Meta */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm md:text-base font-bold text-on-surface truncate pr-4">
                                                    &ldquo;{vitrin.query || 'Ürün önerisi'}&rdquo;
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[11px] text-secondary flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                        {formatDate(vitrin.savedAt)}
                                                    </span>
                                                    <span className="text-[11px] text-secondary flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                                                        {vitrin.totalProducts} ürün
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Ürün Thumbnail'leri */}
                                            {vitrin.productImages && vitrin.productImages.length > 0 && (
                                                <div className="hidden sm:flex -space-x-3 flex-shrink-0">
                                                    {vitrin.productImages.slice(0, 4).map((img, j) => (
                                                        <div key={j} className="w-10 h-10 rounded-lg border-2 border-white bg-white overflow-hidden shadow-sm">
                                                            <img src={img} className="w-full h-full object-contain" alt="" />
                                                        </div>
                                                    ))}
                                                    {vitrin.totalProducts > 4 && (
                                                        <div className="w-10 h-10 rounded-lg border-2 border-white bg-surface-container-high flex items-center justify-center shadow-sm">
                                                            <span className="text-[10px] font-bold text-secondary">+{vitrin.totalProducts - 4}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Sağ taraf: Sil + Expand */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={(e) => handleDeleteVitrin(e, vitrin.msgId)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg text-secondary opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition-all"
                                                title="Vitrini Sil"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                            <span className={`material-symbols-outlined text-[22px] text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Genişletilmiş Ürün Grid'i */}
                                    {isExpanded && (
                                        <div className="border-t border-outline-variant/20 bg-surface-container-low/30 p-5 md:p-6">
                                            {isLoading ? (
                                                <div className="flex items-center justify-center py-12 gap-3">
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-sm text-secondary font-medium">Ürünler yükleniyor...</span>
                                                </div>
                                            ) : products.length > 0 ? (
                                                <>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                                                            {products.length} Ürün Listelendi
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                        {products.map(product => (
                                                            <ProductCard key={`vitrin-${product.id}`} product={product} isGrid={true} />
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center py-8 text-secondary text-sm">
                                                    <span className="material-symbols-outlined text-3xl text-outline-variant mb-2 block">inventory_2</span>
                                                    Bu vitrinle eşleşen ürün bulunamadı.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
