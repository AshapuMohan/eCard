"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Uncommented

export default function Login() {
  const router = useRouter(); // Uncommented
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Uncommented
  const [success, setSuccess] = useState(""); // Uncommented

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      // Check if response is JSON to avoid "Unexpected token <" error
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server error: Received non-JSON response");
      }

      // Not OK response
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Success!
      setSuccess("Login successful! Redirecting...");
      console.log("User:", data.user);
      // Store the Unique ID, not just the name
      localStorage.setItem("eCardUserId", data.user.id);
      
      // Store name just for the share link fallback
      localStorage.setItem("eCardName", data.user.name);
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (err) {
      console.error("Request error:", err);
      setError("Network error: Unable to reach server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-200">
      <h1 className="text-3xl font-bold mb-6">Login Page</h1>

      {/* Added onSubmit here */}
      <form onSubmit={handleSubmit} className="p-6 shadow-md w-100 border border-zinc-700 rounded-2xl">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">Username</label>
          <input
            className="w-full p-2 border border-gray-700 rounded text-white" 
            type="text"
            id="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            className="w-full p-2 border border-gray-700 rounded text-white"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Display Error and Success Messages */}
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 mb-3 cursor-pointer" type="submit">
          Login
        </button>

        <p>
          Don&apos;t have an account?
          <Link href={"/signup"} className="text-blue-500 ml-1">Signup</Link>
        </p>
      </form>
    </div>
  );
}