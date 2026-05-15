'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            router.push('/login');
            return;
        }

        const data = JSON.parse(sessionStorage.getItem('userData')) || {};
        setUserData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || ''
        });
        setIsLoaded(true);
    }, [router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [id.replace('prof-', '')]: value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const storedUserData = JSON.parse(sessionStorage.getItem('userData')) || {};
        const originalEmail = storedUserData.email;

        const updatedData = { ...storedUserData, ...userData };
        sessionStorage.setItem('userData', JSON.stringify(updatedData));

        const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
        const userIndex = usersList.findIndex(u => u.email === originalEmail);
        if (userIndex !== -1) {
            usersList[userIndex] = { ...usersList[userIndex], ...userData };
            localStorage.setItem('usersList', JSON.stringify(usersList));
        }

        alert('Profil bilgileriniz güncellendi.');
        window.dispatchEvent(new Event('storage'));
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        router.push('/');
    };

    if (!isLoaded) return <div className="min-h-screen"></div>;

    const fullName = `${userData.firstName} ${userData.lastName}`.trim() || 'Kullanıcı';
    const initial = userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 'H';

    return (
        <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
            <Header type="profile" />

            <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                    <div className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center mb-4">
                        <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center text-on-primary-fixed text-2xl font-bold mb-3 shadow-inner">
                            {initial}
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface text-center line-clamp-1">{fullName}</h3>
                        <p className="font-body-md text-body-md text-secondary text-center text-sm">{userData.email}</p>
                    </div>

                    <nav className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 p-3 rounded-lg bg-primary-container/10 text-primary font-label-md text-label-md transition-colors w-full text-left">
                            <span className="material-symbols-outlined">person</span>
                            Kişisel Bilgiler
                        </button>
                        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-md text-label-md transition-colors w-full text-left">
                            <span className="material-symbols-outlined">inventory_2</span>
                            Siparişlerim
                        </button>
                        <button onClick={() => router.push('/cart')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-md text-label-md transition-colors w-full text-left">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Sepetim
                        </button>
                        <button onClick={() => router.push('/favorites')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-md text-label-md transition-colors w-full text-left">
                            <span className="material-symbols-outlined">favorite</span>
                            Favorilerim
                        </button>
                        <div className="h-px bg-outline-variant/50 my-2"></div>
                        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-error-container text-error font-label-md text-label-md transition-colors w-full text-left">
                            <span className="material-symbols-outlined">logout</span>
                            Çıkış Yap
                        </button>
                    </nav>
                </aside>

                {/* Profile Forms */}
                <div className="flex-grow flex flex-col gap-8">
                    {/* Personal Info Card */}
                    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">manage_accounts</span>
                            Kişisel Bilgiler
                        </h2>
                        
                        <form onSubmit={handleSave} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-secondary" htmlFor="prof-firstName">İsim</label>
                                    <input id="prof-firstName" type="text" value={userData.firstName} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-secondary" htmlFor="prof-lastName">Soyisim</label>
                                    <input id="prof-lastName" type="text" value={userData.lastName} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-secondary" htmlFor="prof-email">E-posta Adresi</label>
                                    <input id="prof-email" type="email" value={userData.email} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-secondary" htmlFor="prof-phone">Telefon Numarası</label>
                                    <input id="prof-phone" type="tel" placeholder="+90 (555) 000 00 00" value={userData.phone} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-2">
                                <button type="submit" className="bg-primary text-white font-label-md text-label-md py-2.5 px-6 rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                                    Değişiklikleri Kaydet
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Saved Cards Card */}
                    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">credit_card</span>
                                Kayıtlı Kartlarım
                            </h2>
                            <button className="text-primary hover:text-primary-container flex items-center gap-1 font-label-md text-label-md transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span> Yeni Kart Ekle
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative bg-gradient-to-br from-tertiary to-on-tertiary-fixed-variant rounded-xl p-5 shadow-md overflow-hidden text-white group cursor-pointer">
                                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 rotate-12 transform pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <span className="material-symbols-outlined text-3xl opacity-80">contactless</span>
                                    <span className="font-label-md text-label-md font-bold tracking-wider opacity-90">VISA</span>
                                </div>
                                <div className="font-body-lg text-body-lg tracking-[0.2em] mb-4 relative z-10">
                                    **** **** **** 4242
                                </div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div>
                                        <div className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Kart Sahibi</div>
                                        <div className="font-label-md text-label-md uppercase">{fullName}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] opacity-70 uppercase tracking-widest mb-1">SKT</div>
                                        <div className="font-label-md text-label-md">12/28</div>
                                    </div>
                                </div>
                                <button className="absolute top-4 right-4 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-5 flex flex-col items-center justify-center text-secondary hover:text-primary hover:border-primary hover:bg-primary-container/5 transition-all cursor-pointer min-h-[160px]">
                                <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                                <span className="font-label-md text-label-md">Yeni Kart Ekle</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
