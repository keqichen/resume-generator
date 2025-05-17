'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    github: '',
    email: '',
    experience: '',
    education: '',
    skills: '',
  });

  const fetchResumes = async () => {
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false });
    setResumes(data || []);
  };

  const addResume = async () => {
    const dataPayload = {
      name: formData.name,
      gender: formData.gender,
      github: formData.github,
      email: formData.email,
      experience: formData.experience,
      education: formData.education,
      skills: formData.skills.split(',').map((s) => s.trim()),
    };

    await supabase.from('resumes').insert([
      {
        title: `${formData.name}'s Resume`,
        data: dataPayload,
      },
    ]);

    setFormData({
      name: '',
      gender: '',
      github: '',
      email: '',
      experience: '',
      education: '',
      skills: '',
    });

    fetchResumes();
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-2xl font-bold">📄 My Resumes</h1>
        <Link
          href="/"
          className="font-mono px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
        >
          ⬅️ Home
        </Link>
      </div>

    {/* Resume Form */}
    <div className="space-y-4 mb-8">
    {['name', 'gender', 'github', 'email', 'experience', 'education', 'skills'].map((field) => (
        <input
        key={field}
        className="w-full p-2 border border-gray-300 rounded font-mono"
        placeholder={`Enter ${field}`}
        value={(formData as any)[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        />
    ))}

    <div className="flex gap-4">
        <button
        onClick={addResume}
        className="font-mono px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
        >
        💾 Save
        </button>
        <button
        onClick={() => generateCV(formData)}
        className="font-mono px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
        🧩 Generate CV
        </button>
    </div>
    </div>

      {/* Resumes List */}
      <div className="space-y-4">
        {resumes.map((resume) => (
          <div key={resume.id} className="p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold">{resume.title}</h2>
            <pre className="font-mono text-gray-700 whitespace-pre-wrap mt-2">
              {JSON.stringify(resume.data, null, 2)}
            </pre>
            <p className="text-sm text-gray-500 mt-2">Updated: {resume.updated_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
