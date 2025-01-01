import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                <main className="min-h-screen bg-gray-50 py-12 px-4">
                    {children}
                </main>
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Calculateur de Pain",
    description: "Calculateur pour la fabrication du pain au levain",
    keywords: ["pain", "levain", "boulangerie", "calculateur", "recette"],
    openGraph: {
        title: "Calculateur de Pain",
        description: "Calculateur pour la fabrication du pain au levain",
        type: "website",
    },
};
