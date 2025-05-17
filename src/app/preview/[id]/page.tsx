// app/preview/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { WorkExperience, ResumeRecord } from '@/lib/types';

export default function PreviewPage() {
  const params = useParams();
  const { id } = params;
  const [resume, setResume] = useState<ResumeRecord>();

  useEffect(() => {
    const fetchResume = async () => {
      const { data } = await supabase.from('user_resumes').select('*').eq('id', id).single();
      setResume(data);
    };
    fetchResume();
  }, [id]);

  if (!resume) return <p className="p-6 font-mono">Loading...</p>;

  const { name, location, phone, email, skillsList, workExperienceList } = resume.data;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold font-mono">{name}</h1>

      <section>
        <h2 className="text-xl font-bold font-mono">👤 Basic Info</h2>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Email:</strong> {email}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold font-mono">🛠️ Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skillsList?.map((skill: string, idx: number) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-mono text-sm">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold font-mono">💼 Experience</h2>
        {workExperienceList?.map((exp: WorkExperience, idx: number) => (
          <div key={idx} className="border p-4 rounded bg-gray-50 mb-4">
            <h3 className="font-semibold">{exp.title} @ {exp.company}</h3>
            <p className="text-sm text-gray-600">{exp.city} | {exp.startDate} - {exp.endDate}</p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
