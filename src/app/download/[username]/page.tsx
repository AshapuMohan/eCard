"use client";
import React, { useRef, useEffect, useState } from "react";
import { Kalam } from 'next/font/google';
import { QRCodeSVG } from 'qrcode.react';
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter, FaDownload } from "react-icons/fa";
import { toPng } from 'html-to-image';
import Link from "next/link";

const handwriting = Kalam({ subsets: ['latin'], weight: ['400'] });

export default function DownloadPage({ params }: { params: Promise<{ username: string }> }) {
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Handle params safely (works for both Promise and Object)
        Promise.resolve(params).then(p => {
            const decoded = decodeURIComponent(p.username);
            setUsername(decoded);
            fetchProfile(decoded);
        });
    }, [params]);

    const fetchProfile = async (name: string) => {
        try {
            const res = await fetch(`/api/profile/get?name=${name}`);
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    name: data.name,
                    profession: data.profession || "Tech Enthusiast",
                    photo: data.photoUrl,
                    resume: data.resumeUrl,
                    portfolio: data.portfolioUrl,
                    skills: data.skills || [],
                    socials: data.socials || {},
                    projects: data.projects || []
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async (ref: React.RefObject<HTMLDivElement>, suffix: string) => {
        if (ref.current === null) return;
        try {
            // Wait a small moment to ensure fonts/images render
            const dataUrl = await toPng(ref.current, { 
                cacheBust: true, 
                backgroundColor: '#000000',
                pixelRatio: 2 // Higher quality download
            });
            const link = document.createElement('a');
            link.download = `${profile.name}-eCard-${suffix}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed", err);
            alert("Could not generate image. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Card...</div>;
    if (!profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">User not found</div>;

    return (
        <div className="min-h-screen bg-black text-zinc-200 flex flex-col items-center py-10">
            <h1 className={`${handwriting.className} text-3xl mb-2 text-blue-400`}>Download Your eCards</h1>
            <p className="text-gray-500 mb-8 text-sm">Click buttons below to download High-Res images</p>

            <div className="flex flex-col md:flex-row gap-10">
                {/* FRONT CARD SECTION */}
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Front Side</h2>
                    <div ref={frontRef} className="rounded-lg overflow-hidden">
                        <FrontCard profile={profile} />
                    </div>
                    <button 
                        onClick={() => downloadImage(frontRef, "Front")}
                        className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        <FaDownload /> Download Front
                    </button>
                </div>

                {/* BACK CARD SECTION */}
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">Back Side</h2>
                    <div ref={backRef} className="rounded-lg overflow-hidden">
                        <BackCard profile={profile} />
                    </div>
                    <button 
                        onClick={() => downloadImage(backRef, "Back")}
                        className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        <FaDownload /> Download Back
                    </button>
                </div>
            </div>
            
            <Link href="/dashboard" className="mt-12 text-gray-500 hover:text-white">
                &larr; Back to Dashboard
            </Link>
        </div>
    );
}

// ---------------------------------------------------------
// CARD COMPONENTS (USING <img> INSTEAD OF <Image/>)
// ---------------------------------------------------------
function FrontCard({ profile }: { profile: any }) {
    const getHref = (type: string, value: string) => { if (!value) return "#"; if (type === "mail" && !value.startsWith("mailto:")) return `mailto:${value}`; if (type === "phone" && !value.startsWith("tel:")) return `tel:${value}`; return value; }; 
    const socials = profile.socials || {}; 
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    
    return ( 
        <div className="grid h-[250px] w-[450px] text-start bg-black"> 
            <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md overflow-hidden"> 
                {/* Standard <img> tag works better with html-to-image */}
                <img 
                    src={profile.photo || "/Mohan.jpg"} 
                    alt="Profile" 
                    crossOrigin="anonymous"
                    className="rounded-md my-auto object-cover h-[150px] w-[130px] bg-zinc-800" 
                /> 
                <div className="pl-4 flex-1 flex flex-col justify-center"> 
                    <h2 className="text-xl font-bold text-white mb-1 truncate">{profile.name || "Name"}</h2> 
                    <p className="text-sm font-semibold text-blue-400 mb-2 truncate">{profile.profession || "Profession"}</p> 
                    <h3 className="text-xs font-semibold text-gray-400 mb-2">Tech Stack:</h3> 
                    <div className="flex flex-wrap gap-1 max-h-[80px] overflow-hidden content-start"> 
                        {skills.slice(0, 8).map((skill: string, idx: number) => ( <span key={idx} className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full border border-gray-700">{skill}</span> ))} 
                    </div> 
                    <div className="social-icons flex mt-auto pt-2"> 
                        <ul className="flex space-x-4"> 
                            {socials.mail && <li><a href={getHref('mail', socials.mail)} className="text-gray-300 hover:text-white"><FaEnvelope size={18} /></a></li>} 
                            {socials.github && <li><a href={socials.github} target="_blank" className="text-gray-300 hover:text-white"><FaGithub size={18} /></a></li>} 
                            {socials.linkedin && <li><a href={socials.linkedin} target="_blank" className="text-gray-300 hover:text-white"><FaLinkedin size={18} /></a></li>} 
                            {socials.twitter && <li><a href={socials.twitter} target="_blank" className="text-gray-300 hover:text-white"><FaTwitter size={18} /></a></li>} 
                            {socials.phone && <li><a href={getHref('phone', socials.phone)} className="text-gray-300 hover:text-white"><FaPhone size={18} /></a></li>} 
                        </ul> 
                    </div> 
                </div> 
            </div> 
        </div> 
    );
}

function BackCard({ profile }: { profile: any }) {
    const projects = Array.isArray(profile.projects) ? profile.projects : []; 
    return ( 
        <div className="grid h-[250px] w-[450px] text-start bg-black"> 
            <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md"> 
                <div className="flex flex-col space-y-4 w-1/2"> 
                    <div> 
                        <p className="font-medium text-gray-300 text-sm mb-2">Resume</p> 
                        {profile.resume ? ( <a href={profile.resume} target="_blank" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer"> <img width={20} height={20} src="/file.svg" alt="Resume" /> <span className="text-xs truncate max-w-[120px]">View Resume</span> </a> ) : <span className="text-xs text-gray-600">No link</span>} 
                    </div> 
                    <div className="overflow-hidden"> 
                        <p className="font-medium text-gray-300 text-sm mb-2">Projects</p> 
                        <div className="flex flex-col space-y-2 max-h-[140px] overflow-y-auto pr-1"> 
                            {projects.map((proj: any, idx: number) => ( <a key={idx} href={proj.description} target="_blank" className="flex items-center space-x-2 hover:bg-zinc-800 p-1 rounded transition"> <img src="/globe.svg" alt="web" width={14} height={14} /> <span className="text-xs text-blue-300 truncate w-full">{proj.name}</span> </a> ))} 
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