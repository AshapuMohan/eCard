"use client";
import { Kalam } from 'next/font/google';
import { Tab } from "@headlessui/react";
import { useState, useEffect, useRef } from "react"; // ✅ Added useRef
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react';
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter, FaExternalLinkAlt, FaCopy, FaDownload, FaCheck } from "react-icons/fa"; // ✅ Added Icons
import toast, { Toaster } from 'react-hot-toast';
import { toPng } from 'html-to-image'; // ✅ Import image converter

const handwriting = Kalam({
    subsets: ['latin'],
    weight: ['400'],
});

export default function TabsDashboard() {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null); // ✅ Ref for the card to download
    const [userId, setUserId] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        name: "",
        profession: "",
        photo: "",
        skills: [],
        socials: { mail: "", linkedin: "", github: "", twitter: "", phone: "" },
        resume: "",
        portfolio: "",
        projects: [],
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newSkill, setNewSkill] = useState("");
    const [newProjectUrl, setNewProjectUrl] = useState("");
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [isBack, setIsBack] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false); // ✅ State for copy feedback

    const tabs = ["Personal Info", "Skills", "Social Media", "Resume", "Projects", "Portfolio", "Preview & Save"];

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    // Fetch Data
    useEffect(() => {
        const storedId = localStorage.getItem("eCardUserId");
        if (!storedId) {
            router.push("/login");
            return;
        }
        setUserId(storedId);

        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/profile/get?id=${storedId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        name: data.name || "",
                        profession: data.profession || "",
                        photo: data.photoUrl || "",
                        skills: data.skills || [],
                        socials: data.socials || { mail: "", linkedin: "", github: "", twitter: "", phone: "" },
                        resume: data.resumeUrl || "",
                        portfolio: data.portfolioUrl || "",
                        projects: data.projects || [],
                    });

                    if (data.name) {
                        const safeName = encodeURIComponent(data.name);
                        const baseUrl = window.location.origin;
                        setGeneratedLink(`${baseUrl}/share/${safeName}`);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, [router]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setProfile({ ...profile, photo: objectUrl });
        }
    };

    const saveToDatabase = async () => {
        if (!profile.name) {
            toast.error("Name is required!");
            return;
        }
        setLoading(true);
        const loadingToast = toast.loading("Publishing...");

        try {
            const res = await fetch("/api/profile/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, ...profile }),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.dismiss(loadingToast);
            toast.success("Saved!");

            const safeName = encodeURIComponent(profile.name);
            const baseUrl = window.location.origin;
            setGeneratedLink(`${baseUrl}/share/${safeName}`);

        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error("Save failed.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW: Download Card Function
    const downloadCard = async () => {
        if (cardRef.current === null) return;

        try {
            // Convert the specific DOM element to PNG
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, });

            const link = document.createElement('a');
            link.download = `${profile.name || 'eCard'}-${isBack ? 'Back' : 'Front'}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Card Downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Could not download image.");
        }
    };

    // ✅ NEW: Copy Link Function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (fetching) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto mt-5">
            <Toaster position="top-center" reverseOrder={false} />

            <Tab.Group>
                <Tab.List className="flex space-x-4 border-b border-gray-900 overflow-x-auto">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab}
                            className={({ selected }) =>
                                classNames(
                                    "py-3 px-2 text-sm font-medium focus:outline-none border-b-2 hover:cursor-pointer whitespace-nowrap",
                                    selected ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
                                )
                            }
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels className="mt-6 pb-20">
                    {/* 1. PERSONAL INFO */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start mt-2">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-400">Full Name</label>
                                <input className="w-80 border border-gray-600 rounded-lg p-2 bg-transparent text-white" value={profile.name} onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm text-gray-400">Profession</label>
                                <input className=" w-80 border border-gray-600 rounded-lg p-2 bg-transparent text-white" value={profile.profession} onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))} />
                            </div>
                        </div>
                        <div className="text-start mt-6">
                            <h2 className="text-xl font-bold mb-4">Photo</h2>
                            <label className="flex flex-col items-center justify-center w-[450px] h-40 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-zinc-900">
                                {profile.photo ? (<Image src={profile.photo} alt="Preview" width={80} height={80} className="rounded-full object-cover w-20 h-20" />) : (<p className="text-gray-400">Click to upload photo</p>)}
                                <input accept="image/*" type="file" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        </div>
                    </Tab.Panel>

                    {/* 2. SKILLS */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-4">Skills</h2>
                        <div className="flex gap-2">
                            <input className="w-80 border border-gray-600 rounded-xl p-2 bg-transparent text-white" placeholder="e.g. React" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                            <button onClick={() => { if (newSkill) { setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] })); setNewSkill(""); } }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (<span key={index} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm border border-gray-700">{skill}</span>))}
                        </div>
                    </Tab.Panel>

                    {/* 3. SOCIAL MEDIA */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-2">Social Media</h2>
                        <div className="text-start space-y-2">
                            {[{ label: "Email", key: "mail" }, { label: "Phone", key: "phone" }, { label: "LinkedIn", key: "linkedin" }, { label: "GitHub", key: "github" }, { label: "Twitter", key: "twitter" },].map((social) => (
                                <div key={social.key} className="flex flex-col">
                                    <label className="text-sm text-gray-400 mb-1">{social.label}</label>
                                    <input className="w-full max-w-md border border-gray-600 rounded-lg p-2 bg-transparent text-white" value={profile.socials[social.key as keyof typeof profile.socials] || ""} onChange={(e) => setProfile(prev => ({ ...prev, socials: { ...prev.socials, [social.key]: e.target.value } }))} />
                                </div>
                            ))}
                        </div>
                    </Tab.Panel>

                    {/* 4. RESUME */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-4">Resume Link</h2>
                        <input className="w-full max-w-xl border border-gray-600 rounded-lg p-2 bg-transparent text-white" placeholder="Drive Link..." value={profile.resume} onChange={(e) => setProfile(prev => ({ ...prev, resume: e.target.value }))} />
                    </Tab.Panel>

                    {/* 5. PROJECTS */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-4">Projects</h2>
                        <div className="flex gap-4 mb-4">
                            <input className="border border-gray-600 rounded-lg p-2 bg-transparent text-white" placeholder="Title" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} />
                            <input className="border border-gray-600 rounded-lg p-2 bg-transparent text-white flex-1" placeholder="URL" value={newProjectUrl} onChange={(e) => setNewProjectUrl(e.target.value)} />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => { if (newProjectTitle && newProjectUrl) { setProfile(prev => ({ ...prev, projects: [...prev.projects, { name: newProjectTitle, description: newProjectUrl }] })); setNewProjectTitle(""); setNewProjectUrl(""); } }}>Add</button>
                        </div>
                        <div className="space-y-2">
                            {profile.projects.map((p: any, i) => (<div key={i} className="bg-gray-800 p-2 rounded border border-gray-700">{p.name}</div>))}
                        </div>
                    </Tab.Panel>

                    {/* 6. PORTFOLIO */}
                    <Tab.Panel>
                        <h2 className="text-xl font-bold mb-4">Portfolio Link</h2>
                        <input className="w-full max-w-xl border border-gray-600 rounded-lg p-2 bg-transparent text-white" placeholder="https://..." value={profile.portfolio} onChange={(e) => setProfile(prev => ({ ...prev, portfolio: e.target.value }))} />
                    </Tab.Panel>

                    {/* 7. PREVIEW & SAVE */}
                    <Tab.Panel className="focus:outline-none bg-black">
                        <div className="flex flex-col md:flex-col items-center">

                            {/* Left: Preview Title */}
                            <div className=''>
                                <h2 className="text-xl font-bold text-white mb-3">Live Preview</h2>
                                <p className="text-gray-400 text-sm mb-3">
                                    Click the card to flip between Front and Back.
                                </p>
                            </div>

                            <div className="focus:outline-none bg-black mb-3">
                                <div className="flex justify-center w-full">
                                    <div className="relative group">

                                        {/* ✅ Added REF to this div to capture the image */}
                                        <div
                                            ref={cardRef}
                                            onClick={() => setIsBack(!isBack)}
                                            className="cursor-pointer relative z-10 transition-transform duration-300 hover:scale-[1.02] active:scale-95 bg-black"
                                        >
                                            {isBack ? <BackCard profile={profile} /> : <FrontCard profile={profile} />}
                                        </div>

                                        {/* Arrow Animation */}
                                        <div className={`hidden md:block absolute left-[112%] top-0 h-full w-48 ${handwriting.className}`}>
                                            <div className="relative w-full h-full flex flex-col justify-center">
                                                <svg className="absolute -left-12 -top-10 w-40 h-32 text-gray-400 pointer-events-none" viewBox="0 0 160 100" fill="none">
                                                    <path d="M 140 60 Q 70 -15 0 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                    <path d="M 0 30 L 5 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                    <path d="M 0 30 L 20 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                </svg>
                                                <div className="ml-12 mb-30"><p className="text-2xl text-blue-200 leading-6 -rotate-6">Click to flip the card</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Share & Actions Section */}
                            <div className="w-[250px] md:w-[250px] flex flex-col">
                                <button
                                    onClick={saveToDatabase}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 w-full md:w-auto"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

// ... FrontCard and BackCard Components (Keep them EXACTLY as they are) ...
function FrontCard({ profile }: { profile: any }) {
    const getHref = (type: string, value: string) => {
        if (!value) return "#";
        if (type === "mail" && !value.startsWith("mailto:")) return `mailto:${value}`;
        if (type === "phone" && !value.startsWith("tel:")) return `tel:${value}`;
        return value;
    };
    return (
        <div className="grid h-[250px] w-[450px] text-start bg-black">
            <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md overflow-hidden">
                <Image src={profile.photo || "/profile1.png"} alt="Profile" width={150} height={150} className="rounded-md my-auto object-cover h-[150px] w-[130px] bg-zinc-800" />
                <div className="pl-4 flex-1 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-white mb-1 truncate">{profile.name || "Name"}</h2>
                    <p className="text-sm font-semibold text-blue-400 mb-2 truncate">{profile.profession || "Profession"}</p>
                    <h3 className="text-xs font-semibold text-gray-400 mb-2">Tech Stack:</h3>
                    <div className="flex flex-wrap gap-1 max-h-[80px] overflow-hidden content-start">
                        {profile.skills.slice(0, 8).map((skill: string, idx: number) => (<span key={idx} className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full border border-gray-700">{skill}</span>))}
                    </div>
                    <div className="social-icons flex mt-auto pt-2">
                        <ul className="flex space-x-4">
                            {profile.socials.mail && <li><a href={getHref('mail', profile.socials.mail)} className="text-gray-300 hover:text-white"><FaEnvelope size={18} /></a></li>}
                            {profile.socials.github && <li><a href={profile.socials.github} target="_blank" className="text-gray-300 hover:text-white"><FaGithub size={18} /></a></li>}
                            {profile.socials.linkedin && <li><a href={profile.socials.linkedin} target="_blank" className="text-gray-300 hover:text-white"><FaLinkedin size={18} /></a></li>}
                            {profile.socials.twitter && <li><a href={profile.socials.twitter} target="_blank" className="text-gray-300 hover:text-white"><FaTwitter size={18} /></a></li>}
                            {profile.socials.phone && <li><a href={getHref('phone', profile.socials.phone)} className="text-gray-300 hover:text-white"><FaPhone size={18} /></a></li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BackCard({ profile }: { profile: any }) {
    return (
        <div className="grid h-[250px] w-[450px] text-start bg-black">
            <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md">
                <div className="flex flex-col space-y-4 w-1/2">
                    <div>
                        <p className="font-medium text-gray-300 text-sm mb-2">Resume</p>
                        {profile.resume ? (<a href={profile.resume} target="_blank" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer"> <Image width={20} height={20} src="/file.svg" alt="Resume" /> <span className="text-xs truncate max-w-[120px]">View Resume</span> </a>) : <span className="text-xs text-gray-600">No link</span>}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-gray-300 text-sm mb-2">Projects</p>
                        <div className="flex flex-col space-y-2 max-h-[140px] overflow-y-auto pr-1">
                            {profile.projects.map((proj: any, idx: number) => (<a key={idx} href={proj.description} target="_blank" className="flex items-center space-x-2 hover:bg-zinc-800 p-1 rounded transition"> <Image src="/globe.svg" alt="web" width={14} height={14} /> <span className="text-xs text-blue-300 truncate w-full">{proj.name}</span> </a>))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between w-1/2 pl-4">
                    <div className="flex flex-col items-center mt-2">
                        <p className="text-xs text-gray-400 mb-2">Scan for Portfolio</p>
                        <div className="bg-white p-2 rounded-md">
                            <QRCodeSVG value={profile.portfolio || "https://example.com"} size={125} level={"L"} />
                        </div>
                    </div>
                    <div className="text-center mb-1">
                        <p className="text-sm font-semibold text-white">{profile.name}</p>
                        <p className="text-[10px] text-gray-400">{profile.profession}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}