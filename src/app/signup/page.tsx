"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      // FIX: Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        // If not JSON (likely a 404 or 500 HTML page), throw specific error
        throw new Error("Server returned a non-JSON response. API route might be missing.");
      }

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
        return;
      }

      setSuccess(data.message || "Signup successful! You can now login.");
      setName("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error: any) {
      console.error("Signup request failed:", error);
      setError(error.message || "An unexpected error occurred.");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-200">
      <h1 className="text-3xl font-bold mb-6">Signup Page</h1>

      <form className="p-6 shadow-md w-100 border border-zinc-700 rounded-2xl" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">Username</label>
          <input
            className="w-full p-2 border border-gray-700 rounded"
            type="text"
            id="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            className="w-full p-2 border border-gray-700 rounded"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full p-2 border border-gray-700 rounded"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <button className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 mb-3 hover:cursor-pointer" type="submit">
          Signup
        </button>

        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
}
