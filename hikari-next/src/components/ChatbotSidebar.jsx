'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ChatbotSidebar({ isOpen, onClose }) {
    // 1. Sohbet kalıcılığı: Mesaj geçmişini sessionStorage'dan yüklüyoruz.
    const [messages, setMessages] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('hikai_messages');
            if (saved) return JSON.parse(saved);
        }
        return [
            { id: 1, text: "Merhaba! Ben Hikai. Sana özel stil önerileri sunmak, hediye seçmek veya koleksiyonlarımız hakkında bilgi vermek için buradayım.", sender: "bot" }
        ];
    });
    
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // { base64Data, mimeType, previewUrl }
    const [isDragging, setIsDragging] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // 2. Sağ tarafta açılacak premium Ürün Çekmecesi (ProductDrawer) durumları
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [drawerPrimaryProducts, setDrawerPrimaryProducts] = useState([]);
    const [drawerSecondaryProducts, setDrawerSecondaryProducts] = useState([]);

    // 3. Sohbet geçmişini her değiştiğinde sessionStorage'a kaydediyoruz.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('hikai_messages', JSON.stringify(messages));
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
    const fetchProductsForKeywords = async (keywords, userQuery = "") => {
        if (!keywords || keywords.length === 0) return [];
        let results = [];
        const uqLower = userQuery.toLowerCase().replace(/[.,?!]/g, '');
        const uqWords = uqLower.split(' ').filter(w => w.length > 3);

        for (const item of keywords) {
            if (!item.trim()) continue;
            
            let currentMatches = [];
            let mainCat = '';
            let subCat = '';
            let kw = item;
            let targetDescription = item;

            // Format: "AnaKategori > AltKategori > anahtar_kelime > Hedef_Açıklama" veya "EXACT > ID > uuid"
            if (item.includes('>')) {
                const parts = item.split('>').map(p => p.trim());
                if (parts[0] === 'EXACT' && parts[1] === 'ID' && parts[2]) {
                    const { data: prodData } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', parts[2])
                        .limit(1);
                    if (prodData && prodData.length > 0) {
                        results.push(prodData[0]);
                    }
                    continue; // EXACT ID verildiğinde fallback filtrelerine girmeyiz
                } else if (parts.length >= 3) {
                    mainCat = parts[0];
                    subCat = parts[1];
                    kw = parts[2];
                    if (parts[3]) targetDescription = parts[3];
                    
                    // 1. Kategori tablosundan tam kategori ID'sini buluyoruz
                    const { data: catData } = await supabase
                        .from('categories')
                        .select('id')
                        .ilike('main_category', mainCat)
                        .ilike('sub_category', subCat)
                        .limit(1);
                    
                    const catId = catData?.[0]?.id;
                    
                    if (catId) {
                        // 2. Kategori ID'si altında ürün ismi eşleşmesi arıyoruz
                        const { data: prodData } = await supabase
                            .from('products')
                            .select('*')
                            .eq('category_id', catId)
                            .ilike('productname', `%${kw}%`)
                            .limit(4);
                            
                        if (prodData && prodData.length > 0) {
                            currentMatches = prodData;
                        }
                    }
                } else if (parts.length === 2) {
                    subCat = parts[0];
                    kw = parts[1];
                    const { data: catData } = await supabase
                        .from('categories')
                        .select('id')
                        .ilike('sub_category', subCat)
                        .limit(1);
                    const catId = catData?.[0]?.id;
                    
                    if (catId) {
                        const { data: prodData } = await supabase
                            .from('products')
                            .select('*')
                            .eq('category_id', catId)
                            .ilike('productname', `%${kw}%`)
                            .limit(4);
                        if (prodData && prodData.length > 0) {
                            currentMatches = prodData;
                        }
                    }
                }
            }

            // FALLBACK A: Kategori araması sonuç vermediyse veya yeterince ürün dönmediyse,
            // veritabanındaki kategori hatalarını tolere etmek için GLOBAL anahtar kelime araması yapıyoruz.
            if (currentMatches.length < 3) {
                const cleanKw = kw.trim();
                const { data: globalData } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('productname', `%${cleanKw}%`)
                    .limit(10);
                
                if (globalData && globalData.length > 0) {
                    // DİNAMİK BAĞIMSIZLIK ÖLÇÜMÜ (SEMANTIC INDEPENDENCE FILTER)
                    const targetMain = (mainCat || '').toLowerCase();
                    const targetSub = (subCat || '').toLowerCase();
                    
                    const filteredGlobal = globalData.filter(g => {
                        const gMain = (g.main_category || '').toLowerCase();
                        const gSub = (g.sub_category || '').toLowerCase();
                        const pName = (g.productname || '').toLowerCase();
                        
                        let isRelated = false;

                        // 1. Hedef Kategori ile Temel Bağlantı var mı?
                        if (targetMain && (gMain.includes(targetMain) || gSub.includes(targetMain) || targetMain.includes(gMain))) {
                            isRelated = true;
                        }

                        // 2. Kullanıcı Sorusu ile Bağlam Kesişimi var mı?
                        const contextMatch = uqWords.some(w => pName.includes(w) || gMain.includes(w) || gSub.includes(w));
                        if (contextMatch) {
                            isRelated = true;
                        }

                        // 3. Akraba/Geniş Kategori Toleransı (Örn: AI Elektronik dedi, ürün Ev & Yaşam > Küçük Ev Aletleri)
                        const isElectronics = targetMain.includes('elektronik') || targetMain.includes('bilgisayar');
                        const isProductElectronics = gMain.includes('elektronik') || gMain.includes('elektrikli') || gSub.includes('elektronik');
                        if (isElectronics && isProductElectronics) isRelated = true;

                        // ÖLÇÜM KARARI: Eğer hedef kategoriden çok sapmışsa ve soruyla da hiç bağ kurulamadıysa (Bağımsızsa)
                        if (!isRelated && targetMain) {
                            // Bisiklet, Oto, Kitap gibi aşırı spesifik kategorilere kaydıysa kesinlikle kaldır (Örn: koltuk->bisiklet)
                            const distantCategories = ['bisiklet', 'oto', 'yapı market', 'kitap', 'hırdavat', 'petshop', 'bahçe', 'giyim'];
                            const isDistant = distantCategories.some(c => gMain.includes(c) || gSub.includes(c));
                            
                            // Ya da ürün isminde soruda geçmeyen saptırıcı/bağımsız kelimeler varsa
                            const poisonWords = ['bisiklet', 'araba', 'motor', 'bebek', 'kitap', 'roman'];
                            const isPoisoned = poisonWords.some(pw => pName.includes(pw) && !uqLower.includes(pw));

                            if (isDistant || isPoisoned) {
                                return false; // ÇOK UZAK ÜRÜN, KALDIRILDI!
                            }
                        }

                        return true;
                    });

                    // Tekrarları önleyerek mevcut eşleşmelerle birleştiriyoruz
                    const existingIds = new Set(currentMatches.map(m => m.id));
                    const newUnique = filteredGlobal.filter(g => !existingIds.has(g.id));
                    currentMatches = [...currentMatches, ...newUnique].slice(0, 4);
                }
            }

            // KURAL: Eğer kullanıcı çocuk/bebek kategorisi aramadıysa (intent yetişkin ise),
            // global aramadan gelen bebek/çocuk giysilerini filtreleyerek yetişkin konseptini koruyoruz!
            if (mainCat && !mainCat.toLowerCase().includes('çocuk') && !mainCat.toLowerCase().includes('bebek')) {
                currentMatches = currentMatches.filter(p => {
                    const name = (p.productname || '').toLowerCase();
                    return !name.includes('bebek') && !name.includes('çocuk') && !name.includes('bebek t-shirt') && !name.includes('bebek tişört');
                });
            }

            // SMART SCORING & POLLUTION FILTER (Anti-Aksesuar Filtresi)
            // Eğer ürün EXACT ID ile gelmediyse, gelen ürünlerin niyetle uyuşup uyuşmadığını puanlarız.
            if (!item.startsWith('EXACT')) {
                const targetWords = targetDescription.toLowerCase().split(' ').filter(w => w.length > 2);
                const pollutionWords = ['boya', 'boyası', 'kılıf', 'kılıfı', 'askı', 'askısı', 'koruyucu', 'tutucu', 'stand', 'aparat', 'aksesuar', 'yedek', 'parça', 'şarj', 'kablo', 'fırça', 'fırçası', 'maket', 'minyatür', 'kordon', 'kayış', 'temizleyici', 'sprey', 'pompa', 'jel', 'krem', 'losyon', 'çanta', 'çantası', 'oyuncak', 'set', 'seti', 'oyunu'];
                
                // Eğer kullanıcının aradığı anahtar kelime zaten bir kirlilik kelimesiyse, onu kirlilik listesinden çıkar!
                const kwLower = kw.toLowerCase();
                const activePollutionWords = pollutionWords.filter(pw => !kwLower.includes(pw) && !targetDescription.toLowerCase().includes(pw) && !uqLower.includes(pw));

                currentMatches = currentMatches.map(p => {
                    let score = 0;
                    const pName = (p.productname || '').toLowerCase();
                    const pWords = pName.split(/[\s-]+/);

                    // 1. Hedef kelimelerin kaçı ürün isminde geçiyor?
                    targetWords.forEach(tw => {
                        if (pName.includes(tw)) score += 5;
                    });

                    // 2. Anahtar kelime ürün isminde var mı?
                    if (pName.includes(kwLower)) score += 10;

                    // 3. Ürün ismi kirlilik (yan ürün/aksesuar) kelimesi içeriyor mu?
                    const isPolluted = activePollutionWords.some(pw => pWords.includes(pw) || pName.endsWith(pw));
                    if (isPolluted) score -= 50; // Ağır ceza!

                    // 4. Head Noun (Türkçe'de sondaki kelime) anahtar kelimeyle veya hedefle uyuşuyor mu?
                    if (pWords.length > 0) {
                        const lastWord = pWords[pWords.length - 1].replace(/[^a-zğüşöçı]/g, "");
                        if (lastWord.includes(kwLower) || targetWords.some(tw => lastWord.includes(tw))) {
                            score += 20; // Ana ürün olma ihtimali çok yüksek!
                        }
                    }

                    return { ...p, _matchScore: score };
                })
                .filter(p => p._matchScore > 0) // Negatif puan alan (aksesuar/yan ürün) çöpe!
                .sort((a, b) => b._matchScore - a._matchScore); // En yüksek puanlılar en üste
            }

            // NORMALİZASYON: Eşleşen ürünlerin kategorilerini frontend düzeyinde düzeltiyoruz!
            // Böylece veritabanı kısıtı veya eski/yanlış kategori verisi olan kramponlar vb. 
            // arayüzde doğru kategorisinde ('Spor & Outdoor > Spor Ayakkabı') görünür.
            currentMatches = currentMatches.map(p => {
                const name = (p.productname || '').toLowerCase();
                if (name.includes('krampon')) {
                    p.main_category = 'Spor & Outdoor';
                    p.sub_category = 'Spor Ayakkabı';
                    p.category_id = 139;
                } else if (name.includes('matara') || name.includes('suluk')) {
                    p.main_category = 'Spor & Outdoor';
                    p.sub_category = 'Spor Malzemeleri';
                    p.category_id = 141;
                } else if (name.includes('şort') && !name.includes('bebek') && !name.includes('çocuk')) {
                    p.main_category = 'Spor & Outdoor';
                    p.sub_category = 'Spor Alt Giyim';
                    p.category_id = 137;
                } else if (name.includes('tişört') && !name.includes('bebek') && !name.includes('çocuk')) {
                    p.main_category = 'Spor & Outdoor';
                    p.sub_category = 'Spor Üst Giyim';
                    p.category_id = 136;
                } else if (name.includes('çorap')) {
                    if (name.includes('erkek')) {
                        p.main_category = 'Erkek';
                        p.sub_category = 'İç Giyim';
                    } else {
                        p.main_category = 'Kadın';
                        p.sub_category = 'Ev & İç Giyim';
                    }
                }
                return p;
            });

            results = [...results, ...currentMatches];
        }
        
        // Tekilleştirme (id'ye göre)
        const seen = new Set();
        return results.filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });
    };

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

            // 4. Gemini cevabından ürün etiketlerini ayrıştırma ve Supabase'den canlı çekme
            const productTagRegex = /\[Products:\s*([^\]]+)\]/i;
            const match = botReply.match(productTagRegex);
            let cleanText = botReply;
            let primaryProds = [];
            let secondaryProds = [];

            if (match) {
                cleanText = botReply.replace(productTagRegex, '').trim();
                const tagContent = match[1];
                let primaryKeywords = [];
                let secondaryKeywords = [];

                if (tagContent.includes('|')) {
                    const parts = tagContent.split('|');
                    primaryKeywords = parts[0].split(',').map(k => k.trim()).filter(Boolean);
                    secondaryKeywords = parts[1].split(',').map(k => k.trim()).filter(Boolean);
                } else {
                    // Dikey çizgi yoksa fallback: ilk kelimeyi ana ürün, diğerlerini yan ürün yap
                    const allKws = tagContent.split(',').map(k => k.trim()).filter(Boolean);
                    if (allKws.length > 0) {
                        primaryKeywords = [allKws[0]];
                        secondaryKeywords = allKws.slice(1);
                    }
                }

                // Canlı Supabase aramalarını paralel başlatıyoruz
                const [fetchedPrimary, fetchedSecondary] = await Promise.all([
                    fetchProductsForKeywords(primaryKeywords, text),
                    fetchProductsForKeywords(secondaryKeywords, text)
                ]);

                primaryProds = fetchedPrimary;
                secondaryProds = fetchedSecondary;
            }

            // Bot mesajının kendisinde bu aramanın ürünlerini önbellekliyoruz.
            // Bu sayede chatin altındaki mini vitrine tıklanınca drawer bu veriyi anında geri yükleyebilir.
            const botMessageObj = {
                id: Date.now(),
                text: cleanText,
                sender: "bot",
                primaryProducts: primaryProds,
                secondaryProducts: secondaryProds
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

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() && !selectedImage) return;
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
                                            
                                            {/* Mini Görsel Önizlemeleri */}
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex -space-x-2.5 overflow-hidden">
                                                    {[...(msg.primaryProducts || []), ...(msg.secondaryProducts || [])].slice(0, 3).map((prod, idx) => (
                                                        <div key={idx} className="inline-block h-8 w-8 rounded-full border border-white bg-white overflow-hidden shadow-sm flex items-center justify-center p-0.5">
                                                            <img src={prod.imgUrl} className="max-w-full max-h-full object-contain" alt="Showcase item" />
                                                        </div>
                                                    ))}
                                                </div>
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
                            disabled={!inputValue.trim() && !selectedImage}
                            className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${(inputValue.trim() || selectedImage)
                                    ? 'bg-primary text-white shadow-md hover:shadow-lg hover:scale-105'
                                    : 'bg-surface-container-highest text-secondary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px] ml-0.5">send</span>
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
