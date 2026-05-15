import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-surface-container full-width bottom-0 mt-auto flat no shadows">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity">HIKARI</Link>
                    <p className="font-body-md text-body-md text-secondary max-w-xs">Modern yaşam tarzı için birinci sınıf temeller seçiyoruz. Nicelikten ziyade nitelik.</p>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2">Müşteri Hizmetleri</h4>
                    <Link className="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Bize Ulaşın</Link>
                    <Link className="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Nakliye Bilgisi</Link>
                    <Link className="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">İadeler</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2">Kurumsal</h4>
                    <Link className="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Gizlilik Politikası</Link>
                    <Link className="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Hizmet Şartları</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-2">Bülten</h4>
                    <p className="font-body-md text-body-md text-secondary mb-2">Yeni koleksiyonlara erken erişim için abone olun.</p>
                    <div className="flex">
                        <input className="w-full px-4 py-2 rounded-l-DEFAULT border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none focus:border-primary" placeholder="E-posta adresiniz" type="email" />
                        <button className="bg-primary text-white px-4 py-2 rounded-r-DEFAULT font-label-md text-label-md hover:bg-primary-container transition-colors">Abone Ol</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-outline-variant/30">
                <div className="px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body-md text-body-md text-secondary">© 2026 HIKARI Premium E-ticaret. Tüm hakları saklıdır.</p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-primary cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-sm">language</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
