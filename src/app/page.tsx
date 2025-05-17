'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="font-mono text-4xl font-bold mb-4 text-gray-800 text-center">
        🚀 AutoResume Generator
      </h1>
      <p className="font-mono text-gray-600 mb-8 text-center max-w-md">
        Record your daily work logs and effortlessly generate professional resume content with AI assistance.
      </p>

      <div className="flex gap-4">
        <Link
          href="/logs"
          className="font-mono px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📒 Manage Logs
        </Link>
        <Link
          href="/resumes"
          className="font-mono px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          📄 View Resumes
        </Link>
      </div>

      <footer className="font-mono mt-12 text-gray-400 text-sm">
        Built with ❤️ using Next.js, Supabase, and OpenAI.
      </footer>
    </main>
  );
}
