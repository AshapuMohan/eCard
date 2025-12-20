import { PrismaClient } from "@prisma/client";
import { Kalam } from 'next/font/google';
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react';
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter, FaCopy, FaCheck, FaDownload } from "react-icons/fa";
import CopyLinkComponent from "./CopyLinkComponent"; // We'll create this small client component below
import Link from "next/link";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const handwriting = Kalam({ subsets: ['latin'], weight: ['400'] });

// ... (Keep FrontCard and BackCard functions exactly as they were previously) ...
// For brevity, I am not repeating the full Card code here, but assume FrontCard and BackCard are defined here.
function FrontCard({ profile }: { profile: any }) {
    // ... same code as before ...
    const getHref = (type: string, value: string) => { if (!value) return "#"; if (type === "mail" && !value.startsWith("mailto:")) return `mailto:${value}`; if (type === "phone" && !value.startsWith("tel:")) return `tel:${value}`; return value; }; const socials = profile.socials || {}; const skills = Array.isArray(profile.skills) ? profile.skills : [];
    return (
    <div className="grid h-[250px] w-[450px] text-start bg-black"> 
        <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md overflow-hidden"> 
            <Image src={profile.photoUrl || "/profile1.png"} alt="Profile" width={150} height={150} className="rounded-md my-auto object-cover h-[150px] w-[130px] bg-zinc-800" /> 
            <div className="pl-4 flex-1 flex flex-col justify-center"> 
                <h2 className="text-xl font-bold text-white mb-1 truncate">{profile.name}</h2> 
                <p className="text-sm font-semibold text-blue-400 mb-2 truncate">{profile.profession}</p> 
                <h3 className="text-xs font-semibold text-gray-400 mb-2">Tech Stack:</h3> 
                <div className="flex flex-wrap gap-1 max-h-[80px] overflow-hidden content-start"> 
                    {skills.slice(0, 8).map((skill: string, idx: number) => (
                        <span key={idx} className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full border border-gray-700">{skill}</span>))}
                </div> 
                <div className="social-icons flex mt-auto pt-2"> 
                    <ul className="flex space-x-4"> 
                        {socials.mail && 
                        <li>
                            <a href={getHref('mail', socials.mail)} className="text-gray-300 hover:text-white"><FaEnvelope size={18} /></a>
                        </li>} 
                        {socials.github && 
                        <li>
                            <a href={socials.github} target="_blank" className="text-gray-300 hover:text-white"><FaGithub size={18} /></a>
                        </li>} 
                        {socials.linkedin && 
                        <li>
                            <a href={socials.linkedin} target="_blank" className="text-gray-300 hover:text-white"><FaLinkedin size={18} /></a>
                        </li>} 
                        {socials.twitter && 
                        <li>
                            <a href={socials.twitter} target="_blank" className="text-gray-300 hover:text-white"><FaTwitter size={18} /></a>
                        </li>} 
                        {socials.phone && 
                        <li>
                            <a href={getHref('phone', socials.phone)} className="text-gray-300 hover:text-white"><FaPhone size={18} /></a>
                        </li>} 
                    </ul> 
                </div> 
            </div> 
        </div>
    </div>);
}

function BackCard({ profile }: { profile: any }) {
    // ... same code as before ...
    const projects = Array.isArray(profile.projects) ? profile.projects : []; return (
    <div className="grid h-[250px] w-[450px] text-start bg-black"> 
        <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md"> 
            <div className="flex flex-col space-y-4 w-1/2"> 
                <div> 
                    <p className="font-medium text-gray-300 text-sm mb-2">Resume</p> 
                    {profile.resumeUrl ? (
                        <a href={profile.resumeUrl} target="_blank" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer"> 
                            <Image width={20} height={20} src="/file.svg" alt="Resume" /> 
                            <span className="text-xs truncate max-w-[120px]">View Resume</span> 
                        </a>) : 
                        <span className="text-xs text-gray-600">No link</span>} 
                </div> 
                <div className="overflow-hidden"> 
                    <p className="font-medium text-gray-300 text-sm mb-2">Projects</p> 
                    <div className="flex flex-col space-y-2 max-h-[140px] overflow-y-auto pr-1"> 
                        {projects.map((proj: any, idx: number) => (
                            <a key={idx} href={proj.description} target="_blank" className="flex items-center space-x-2 hover:bg-zinc-800 p-1 rounded transition"> 
                                <Image src="/globe.svg" alt="web" width={14} height={14} /> 
                                <span className="text-xs text-blue-300 truncate w-full">{proj.name}</span> 
                            </a>))} 
                    </div> 
                </div> 
            </div> 
            <div className="flex flex-col items-center justify-between w-1/2 pl-4"> 
            <div className="flex flex-col items-center mt-2"> 
                <p className="text-xs text-gray-400 mb-2">Scan for Portfolio</p> 
                <div className="bg-white p-2 rounded-md"> 
                    <QRCodeSVG value={profile.portfolioUrl || "https://example.com"} size={125} level={"L"} /> 
                </div> 
            </div> 
            <div className="text-center mb-1"> 
                <p className="text-sm font-semibold text-white">{profile.name}</p> 
                <p className="text-[10px] text-gray-400">{profile.profession}</p> 
            </div> 
        </div> 
    </div>
</div>);
}

export default async function SharePage({ params }: { params: Promise<{ username: string }> }) {
    const resolvedParams = await params;
    const decodedName = decodeURIComponent(resolvedParams.username);
    

    const user = await prisma.user.findUnique({ where: { name: decodedName } });

    if (!user) return <div className="min-h-screen flex items-center justify-center text-white">User not found</div>;

    const profile = {
        name: user.name,
        profession: user.profession || "Tech Enthusiast",
        photoUrl: user.photoUrl,
        resumeUrl: user.resumeUrl,
        portfolioUrl: user.portfolioUrl,
        skills: user.skills,
        socials: user.socials,
        projects: user.projects
    };

    return (
        <div className="min-h-screen bg-black text-zinc-200 flex flex-col items-center justify-center p-4">
            <h1 className={`${handwriting.className} text-4xl mb-4 text-blue-400`}>{profile.name}'s eCard</h1>

            {/* 3D Card Container */}
            <div className="relative group perspective-1000 mb-8">
                <div className="relative preserve-3d group-hover:rotate-y-180 duration-900 w-[450px] h-[280px] cursor-pointer">
                    <div className="absolute backface-hidden w-full h-full"><FrontCard profile={profile} /></div>
                    <div className="absolute backface-hidden rotate-y-180 w-full h-full"><BackCard profile={profile} /></div>
                </div>
            </div>
            {/* <div
                ref={cardRef}
                onClick={() => setIsBack(!isBack)}
                className="cursor-pointer relative z-10 transition-transform duration-300 hover:scale-[1.02] active:scale-95 bg-black"
            >
                {isBack ? <BackCard profile={profile} /> : <FrontCard profile={profile} />}
            </div> */}

            {/* Client Component for Copy Logic */}
            <CopyLinkComponent username={decodedName} />


            <p className="mt-8 text-gray-500 text-sm animate-pulse mb-5">Hover card to flip</p>
            <Link href="/dashboard" className="mt-12 text-gray-500 hover:text-white">
                &larr; Back to Dashboard
            </Link>
        </div>
    );
}