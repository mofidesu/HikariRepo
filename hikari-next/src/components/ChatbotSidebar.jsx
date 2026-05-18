'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ChatbotSidebar({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba! Ben Hikai. Sana özel stil önerileri sunmak, hediye seçmek veya koleksiyonlarımız hakkında bilgi vermek için buradayım.", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // { base64Data, mimeType, previewUrl }
    const [isDragging, setIsDragging] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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

    useEffect(() => {
        fetch('/products.json')
            .then(res => res.json())
            .then(data => setAllProducts(data))
            .catch(err => console.error("Error loading products:", err));
    }, []);

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

        // Kullanıcıya yapay zekanın yanıt hazırlamakta olduğunu bildiren geçici "düşünüyor..." mesajını ekliyoruz.
        const botTempId = Date.now() + 1;
        setMessages(prev => [...prev, { id: botTempId, text: "Hikai düşünüyor...", sender: "bot", isLoading: true }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            });

            const data = await res.json();

            setMessages(prev =>
                prev.map(m => m.id === botTempId ? { id: Date.now(), text: data.text || data.error, sender: "bot" } : m)
            );
        } catch (error) {
            setMessages(prev =>
                prev.map(m => m.id === botTempId ? { id: Date.now(), text: "Hikai şu anda bağlanamadı. Lütfen daha sonra tekrar deneyin.", sender: "bot" } : m)
            );
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

    return (
        <>
            {/* Arka plan overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                onDragEnter={handleDragEnter}
                className={`fixed top-0 left-0 h-full w-[95vw] sm:w-[500px] md:w-[600px] lg:w-[700px] bg-surface z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Sürükle ve Bırak (Drag & Drop) Görsel Yükleme Katmanı */}
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
                        <p className="text-xs text-secondary mt-1 text-center font-medium">Hikai bu görseli anında analiz etmeye hazır!</p>
                    </div>
                )}
                {/* Dekoratif Arka Plan Efektleri */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="relative flex items-center justify-between p-8 border-b border-outline-variant/20 bg-surface/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-outline-variant/30 flex items-center justify-center shadow-lg p-2.5">
                                <img src="/hikai-logo.png" className="w-full h-full object-contain" alt="Hikai Logo" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-headline-md font-extrabold text-on-surface tracking-tight">Hikai</h2>
                            <p className="text-sm text-secondary font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                E-Ticaret Yoldaşınız Çevrimiçi!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-surface-container-high text-secondary hover:text-primary transition-all duration-300 hover:rotate-90"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 scrollbar-hide">
                    {messages.length === 1 && (
                        <div className="mb-8">
                            <p className="text-xs font-bold text-secondary mb-4 uppercase tracking-wider pl-1">Önerilen Konular</p>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => handleSuggestionClick("Plajda giyilecek kadın kombini hazırla.")} className="px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">beach_access</span>
                                    Plaj Kombinleri
                                </button>
                                <button onClick={() => handleSuggestionClick("Halısaha maçı için ne lazım?")} className="px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">sports_soccer</span>
                                    Halısaha Hazırlığı
                                </button>
                                <button onClick={() => handleSuggestionClick("Anneler Günü için hediye önerileri")} className="px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:border-primary hover:text-primary transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">card_giftcard</span>
                                    Hediye Önerileri
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const productTagRegex = /\[Products:\s*([^\]]+)\]/i;
                        const match = msg.text.match(productTagRegex);
                        let cleanText = msg.text;
                        let matchedItems = [];

                        if (match) {
                            cleanText = msg.text.replace(productTagRegex, '').trim();
                            const keywords = match[1].split(',').map(k => k.trim().toLowerCase());
                            if (allProducts.length > 0) {
                                // Eşleşen kelimelerin bulunduğu alana göre ürünlere alaka düzeyi puanı (score) verir ve en alakalıları listeler.
                                matchedItems = allProducts.map(prod => {
                                    let score = 0;
                                    keywords.forEach(kw => {
                                        const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        // Türkçe karakter duyarlı kelime sınırı kontrolü
                                        const regex = new RegExp('(?<=^|[^a-zA-ZçğıöşüÇĞİÖŞÜ])' + escapedKw + '(?=[^a-zA-ZçğıöşüÇĞİÖŞÜ]|$)', 'i');
                                        
                                        if (regex.test(prod.productname)) score += 10; // İsimde geçiyorsa en yüksek puan
                                        if (regex.test(prod.sub_category)) score += 5; // Alt kategoride geçiyorsa
                                        if (regex.test(prod.main_category)) score += 2; // Ana kategoride geçiyorsa
                                        if (regex.test(prod.brand)) score += 1; // Markada geçiyorsa
                                    });

                                    // Takı arayanlara "Takı yapım seti (Hobi)" önermemek için filtre/ceza mekanizması
                                    const isJewelrySearch = keywords.some(k => /kolye|küpe|bileklik|yüzük|takı/i.test(k));
                                    const isSearchingHobby = keywords.some(k => /yapım|set|boncuk|malzeme/i.test(k));
                                    const isHobbyProduct = /yapım|boncuk|malzeme|kutu|adet/i.test(prod.productname) || prod.main_category?.includes('Kırtasiye') || prod.main_category?.includes('Hobi');
                                    
                                    if (isJewelrySearch && !isSearchingHobby && isHobbyProduct && score > 0) {
                                        score -= 50; // Hobi ürünlerini ciddi şekilde cezalandırarak listeye girmesini engelle
                                    }

                                    return { ...prod, score };
                                })
                                .filter(prod => prod.score > 0)
                                .sort((a, b) => {
                                    if (b.score !== a.score) return b.score - a.score; // Önce alaka puanına göre sırala
                                    return (b.reviews || 0) - (a.reviews || 0); // Puanlar eşitse en çok değerlendirilen (popüler) ürünü öne al
                                })
                                .slice(0, 6);
                            }
                        }

                        return (
                            <div key={msg.id} className="space-y-3">
                                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} opacity-100 transition-opacity duration-300`}>
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-sm overflow-hidden p-1">
                                            <img src="/hikai-logo.png" className="w-full h-full object-contain" alt="Hikai Bot" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] p-5 text-sm md:text-base leading-relaxed shadow-sm ${msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-primary to-[#8a3100] text-white rounded-3xl rounded-tr-sm'
                                                : 'bg-white border border-outline-variant/20 text-on-surface rounded-3xl rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.image && (
                                            <div className="mb-3 max-w-xs rounded-xl overflow-hidden shadow-sm border border-white/20">
                                                <img
                                                    src={`data:${msg.image.mimeType};base64,${msg.image.base64Data}`}
                                                    alt="Yüklenen Görsel"
                                                    className="max-h-60 w-auto object-contain rounded-xl"
                                                />
                                            </div>
                                        )}
                                        {msg.isLoading ? (
                                            <div className="flex items-center gap-1.5 py-1.5 px-2">
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-line">
                                                {(() => {
                                                    if (!cleanText) return null;
                                                    // Madde işaretlerini daha şık bir noktaya (•) çeviriyoruz
                                                    const textWithBullets = cleanText.replace(/(^|\n)\*\s/g, '$1• ');
                                                    // **kalın metin** yapılarını tespit edip React nesnelerine bölüyoruz
                                                    const parts = textWithBullets.split(/(\*\*.*?\*\*)/g);
                                                    return parts.map((part, i) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return <span key={i}>{part}</span>;
                                                    });
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Eşleşen İnteraktif Ürün Kartları Karuseli */}
                                {matchedItems.length > 0 && (
                                    <div className="pl-11 pr-4">
                                        <p className="text-[11px] font-bold text-primary mb-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">local_mall</span>
                                            Önerilen Ürünler ({matchedItems.length})
                                        </p>
                                        <div className="flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                            {matchedItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-white/95 border border-outline-variant/30 rounded-2xl p-3 w-40 shrink-0 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="w-full h-24 bg-surface-container-lowest rounded-lg overflow-hidden flex items-center justify-center p-2 relative border border-outline-variant/10">
                                                            <img
                                                                src={item.imgUrl}
                                                                alt={item.productname}
                                                                className="max-w-full max-h-full object-contain"
                                                            />
                                                            {item.stars && (
                                                                <span className="absolute top-1 right-1 bg-surface/85 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] font-bold text-amber-500 shadow-sm">
                                                                    <span className="material-symbols-outlined text-[9px] fill-1">star</span>
                                                                    {item.stars}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[9px] font-bold text-primary/80 tracking-wide uppercase truncate mt-2">{item.brand}</p>
                                                        <h4 className="text-xs font-semibold text-on-surface truncate leading-tight" title={item.productname}>
                                                            {item.productname}
                                                        </h4>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-xs font-extrabold text-primary">
                                                            {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0 }).format(item.price)} TL
                                                        </p>
                                                        <Link
                                                            href={`/detail?id=${item.id}`}
                                                            onClick={onClose}
                                                            className="mt-2 w-full py-1.5 text-center bg-primary hover:bg-[#8a3100] text-white text-[10px] font-bold rounded-xl block transition-all active:scale-95 duration-200"
                                                        >
                                                            İncele
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Mesaj Yazma, Görsel Yükleme ve Gönderme Alanı */}
                <div className="p-6 md:p-8 border-t border-outline-variant/20 bg-surface/80 backdrop-blur-md z-10">

                    {/* Yüklenen Görselin Önizlemesi */}
                    {selectedImage && (
                        <div className="mb-4 relative inline-block">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary shadow-md relative">
                                <img
                                    src={selectedImage.previewUrl}
                                    alt="Önizleme"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 bg-error text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors border border-white"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
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
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-high"
                                title="Fotoğraf ekle"
                            >
                                <span className="material-symbols-outlined">image</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Hikai ile konuşun..."
                            className="w-full pl-16 pr-16 py-5 rounded-full border border-outline-variant/50 bg-white shadow-sm focus:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface font-body-md outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() && !selectedImage}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${(inputValue.trim() || selectedImage)
                                    ? 'bg-primary text-white shadow-md hover:shadow-lg hover:scale-105'
                                    : 'bg-surface-container-highest text-secondary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px] ml-1">send</span>
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-secondary mt-4 font-medium">Hikai yanlışlıklar yapabilir. Lütfen önemli bilgileri doğrulayın.</p>
                </div>
            </div>
        </>
    );
}
