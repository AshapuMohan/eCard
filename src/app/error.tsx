"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-200">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-6">{error.message}</p>
      <button
        className="bg-blue-500 p-2 rounded hover:bg-blue-600 mb-3 hover:cursor-pointer"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
