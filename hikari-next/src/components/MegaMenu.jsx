'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MegaMenu() {
    const [categoriesData, setCategoriesData] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (data && !error) {
                // Group flat categories using new schema
                const groups = {};

                data.forEach(c => {
                    const macroName = c.main_category;
                    const subName = c.sub_category;
                    
                    if (!groups[macroName]) {
                        groups[macroName] = [];
                    }
                    if (subName) {
                        groups[macroName].push({ name: subName, slug: c.slug });
                    }
                });

                const formattedData = Object.keys(groups).map((macro, idx) => {
                    // Split subcategories into columns of 5 items
                    const items = groups[macro].sort((a, b) => a.name.localeCompare(b.name));
                    const columns = [];
                    for (let i = 0; i < items.length; i += 5) {
                        columns.push({
                            title: macro,
                            links: items.slice(i, i + 5)
                        });
                    }

                    return {
                        id: `cat-${idx}`,
                        label: macro,
                        icon: 'category', // Default icon for all macros
                        columns: columns
                    };
                });
                
                setCategoriesData(formattedData);
                if (formattedData.length > 0) setActiveTab(formattedData[0].id);
            }
        };
        fetchCategories();
    }, []);

    const activeCategory = categoriesData.find(c => c.id === activeTab);

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
                    <div className="w-[280px] bg-surface-container-lowest border-l border-outline-variant/30 overflow-y-auto no-scrollbar py-2">
                        {categoriesData.map((category) => (
                            <Link 
                                href={`/collection?category=${encodeURIComponent(category.label)}`}
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
                                    <span className="text-sm truncate w-[180px] text-left">{category.label}</span>
                                </div>
                                <span className="material-symbols-outlined text-[16px] text-secondary">chevron_left</span>
                            </Link>
                        ))}
                    </div>

                    {/* Sol Menü - Alt Kategoriler */}
                    <div className="flex-1 bg-white p-8 overflow-y-auto no-scrollbar">
                        {activeCategory && (
                            <div>
                                <Link href={`/collection?category=${encodeURIComponent(activeCategory.label)}`}>
                                    <h3 className="font-headline-sm font-bold text-on-surface mb-6 border-b border-outline-variant/20 pb-2 hover:text-primary transition-colors inline-block w-full">
                                        {activeCategory.label} <span className="text-sm font-normal text-secondary ml-2">(Tümünü Gör)</span>
                                    </h3>
                                </Link>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {activeCategory.columns.map((col, idx) => (
                                        <div key={idx} className="space-y-4">
                                            <ul className="space-y-2">
                                                {col.links.map((link, linkIdx) => (
                                                    <li key={linkIdx}>
                                                        <Link 
                                                            href={`/collection?category=${encodeURIComponent(link.slug)}`} 
                                                            className="text-sm text-secondary hover:text-primary transition-colors hover:underline underline-offset-2 block truncate"
                                                            title={link.name}
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    </li>
                                                ))}
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
