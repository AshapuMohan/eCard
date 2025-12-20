"use client";
import { useState, useEffect } from "react";
import { FaCopy, FaCheck, FaShareAlt } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import Link from "next/link";


export default function CopyLinkComponent({ username }: { username: string }) {
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState("");

    useEffect(() => {
        setLink(window.location.href);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };
    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${username}'s Profile`,
                    url: link,
                });
            } catch (err) {
                console.log("Share canceled");
            }
        } else {
            copyToClipboard();
            toast("Web Share not supported, link copied instead");
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl w-full max-w-[400px]">
            <Toaster position="top-center" />
            <div className="flex items-center justify-between">
                <p className="text-zinc-400 text-sm">Shareable Link:</p>
                <button
                    onClick={shareLink}
                    className="flex items-center gap-1 text-zinc-300 hover:text-white hover:cursor-pointer"
                >
                    <FaShareAlt />
                    Share
                </button>
            </div>
            <div className="mt-2 flex gap-2">
                <input readOnly value={link} className="bg-black border border-zinc-700 text-blue-400 text-xs p-2 rounded flex-1 outline-none" />
                <button onClick={copyToClipboard} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded border border-zinc-600 transition" title="Copy Link">
                    {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
            </div>
        </div>
    );
}