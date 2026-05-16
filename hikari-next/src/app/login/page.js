'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Login() {
    const router = useRouter();
    const [tab, setTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [regFirst, setRegFirst] = useState('');
    const [regLast, setRegLast] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
        });

        if (error) {
            setLoginError('Şifre veya e-posta hatalı. (' + error.message + ')');
            return;
        }

        // Fetch user profile from public.profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        const userData = {
            id: data.user.id,
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            email: data.user.email,
            cart: profile?.cart || [],
            favorites: profile?.favorites || []
        };

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        window.dispatchEvent(new Event('storage'));
        router.push('/');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');

        const { data, error } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword,
            options: {
                data: {
                    first_name: regFirst,
                    last_name: regLast,
                }
            }
        });

        if (error) {
            setRegError(error.message);
            return;
        }

        if (data.session) {
            // Auto login if email confirmation is disabled
            const userData = {
                id: data.user.id,
                firstName: regFirst,
                lastName: regLast,
                email: regEmail,
                cart: [],
                favorites: []
            };

            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            window.dispatchEvent(new Event('storage'));
            router.push('/');
        } else {
            // Email confirmation required
            setRegSuccess('Kayıt başarılı! Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın. (Not: Supabase panelinden e-posta doğrulamasını kapatabilirsiniz.)');
            setTab('login');
        }
    };

    return (
        <div className="bg-background text-on-background antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements removed (now in layout.js) */}
            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-secondary hover:text-primary transition-colors z-20 group">
                <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-label-md text-label-md">Ana Sayfaya Dön</span>
            </Link>

            {/* Main Container */}
            <main className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden z-10 flex flex-col md:flex-row min-h-[720px] m-4 relative">
                
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2 relative bg-surface-container-low">
                    <img src="/datas/data/login_hero.png" alt="Hikari Premium" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-10">
                        <h1 className="font-headline-xl text-headline-xl text-white mb-2">HIKARI</h1>
                        <p className="font-body-md text-body-md text-white/90">Premium deneyime adım atın. En yeni koleksiyonlar ve özel fırsatlar sizi bekliyor.</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    
                    <div className="mb-8">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">{tab === 'login' ? 'Hoş Geldiniz' : 'Aileye Katılın'}</h2>
                        <p className="font-body-md text-body-md text-secondary">{tab === 'login' ? 'Lütfen hesabınıza giriş yapın.' : 'HIKARI dünyasına adım atmak için hesap oluşturun.'}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-outline-variant mb-8 w-full">
                        <button onClick={() => setTab('login')} className={`flex-1 pb-3 font-label-md text-label-md transition-colors ${tab === 'login' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>Giriş Yap</button>
                        <button onClick={() => setTab('register')} className={`flex-1 pb-3 font-label-md text-label-md transition-colors ${tab === 'register' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>Kayıt Ol</button>
                    </div>

                    {/* Login Form */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-5 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
                            {loginError && <div className="text-center text-error bg-error-container/50 border border-error-container py-3 px-4 rounded-lg font-label-md text-label-md">{loginError}</div>}
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="login-email">E-posta Adresi</label>
                                <input id="login-email" type="email" placeholder="ornek@mail.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="login-password">Şifre</label>
                                <input id="login-password" type="password" placeholder="••••••••" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" />
                                    <span className="font-body-md text-body-md text-secondary group-hover:text-on-surface transition-colors">Beni Hatırla</span>
                                </label>
                                <a href="#" className="font-label-md text-label-md text-primary hover:underline">Şifremi Unuttum</a>
                            </div>
                            <button type="submit" className="mt-4 bg-primary text-white font-label-md text-label-md py-3 px-8 rounded-lg w-full hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                Giriş Yap
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="flex flex-col gap-5 transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
                            {regError && <div className="text-center text-error bg-error-container/50 border border-error-container py-3 px-4 rounded-lg font-label-md text-label-md">{regError}</div>}
                            {regSuccess && <div className="text-center text-primary bg-primary/10 border border-primary/20 py-3 px-4 rounded-lg font-label-md text-label-md">{regSuccess}</div>}
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="reg-firstname">İsim</label>
                                    <input id="reg-firstname" type="text" placeholder="Adınız" required value={regFirst} onChange={e => setRegFirst(e.target.value)}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="reg-lastname">Soyisim</label>
                                    <input id="reg-lastname" type="text" placeholder="Soyadınız" required value={regLast} onChange={e => setRegLast(e.target.value)}
                                        className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="reg-email">E-posta Adresi</label>
                                <input id="reg-email" type="email" placeholder="ornek@mail.com" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="reg-password">Şifre</label>
                                <input id="reg-password" type="password" placeholder="En az 8 karakter" required minLength="8" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" />
                            </div>
                            <button type="submit" className="mt-4 bg-primary text-white font-label-md text-label-md py-3 px-8 rounded-lg w-full hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-2">
                                Hesap Oluştur
                                <span className="material-symbols-outlined text-sm">person_add</span>
                            </button>
                            <p className="font-body-md text-body-md text-secondary text-center mt-2 text-sm">
                                Kayıt olarak <a href="#" className="text-primary hover:underline">Hizmet Şartları</a> ve <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
                            </p>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
