'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';
import IOSInstallGuide from './IOSInstallGuide';
import SplashScreen from './SplashScreen';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            <SplashScreen />
            {!isAdmin && <Navbar />}
            <main className={!isAdmin ? 'pt-20 pb-16 md:pb-0' : ''}>{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <BottomNav />}
            <InstallPrompt />
            <IOSInstallGuide />
        </>
    );
}
