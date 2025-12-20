"use client";

import { Agbalumo, Bitcount_Prop_Single } from "next/font/google";
import Link from "next/link";
import { FaUser, FaRightFromBracket, FaDownload, FaShare, FaIdCard } from "react-icons/fa6";
import TabsDashboard from "./TabsDashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

const bitcount = Bitcount_Prop_Single({
    subsets: ['latin'],
    variable: '--font-bitcount-prop-single',
    weight: ['400'], 
});

const agbalumo = Agbalumo({ subsets: ['latin'], weight: '400' });

export default function Dashboard() {
    return (
        <div className="bg-black w-full text-gray-200 flex flex-col px-4 min-h-screen text-center">
            <Toaster position="top-center" />

            {/* --- NAVBAR --- */}
            <Navbar />

            {/* --- MAIN CONTENT --- */}
            <div className="mt-4">
                <h1 className={`${agbalumo.className} text-5xl mb-2 text-white`}>Dashboard</h1>
                <p className="text-gray-400">Manage your details, skills, and projects to generate your digital card.</p>
            </div>

            <main className="grow w-full mt-5">
                {/* The TabsDashboard handles the actual form and saving */}
                <TabsDashboard />
            </main>

            <div className="text-center text-sm mb-4 text-zinc-600">
                © 2025 Ashapu Mohan. All rights reserved.
            </div>
        </div>
    );
}

export function Navbar() {
    const router = useRouter();
    const [generatedLink, setGeneratedLink] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. Fetch User Data to Generate Navbar Links
    useEffect(() => {
        const storedId = localStorage.getItem("eCardUserId");

        if (!storedId) {
            router.push("/login");
            return;
        }

        const fetchNavbarData = async () => {
            try {
                const res = await fetch(`/api/profile/get?id=${storedId}`);
                if (res.ok) {
                    const data = await res.json();

                    if (data.name) {
                        const safeName = encodeURIComponent(data.name);
                        // ✅ FIX: Store the full paths for consistency
                        setGeneratedLink(`/share/${safeName}`);
                        setDownloadLink(`/download/${safeName}`); 
                    }
                }
            } catch (error) {
                console.error("Navbar load error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNavbarData();
    }, [router]);

    // 2. Logout Handler
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("eCardUserId");
        localStorage.removeItem("eCardName");
        toast.success("Logged out");
        router.push("/login");
    };

    return (
        <nav className="w-full flex justify-center border-b border-zinc-800 ">
            <div className="flex w-full max-w-6xl justify-between items-center px-4 md:px-12 py-2">
                {/* Logo */}
                <div className={`${bitcount.className} text-2xl flex items-center font-bold`}>
                    <FaIdCard className="mr-2 h-8 w-8" /> eCard
                </div>

                {/* Nav Links */}
                <div className="flex space-x-6 items-center">
                    {/* Profile (Reloads dashboard) */}
                    <Link href="/dashboard" className="hover:text-white text-gray-400 transition" title="Profile">
                        <FaUser size={20} />
                    </Link>

                    {/* Share Link (Only if loaded) */}
                    {generatedLink ? (
                        <Link href={generatedLink} target="_blank" className="hover:text-blue-400 text-gray-400 transition" title="View Public Page">
                            <FaShare size={20} />
                        </Link>
                    ) : (
                        <span className="text-zinc-700 cursor-not-allowed"><FaShare size={20} /></span>
                    )}

                    {/* Download Link (Only if loaded) */}
                    {downloadLink ? (
                        <Link
                            href={`${downloadLink}`} // ✅ FIX: Use the state directly, no extra slashes
                            className="hover:text-cyan-800 text-gray-400 transition" // ✅ FIX: Color changed for visibility
                            title="Download eCard"
                        >
                            <FaDownload size={20} />
                        </Link>
                    ) : (
                        <span className="text-zinc-700 cursor-not-allowed"><FaDownload size={20} /></span>
                    )}

                    {/* Logout */}
                    <button onClick={handleLogout} className="hover:text-red-500 text-gray-400 transition" title="Logout">
                        <FaRightFromBracket size={20} />
                    </button>
                </div>
            </div>
        </nav>
    )
}