'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── Pipeline Debug Paneli ────────────────────────────────────────────────────
function DebugPanel({ debug }) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedStage, setExpandedStage] = useState(null);

    if (!debug || !debug.length) return null;

    const plannerStage = debug.find(d => d.stage?.includes('PLANNER'));
    const planData = plannerStage?.data;

    const stageIcons = {
        'PLANNER': '🧠',
        'DB ARAMA': '🔍',
        'GÖRSEL': '🖼️',
        'CİNSİYET': '👤',
        'RESPONDER': '💬'
    };

    const getIcon = (stage) => {
        for (const [key, icon] of Object.entries(stageIcons)) {
            if (stage.includes(key)) return icon;
        }
        return '⚙️';
    };

    return (
        <div className="ml-10 mr-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/80 border border-outline-variant/30 text-[10px] font-bold text-secondary hover:text-primary hover:border-primary/40 transition-all duration-200 backdrop-blur-sm"
            >
                <span className="text-[14px]">🔬</span>
                <span>Pipeline Debug</span>
                <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {isOpen && (
                <div className="mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 text-[11px] font-mono space-y-2 shadow-xl overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-hide">
                    {/* Planner Özeti */}
                    {planData && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                                <span>🧠</span>
                                <span>PLANNER ÇIKTISI</span>
                            </div>
                            <div className="text-gray-300">
                                <span className="text-blue-300">intent:</span> <span className="text-green-400">&quot;{planData.intent}&quot;</span>
                            </div>

                            {/* Primary Items */}
                            {planData.primary?.map((item, i) => (
                                <div key={`p-${i}`} className="bg-gray-800/50 rounded-md p-2 mt-1 border border-gray-700/30">
                                    <div className="text-amber-400 font-bold mb-1">🎯 Primary [{i}]</div>
                                    <div className="text-gray-300 space-y-0.5">
                                        <div><span className="text-gray-500">keywords:</span> <span className="text-green-400">[{(item.keywords || [item.keyword]).filter(Boolean).map(k => `"${k}"`).join(', ')}]</span></div>
                                        {item.alternatives?.length > 0 && (
                                            <div><span className="text-gray-500">alternatives:</span> <span className="text-yellow-400">[{item.alternatives.map(a => `"${a}"`).join(', ')}]</span></div>
                                        )}
                                        <div><span className="text-gray-500">mainCat:</span> <span className="text-purple-400">{item.mainCat || '-'}</span> <span className="text-gray-500">subCat:</span> <span className="text-purple-400">{item.subCat || '-'}</span></div>
                                        {item.description && <div><span className="text-gray-500">desc:</span> <span className="text-gray-400">{item.description}</span></div>}
                                    </div>
                                </div>
                            ))}

                            {/* Secondary Items */}
                            {planData.secondary?.map((item, i) => (
                                <div key={`s-${i}`} className="bg-gray-800/50 rounded-md p-2 mt-1 border border-gray-700/30">
                                    <div className="text-cyan-400 font-bold mb-1">✨ Secondary [{i}]</div>
                                    <div className="text-gray-300 space-y-0.5">
                                        <div><span className="text-gray-500">keywords:</span> <span className="text-green-400">[{(item.keywords || [item.keyword]).filter(Boolean).map(k => `"${k}"`).join(', ')}]</span></div>
                                        {item.alternatives?.length > 0 && (
                                            <div><span className="text-gray-500">alternatives:</span> <span className="text-yellow-400">[{item.alternatives.map(a => `"${a}"`).join(', ')}]</span></div>
                                        )}
                                        <div><span className="text-gray-500">mainCat:</span> <span className="text-purple-400">{item.mainCat || '-'}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pipeline Aşamaları */}
                    {debug.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className="text-[13px] mt-0.5 shrink-0">{getIcon(step.stage)}</span>
                            <div className="flex-1 min-w-0">
                                <button
                                    onClick={() => setExpandedStage(expandedStage === i ? null : i)}
                                    className="w-full text-left"
                                >
                                    <span className="text-emerald-400 font-bold">{step.stage}</span>
                                    <span className="text-gray-400 ml-2">{step.detail}</span>
                                    {(step.primaryNames || step.data) && (
                                        <span className={`material-symbols-outlined text-[12px] text-gray-500 ml-1 inline-block transition-transform ${expandedStage === i ? 'rotate-180' : ''}`}>expand_more</span>
                                    )}
                                </button>
                                {expandedStage === i && step.primaryNames && (
                                    <div className="mt-1 pl-2 border-l border-gray-700 text-gray-400 space-y-0.5">
                                        <div className="text-amber-400">Primary ürünler:</div>
                                        {step.primaryNames.map((n, j) => <div key={j} className="text-gray-300 truncate">• {n}</div>)}
                                        {step.secondaryNames?.length > 0 && (
                                            <>
                                                <div className="text-cyan-400 mt-1">Secondary ürünler:</div>
                                                {step.secondaryNames.map((n, j) => <div key={j} className="text-gray-300 truncate">• {n}</div>)}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ChatbotSidebar({ isOpen, onClose }) {
    // 1. Sohbet kalıcılığı: Başlangıçta sabit default — hydration uyumu için.
    const defaultMessages = [
        { id: 1, text: "Merhaba! Ben Hikai. Sana özel stil önerileri sunmak, hediye seçmek veya koleksiyonlarımız hakkında bilgi vermek için buradayım.", sender: "bot" }
    ];
    const [messages, setMessages] = useState(defaultMessages);
    const [hydrated, setHydrated] = useState(false);

    // sessionStorage'dan yükleme — sadece client mount sonrası
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('hikai_messages');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
            }
        } catch {}
        setHydrated(true);
    }, []);
    
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // { base64Data, mimeType, previewUrl }
    const [isDragging, setIsDragging] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownSec, setCooldownSec] = useState(0);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cooldownRef = useRef(null);

    // 2. Sağ tarafta açılacak premium Ürün Çekmecesi (ProductDrawer) durumları
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPrimaryProducts, setDrawerPrimaryProducts] = useState([]);
    const [drawerSecondaryProducts, setDrawerSecondaryProducts] = useState([]);

    // 3. Sohbet geçmişini her değiştiğinde sessionStorage'a kaydediyoruz.
    // Base64 görsel verisi ve debug bilgisi çıkarılır (sessionStorage 5MB limiti).
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const lightweight = messages.map(m => {
                    const clean = { ...m };
                    // Görsel base64 verisini kaldır (çok büyük), sadece previewUrl ve flag kalsın
                    if (clean.image) {
                        clean.image = { mimeType: clean.image.mimeType, hadImage: true };
                    }
                    // Debug verisini kaldır (geçici panel zaten)
                    delete clean.debug;
                    // Ürün listelerini kaldır (drawer zaten re-fetch eder)
                    delete clean.primaryProducts;
                    delete clean.secondaryProducts;
                    return clean;
                });
                sessionStorage.setItem('hikai_messages', JSON.stringify(lightweight));
            } catch (e) {
                console.warn('[SessionStorage] Kayıt başarısız:', e.message);
            }
        }
    }, [messages]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const base64Data = base64String.split(',')[1];
                setSelectedImage({
                    base64Data: base64Data,
                    mimeType: file.type,
                    previewUrl: base64String
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const base64Data = base64String.split(',')[1];
            setSelectedImage({
                base64Data: base64Data,
                mimeType: file.type,
                previewUrl: base64String
            });
        };
        reader.readAsDataURL(file);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 50);
        }
    }, [isOpen]);

    // Hikai'nin önerdiği anahtar kelimeleri canlı veritabanında sorgulayan fonksiyon (Kategori Odaklı Arama + Global Eşleşme ve Normalizasyon)
    // Not: Urun arama mantigi artik server-side (route.js) calisir. fetchProductsForKeywords kaldirildi.


    const sendMessage = async (text) => {
        if (!text.trim() && !selectedImage) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: "user",
            ...(selectedImage ? { image: { base64Data: selectedImage.base64Data, mimeType: selectedImage.mimeType } } : {})
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setSelectedImage(null);

        // Kullanıcı promptunu gönderir göndermez sepet çekmecesini açıp animasyonlu loading başlatıyoruz.
        setIsDrawerOpen(true);
        setDrawerLoading(true);
        setDrawerPrimaryProducts([]);
        setDrawerSecondaryProducts([]);

        // "Hikai düşünüyor..." yükleme balonunu chat'e ekliyoruz.
        const botTempId = Date.now() + 1;
        setMessages(prev => [...prev, { id: botTempId, text: "Hikai düşünüyor...", sender: "bot", isLoading: true }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            });

            const data = await res.json();
            const botReply = data.text || data.error;

            // Sunucu primaryProducts ve secondaryProducts'i dogrudan donduruyor.
            // Eski [Products: ...] regex parse mantigi kaldirildi.
            const cleanText = botReply;
            const primaryProds = data.primaryProducts || [];
            const secondaryProds = data.secondaryProducts || [];

            // Bot mesajının kendisinde bu aramanın ürünlerini önbellekliyoruz.
            // Bu sayede chatin altındaki mini vitrine tıklanınca drawer bu veriyi anında geri yükleyebilir.
            const botMessageObj = {
                id: Date.now(),
                text: cleanText,
                sender: "bot",
                primaryProducts: primaryProds,
                secondaryProducts: secondaryProds,
                debug: data.debug || null
            };

            setMessages(prev =>
                prev.map(m => m.id === botTempId ? botMessageObj : m)
            );

            // Drawer durumunu güncelleyip yüklemeyi bitiriyoruz.
            setDrawerPrimaryProducts(primaryProds);
            setDrawerSecondaryProducts(secondaryProds);
            setDrawerLoading(false);

        } catch (error) {
            console.error("Hikai communication error:", error);
            setMessages(prev =>
                prev.map(m => m.id === botTempId ? { id: Date.now(), text: "Hikai şu anda bağlanamadı. Lütfen daha sonra tekrar deneyin.", sender: "bot" } : m)
            );
            setDrawerLoading(false);
        }
    };

    // Cooldown başlat (8 saniye)
    const startCooldown = () => {
        const COOLDOWN = 8;
        setIsCooldown(true);
        setCooldownSec(COOLDOWN);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldownSec(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    setIsCooldown(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedImage) return;
        if (isCooldown) return;
        startCooldown();
        sendMessage(inputValue);
    };

    const handleSuggestionClick = (text) => {
        sendMessage(text);
    };

    // Chat altındaki vitrin kutucuklarında "Vitrini Göster" denildiğinde drawer'ı tetikleyen fonksiyon
    const handleOpenShowcase = (primary, secondary) => {
        setDrawerPrimaryProducts(primary || []);
        setDrawerSecondaryProducts(secondary || []);
        setDrawerLoading(false);
        setIsDrawerOpen(true);
    };

    // ── Vitrin Kaydetme Sistemi ──────────────────────────────────────────────
    const [savedVitrinIds, setSavedVitrinIds] = useState(() => {
        // Daha önce kaydedilmiş vitrin mesaj ID'lerini yükle
        if (typeof window !== 'undefined') {
            try {
                const ud = JSON.parse(sessionStorage.getItem('userData')) || {};
                return (ud.saved_vitrins || []).map(v => v.msgId);
            } catch { return []; }
        }
        return [];
    });

    const isVitrinSaved = (msgId) => savedVitrinIds.includes(msgId);

    const handleSaveVitrin = (msg) => {
        // 1. Auth kontrolü — favorites ile aynı pattern
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Vitrini kaydetmek için lütfen giriş yapın.');
            window.location.href = '/login';
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.saved_vitrins) userData.saved_vitrins = [];

        // 2. Toggle: zaten kaydedilmişse kaldır
        const existingIdx = userData.saved_vitrins.findIndex(v => v.msgId === msg.id);
        if (existingIdx !== -1) {
            userData.saved_vitrins.splice(existingIdx, 1);
            sessionStorage.setItem('userData', JSON.stringify(userData));
            setSavedVitrinIds(userData.saved_vitrins.map(v => v.msgId));

            // Supabase sync
            if (userData.id) {
                supabase.from('profiles')
                    .update({ saved_vitrins: userData.saved_vitrins })
                    .eq('id', userData.id)
                    .then(({ error }) => { if (error) console.error('[Vitrin] Supabase remove error:', error); });
            }
            return;
        }

        // 3. Yeni vitrin kaydet
        // Kullanıcının bu yanıttan önceki son mesajını bul (sorgu metni olarak)
        const msgIndex = messages.findIndex(m => m.id === msg.id);
        let queryText = '';
        for (let i = msgIndex - 1; i >= 0; i--) {
            if (messages[i].sender === 'user') {
                queryText = messages[i].text || '';
                break;
            }
        }

        const allProducts = [...(msg.primaryProducts || []), ...(msg.secondaryProducts || [])];
        const vitrinEntry = {
            msgId: msg.id,
            query: queryText,
            productIds: allProducts.map(p => p.id),
            productNames: allProducts.slice(0, 5).map(p => p.productname),
            productImages: allProducts.slice(0, 4).map(p => p.imgUrl),
            totalProducts: allProducts.length,
            savedAt: new Date().toISOString()
        };

        userData.saved_vitrins.push(vitrinEntry);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setSavedVitrinIds(userData.saved_vitrins.map(v => v.msgId));

        // 4. Supabase sync
        if (userData.id) {
            supabase.from('profiles')
                .update({ saved_vitrins: userData.saved_vitrins })
                .eq('id', userData.id)
                .then(({ error }) => { if (error) console.error('[Vitrin] Supabase save error:', error); });
        }

        window.dispatchEvent(new Event('storage'));
    };

    return (
        <>
            {/* Animasyonlu CSS Stil Blokları */}
            <style jsx global>{`
                @keyframes cartBounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-8px) scale(1.05); }
                }
                @keyframes floatDown {
                    0% {
                        transform: translateY(-50px) translateX(-50%) scale(0.6);
                        opacity: 0;
                    }
                    30% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(20px) translateX(-50%) scale(1.1);
                        opacity: 0;
                    }
                }
                .cart-bounce-animation {
                    animation: cartBounce 2s infinite ease-in-out;
                }
                .floating-item-1 {
                    animation: floatDown 1.6s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .floating-item-2 {
                    animation: floatDown 1.6s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s;
                }
                .floating-item-3 {
                    animation: floatDown 1.6s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s;
                }
            `}</style>

            {/* Arka plan overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-500 ${(isOpen || isDrawerOpen) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => {
                    onClose();
                    setIsDrawerOpen(false);
                }}
            ></div>

            {/* Sidebar (Chat Arayüzü - Sol) */}
            <div
                onDragEnter={handleDragEnter}
                className={`fixed top-0 left-0 h-full w-[95vw] sm:w-[500px] md:w-[570px] lg:w-[620px] bg-surface z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Sürükle ve Bırak Katmanı */}
                {isDragging && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="absolute inset-0 bg-primary/20 backdrop-blur-sm z-[80] flex flex-col items-center justify-center p-8 border-4 border-dashed border-primary/60 rounded-3xl m-4 transition-all duration-300 pointer-events-auto"
                    >
                        <div className="bg-white/95 p-6 rounded-full shadow-lg flex items-center justify-center animate-bounce mb-4 border border-outline-variant/30">
                            <span className="material-symbols-outlined text-[48px] text-primary">cloud_upload</span>
                        </div>
                        <p className="text-lg font-bold text-primary text-center">Görseli Buraya Bırakın</p>
                        <p className="text-xs text-secondary mt-1 text-center font-medium">Hikai bu görseli analiz etmeye hazır!</p>
                    </div>
                )}

                {/* Dekoratif Arka Plan Efektleri */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="relative flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/20 bg-surface/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-outline-variant/30 flex items-center justify-center shadow-lg p-2">
                                <img src="/hikai-logo.png" className="w-full h-full object-contain" alt="Hikai Logo" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-extrabold text-on-surface tracking-tight">Hikai</h2>
                            <p className="text-xs text-secondary font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">bolt</span>
                                E-Ticaret Yoldaşınız Çevrimiçi!
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Drawer'ı elle tetikleme / kapatma butonu */}
                        {(drawerPrimaryProducts.length > 0 || drawerSecondaryProducts.length > 0 || drawerLoading) && (
                            <button
                                onClick={() => setIsDrawerOpen(prev => !prev)}
                                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-300 ${isDrawerOpen ? 'bg-primary text-white border-primary' : 'bg-surface-container-high border-outline-variant/40 text-secondary hover:text-primary'}`}
                                title="Akıllı Ürün Vitrinini Göster"
                            >
                                <span className="material-symbols-outlined text-[20px]">local_mall</span>
                                <span className="text-xs font-bold hidden sm:inline">Vitrini Gör</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full hover:bg-surface-container-high text-secondary hover:text-primary transition-all duration-300 hover:rotate-90"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 scrollbar-hide">
                    {messages.length === 1 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-secondary mb-4 uppercase tracking-wider pl-1">Önerilen Konular</p>
                            <div className="flex flex-wrap gap-2.5">
                                <button onClick={() => handleSuggestionClick("Plajda giyilecek kadın kombini hazırla.")} className="px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-xs font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">beach_access</span>
                                    Plaj Kombinleri
                                </button>
                                <button onClick={() => handleSuggestionClick("Halısaha maçı için ne lazım?")} className="px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-xs font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">sports_soccer</span>
                                    Halısaha Hazırlığı
                                </button>
                                <button onClick={() => handleSuggestionClick("Anneler Günü için hediye önerileri")} className="px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-xs font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">card_giftcard</span>
                                    Hediye Önerileri
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const hasProducts = (msg.primaryProducts && msg.primaryProducts.length > 0) || (msg.secondaryProducts && msg.secondaryProducts.length > 0);
                        return (
                            <div key={msg.id} className="space-y-4">
                                {/* Pipeline Debug Paneli */}
                                {msg.sender === 'bot' && !msg.isLoading && msg.debug && (
                                    <DebugPanel debug={msg.debug} />
                                )}
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} opacity-100 transition-opacity duration-300`}>
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center mr-2.5 flex-shrink-0 mt-1 shadow-sm overflow-hidden p-1">
                                            <img src="/hikai-logo.png" className="w-full h-full object-contain" alt="Hikai Bot" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] p-4 md:p-5 text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-primary to-[#8a3100] text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white border border-outline-variant/20 text-on-surface rounded-2xl rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.image && (
                                            <div className="mb-3 max-w-xs rounded-xl overflow-hidden shadow-sm border border-white/20">
                                                <img
                                                    src={`data:${msg.image.mimeType};base64,${msg.image.base64Data}`}
                                                    alt="Yüklenen Görsel"
                                                    className="max-h-52 w-auto object-contain rounded-xl"
                                                />
                                            </div>
                                        )}
                                        {msg.isLoading ? (
                                            <div className="flex items-center gap-1.5 py-1 px-1.5">
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-line text-[13px] md:text-[14px]">
                                                {(() => {
                                                    if (!msg.text) return null;
                                                    // Madde işaretlerini güzelleştiriyoruz
                                                    const textWithBullets = msg.text.replace(/(^|\n)\*\s/g, '$1• ');
                                                    const parts = textWithBullets.split(/(\*\*.*?\*\*)/g);
                                                    return parts.map((part, i) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={i} className="font-extrabold text-primary">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return <span key={i}>{part}</span>;
                                                    });
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 5. CEVAP ALTI VİTRİN KUTUCUĞU (Showcase Widget) */}
                                {msg.sender === 'bot' && !msg.isLoading && hasProducts && (
                                    <div className="pl-10 pr-2">
                                        <div className="bg-gradient-to-r from-surface-container-low via-surface-container-high to-surface-container-low border border-outline-variant/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-primary/40 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-[22px]">local_mall</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">Hikai Özel Alışveriş Vitrini</p>
                                                    <p className="text-[10px] text-secondary font-medium mt-0.5">
                                                        Bu cevaba özel {((msg.primaryProducts?.length || 0) + (msg.secondaryProducts?.length || 0))} ürün listelendi.
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Mini Görsel Önizlemeleri + Butonlar */}
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex -space-x-2.5 overflow-hidden">
                                                    {[...(msg.primaryProducts || []), ...(msg.secondaryProducts || [])].slice(0, 3).map((prod, idx) => (
                                                        <div key={idx} className="inline-block h-8 w-8 rounded-full border border-white bg-white overflow-hidden shadow-sm flex items-center justify-center p-0.5">
                                                            <img src={prod.imgUrl} className="max-w-full max-h-full object-contain" alt="Showcase item" />
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Vitrini Kaydet Butonu */}
                                                <button
                                                    onClick={() => handleSaveVitrin(msg)}
                                                    title={isVitrinSaved(msg.id) ? 'Vitrin kaydedildi' : 'Vitrini Kaydet'}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 duration-200 shrink-0 ${
                                                        isVitrinSaved(msg.id)
                                                            ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                                                            : 'bg-surface-container-highest/60 text-secondary hover:text-primary hover:bg-primary/10 border border-outline-variant/30'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isVitrinSaved(msg.id) ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenShowcase(msg.primaryProducts, msg.secondaryProducts)}
                                                    className="px-3.5 py-1.5 bg-primary hover:bg-[#8a3100] text-white text-[11px] font-bold rounded-xl shadow-sm transition-all active:scale-95 duration-200 shrink-0"
                                                >
                                                    Vitrine Git
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Mesaj Yazma Alanı */}
                <div className="p-5 md:p-6 border-t border-outline-variant/20 bg-surface/80 backdrop-blur-md z-10">
                    {selectedImage && (
                        <div className="mb-3 relative inline-block">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary shadow-md relative">
                                <img
                                    src={selectedImage.previewUrl}
                                    alt="Önizleme"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-1.5 -right-1.5 bg-error text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors border border-white"
                            >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2.5 text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-high"
                                title="Fotoğraf ekle"
                            >
                                <span className="material-symbols-outlined text-[20px]">image</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Hikai ile konuşun..."
                            className="w-full pl-14 pr-14 py-4 rounded-full border border-outline-variant bg-white shadow-sm focus:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface text-[13px] md:text-[14px] outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={(!inputValue.trim() && !selectedImage) || isCooldown}
                            className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isCooldown
                                    ? 'bg-amber-500/80 text-white cursor-not-allowed'
                                    : (inputValue.trim() || selectedImage)
                                        ? 'bg-primary text-white shadow-md hover:shadow-lg hover:scale-105'
                                        : 'bg-surface-container-highest text-secondary'
                                }`}
                            title={isCooldown ? `${cooldownSec}s bekleyin` : 'Gönder'}
                        >
                            {isCooldown ? (
                                <span className="text-[12px] font-bold">{cooldownSec}s</span>
                            ) : (
                                <span className="material-symbols-outlined text-[18px] ml-0.5">send</span>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-[9px] text-secondary mt-3.5 font-medium">Hikai yanlışlıklar yapabilir. Lütfen önemli bilgileri doğrulayın.</p>
                </div>
            </div>

            {/* Premium Sağ Çekmece (ProductDrawer) */}
            <div
                className={`fixed top-0 right-0 h-full w-[95vw] sm:w-[500px] md:w-[600px] lg:w-[680px] bg-surface z-[68] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col overflow-hidden border-l border-outline-variant/20 ${isDrawerOpen && isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="relative flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/20 bg-surface/50 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[22px]">local_mall</span>
                        </div>
                        <div>
                            <h2 className="text-md md:text-lg font-extrabold text-on-surface tracking-tight">Akıllı Alışveriş Vitrini</h2>
                            <p className="text-[11px] text-secondary font-medium">Hikai'nin Canlı Ürün Eşleştirmeleri</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2.5 rounded-full hover:bg-surface-container-high text-secondary hover:text-primary transition-all duration-300"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface-container-lowest">
                    {drawerLoading ? (
                        /* Canlı Arama Animasyonu (Sepete Ürünlerin Animasyonla Doluşması) */
                        <div className="h-full flex flex-col items-center justify-center py-20 relative">
                            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                                {/* Uçan Temsili Ürünler */}
                                <div className="absolute top-0 left-1/2 text-2xl floating-item-1 pointer-events-none">👟</div>
                                <div className="absolute top-0 left-1/2 text-2xl floating-item-2 pointer-events-none">👕</div>
                                <div className="absolute top-0 left-1/2 text-2xl floating-item-3 pointer-events-none">💧</div>
                                
                                {/* Sepet İkonu */}
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary cart-bounce-animation shadow-sm">
                                    <span className="material-symbols-outlined text-[44px]">shopping_cart</span>
                                </div>
                            </div>
                            <h3 className="text-md font-bold text-on-surface text-center">Hikai Canlı Veritabanı Araması</h3>
                            <p className="text-xs text-secondary mt-1.5 max-w-xs text-center font-medium leading-relaxed">
                                İstekleriniz analiz ediliyor ve en alakalı ürünler mağaza veritabanından çekiliyor...
                            </p>
                        </div>
                    ) : (drawerPrimaryProducts.length === 0 && drawerSecondaryProducts.length === 0) ? (
                        /* Boş Durum */
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-[48px] text-outline-variant/60 mb-3">manage_search</span>
                            <h3 className="text-sm font-bold text-on-surface">Vitrinde Ürün Bulunmuyor</h3>
                            <p className="text-xs text-secondary mt-1 max-w-xs font-medium">
                                Hikai'den bir kombin veya ürün talebinde bulunun, canlı ürünler burada listelenecektir!
                            </p>
                        </div>
                    ) : (
                        /* Çift Sütunlu Ürün Listesi */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-start">
                            
                            {/* Sol Sütun: Öncelikli İhtiyaçlar */}
                            <div className="space-y-4">
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">target</span>
                                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">🎯 Öncelikli İhtiyacın</h3>
                                </div>
                                
                                {drawerPrimaryProducts.length === 0 ? (
                                    <p className="text-xs text-secondary italic p-4 text-center">Bu grupta eşleşen ürün bulunamadı.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {drawerPrimaryProducts.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white border-2 border-primary/20 hover:border-primary rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
                                            >
                                                <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm z-10 tracking-wide uppercase">
                                                    Ana Ürün
                                                </span>
                                                <div className="w-full h-36 bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center p-3 relative border border-outline-variant/10">
                                                    <img
                                                        src={item.imgUrl}
                                                        alt={item.productname}
                                                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {item.stars && (
                                                        <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-0.5 text-[10px] font-bold text-amber-500 shadow-sm border border-outline-variant/10">
                                                            <span className="material-symbols-outlined text-[10px] fill-1">star</span>
                                                            {item.stars}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-[10px] font-bold text-primary tracking-wide uppercase">{item.brand}</p>
                                                    <h4 className="text-sm font-bold text-on-surface mt-0.5 line-clamp-2 leading-snug" title={item.productname}>
                                                        {item.productname}
                                                    </h4>
                                                    <p className="text-xs text-secondary mt-1 truncate">
                                                        Kategori: {item.sub_category}
                                                    </p>
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                                                    <span className="text-md font-extrabold text-primary">
                                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0 }).format(item.price)} TL
                                                    </span>
                                                    <Link
                                                        href={`/detail?id=${item.id}`}
                                                        onClick={() => {
                                                            onClose();
                                                            setIsDrawerOpen(false);
                                                        }}
                                                        className="px-4 py-2 bg-primary hover:bg-[#8a3100] text-white text-[11px] font-bold rounded-xl shadow-sm transition-all active:scale-95 duration-200"
                                                    >
                                                        İncele
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Sağ Sütun: Bunlar da Lazım Olabilir */}
                            <div className="space-y-4">
                                <div className="bg-surface-container-high border border-outline-variant/40 rounded-2xl p-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                                    <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider">✨ Bunlar da Lazım Olabilir</h3>
                                </div>
                                
                                {drawerSecondaryProducts.length === 0 ? (
                                    <p className="text-xs text-secondary italic p-4 text-center">Bu grupta eşleşen ürün bulunamadı.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {drawerSecondaryProducts.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white border border-outline-variant/20 hover:border-secondary/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                                            >
                                                <div className="w-full h-32 bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center p-3 relative border border-outline-variant/10">
                                                    <img
                                                        src={item.imgUrl}
                                                        alt={item.productname}
                                                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {item.stars && (
                                                        <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-0.5 text-[10px] font-bold text-amber-500 shadow-sm border border-outline-variant/10">
                                                            <span className="material-symbols-outlined text-[10px] fill-1">star</span>
                                                            {item.stars}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-[10px] font-bold text-secondary tracking-wide uppercase">{item.brand}</p>
                                                    <h4 className="text-xs font-bold text-on-surface mt-0.5 line-clamp-2 leading-snug" title={item.productname}>
                                                        {item.productname}
                                                    </h4>
                                                    <p className="text-[11px] text-secondary mt-1 truncate">
                                                        Kategori: {item.sub_category}
                                                    </p>
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                                                    <span className="text-sm font-extrabold text-on-surface">
                                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0 }).format(item.price)} TL
                                                    </span>
                                                    <Link
                                                        href={`/detail?id=${item.id}`}
                                                        onClick={() => {
                                                            onClose();
                                                            setIsDrawerOpen(false);
                                                        }}
                                                        className="px-3.5 py-1.5 bg-surface-container-highest hover:bg-primary hover:text-white text-secondary text-[11px] font-bold rounded-xl shadow-sm transition-all active:scale-95 duration-200"
                                                    >
                                                        İncele
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
