import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: "Kategoriler | HIKARI",
};

export default function Categories() {
    return (
        <>
            <Header type="categories" />
            <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm text-secondary mb-4">
                    <Link className="hover:text-primary transition-colors" href="/">Anasayfa</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-on-surface font-medium">Kategoriler</span>
                </nav>

                <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">Kategoriler</h1>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Link href="/collection?category=Giyim"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_giyim_1778674755862.png" alt="Giyim"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Giyim</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Çantalar"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_cantalar_1778674775335.png" alt="Çantalar"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Çantalar</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Ayakkabılar"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_ayakkabilar_1778674795031.png" alt="Ayakkabılar"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Ayakkabılar</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Aksesuarlar"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_aksesuarlar_1778674819068.png" alt="Aksesuarlar"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Aksesuarlar</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Kozmetik"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_kozmetik_1778674831843.png" alt="Kozmetik"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Kozmetik</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Parfümler"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_parfumler_1778674859503.png" alt="Parfümler"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Parfümler</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Ev Yaşam"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_ev_yasam_1778674880405.png" alt="Ev &amp; Yaşam"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Ev &amp; Yaşam</span>
                        </div>
                    </Link>

                    <Link href="/collection?category=Takılar"
                        className="group flex flex-col border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-surface-container-lowest">
                        <div className="aspect-[4/5] w-full relative overflow-hidden bg-surface-container-low">
                            <img src="/images/cat_takilar_1778674899310.png" alt="Takılar"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="border-t border-outline-variant p-4 flex items-center justify-center bg-surface-container-lowest">
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center uppercase tracking-wider">Takılar</span>
                        </div>
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}
