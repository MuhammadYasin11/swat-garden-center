import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StartAnimation from "@/components/StartAnimation";
import PageTransition from "@/components/PageTransition";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StartAnimation>
            <Header />
            <main className="flex-grow pt-20 bg-white">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <Footer />
        </StartAnimation>
    );
}
