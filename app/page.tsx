import Header from "@/components/header";
import Footer from "@/components/footer";
import BreadCalculator from "@/components/bread-calculator";

export default function Home() {
    return (
        <>
            <Header />
            <div className="container mx-auto">
                <BreadCalculator />
            </div>
            <Footer />
        </>
    );
}

