'use client';
import { useState } from 'react';

export default function ChatbotSidebar({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba! Ben HIKARI AI. Sana özel stil önerileri sunmak, hediye seçmek veya koleksiyonlarımız hakkında bilgi vermek için buradayım.", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        setMessages([...messages, { id: Date.now(), text: inputValue, sender: "user" }]);
        setInputValue("");
        
        // Simüle edilmiş bot yanıtı
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: "Harika bir fikir! Sana uygun en trend parçaları hemen derliyorum.", sender: "bot" }]);
        }, 1200);
    };

    const handleSuggestionClick = (text) => {
        setInputValue(text);
        // İsteğe bağlı olarak direkt gönderebiliriz:
        // setMessages([...messages, { id: Date.now(), text: text, sender: "user" }]);
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
                className={`fixed top-0 left-0 h-full w-[95vw] sm:w-[500px] md:w-[600px] lg:w-[700px] bg-surface z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Dekoratif Arka Plan Efektleri */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="relative flex items-center justify-between p-8 border-b border-outline-variant/20 bg-surface/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-headline-md font-extrabold text-on-surface tracking-tight">HIKARI <span className="text-primary">AI</span></h2>
                            <p className="text-sm text-secondary font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                Stil Asistanınız Çevrimiçi
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

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} opacity-100 transition-opacity duration-300`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-sm">
                                    <span className="material-symbols-outlined text-on-primary-container text-[16px]">auto_awesome</span>
                                </div>
                            )}
                            <div 
                                className={`max-w-[85%] p-5 text-sm md:text-base leading-relaxed shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-gradient-to-br from-primary to-[#8a3100] text-white rounded-3xl rounded-tr-sm' 
                                        : 'bg-white border border-outline-variant/20 text-on-surface rounded-3xl rounded-tl-sm'
                                }`}
                            >
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 md:p-8 border-t border-outline-variant/20 bg-surface/80 backdrop-blur-md z-10">
                    <form onSubmit={handleSend} className="relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <button type="button" className="p-2 text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-high" title="Dosya veya fotoğraf ekle">
                                <span className="material-symbols-outlined">attach_file</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Hikari AI ile konuşun..."
                            className="w-full pl-16 pr-16 py-5 rounded-full border border-outline-variant/50 bg-white shadow-sm focus:shadow-md focus:border-primary focus:ring-4 focus:ring-primary/10 text-on-surface font-body-md outline-none transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim()}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                                inputValue.trim() 
                                    ? 'bg-primary text-white shadow-md hover:shadow-lg hover:scale-105' 
                                    : 'bg-surface-container-highest text-secondary'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px] ml-1">send</span>
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-secondary mt-4 font-medium">HIKARI AI yanlışlıklar yapabilir. Lütfen önemli bilgileri doğrulayın.</p>
                </div>
            </div>
        </>
    );
}
