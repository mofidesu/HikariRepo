'use client';
import { useState } from 'react';
import Link from 'next/link';
import { megaMenuData } from '@/data/categories';

export default function MegaMenu() {
    const [activeTab, setActiveTab] = useState(megaMenuData[0].id);

    const activeCategory = megaMenuData.find(c => c.id === activeTab);

    return (
        <div className="relative group/mega h-full flex items-center">
            {/* Kategoriler Tetikleyici Buton */}
            <button className="flex items-center gap-2 text-[13px] font-bold text-on-surface hover:text-primary transition-colors py-4">
                <span className="material-symbols-outlined text-[24px]">menu</span>
                Kategoriler
            </button>

            {/* Açılır Menü Konteyner */}
            <div className="fixed left-1/2 -translate-x-1/2 top-[60px] pt-[20px] hidden group-hover/mega:block w-[850px] lg:w-[1000px] xl:w-[1200px] z-40">
                <div className="flex flex-row-reverse w-full h-[550px] bg-white shadow-2xl rounded-b-xl border border-t-0 border-outline-variant/30 overflow-hidden transition-all">
                    
                    {/* Sağ Menü - Ana Kategoriler (Sağa Alındı) */}
                    <div className="w-[240px] bg-surface-container-lowest border-l border-outline-variant/30 overflow-y-auto no-scrollbar py-2">
                        {megaMenuData.map((category) => (
                            <div 
                                key={category.id}
                                onMouseEnter={() => setActiveTab(category.id)}
                                className={`flex justify-between items-center px-6 py-3 cursor-pointer transition-colors ${
                                    activeTab === category.id 
                                        ? 'bg-surface-container-high border-l-4 border-primary text-primary font-bold' 
                                        : 'text-on-surface hover:bg-surface-container-low hover:text-primary font-medium border-l-4 border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                                    <span className="text-sm">{category.label}</span>
                                </div>
                                <span className="material-symbols-outlined text-[16px] text-secondary">chevron_left</span>
                            </div>
                        ))}
                    </div>

                    {/* Sol Menü - Alt Kategoriler */}
                    <div className="flex-1 bg-white p-8 overflow-y-auto no-scrollbar">
                        {activeCategory && (
                            <div>
                                <h3 className="font-headline-sm font-bold text-on-surface mb-6 border-b border-outline-variant/20 pb-2">{activeCategory.label}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {activeCategory.columns.map((col, idx) => (
                                        <div key={idx} className="space-y-4">
                                            <h4 className="font-bold text-primary text-sm tracking-wide">{col.title}</h4>
                                            <ul className="space-y-2">
                                                {col.links.map((link, linkIdx) => (
                                                    <li key={linkIdx}>
                                                        <Link 
                                                            href={`/collection?category=${encodeURIComponent(link)}`} 
                                                            className="text-sm text-secondary hover:text-primary transition-colors hover:underline underline-offset-2"
                                                        >
                                                            {link}
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li>
                                                    <Link 
                                                        href={`/collection?category=${encodeURIComponent(col.title)}`}
                                                        className="text-xs font-bold text-on-surface hover:text-primary transition-colors flex items-center mt-1"
                                                    >
                                                        Daha Fazla Gör
                                                        <span className="material-symbols-outlined text-[14px]">expand_more</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
