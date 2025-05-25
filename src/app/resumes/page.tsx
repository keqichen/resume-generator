'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { WorkExperience, ResumeData, EducationExperience, SideProject} from '@/lib/types';

export default function ResumesPage() {
  const [formData, setFormData] = useState<ResumeData>({
      name: '',
      location: '',
      phone: '',
      email: '',
      github: '',
      website: '',
      linkedin: '',
      skillsList: [],
      educationExperienceList: [],
      workExperienceList: [],
      sideProjectList:[]
    });

  const isFormValid = formData?.name.trim() && formData?.email.trim();

  const addResume = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataPayload = {
      ...formData,
      skills: formData?.skillsList?.map((s) => s.trim()),
    };

    await supabase.from('user_resumes').insert([
      {
        title: `${formData?.name}'s Resume`,
        data: dataPayload,
      },
    ]);

    setFormData({
      name: '',
      location: '',
      phone: '',
      email: '',
      github: '',
      website: '',
      linkedin: '',
      skillsList: [],
      educationExperienceList: [],
      workExperienceList: [],
    });
  };

  const workExperienceFields: {
    label: string;
    field: keyof WorkExperience;
    type?: string;
  }[] = [
    { label: 'Company Name', field: 'company' },
    { label: 'Job Title', field: 'title' },
    { label: 'City', field: 'city' },
    { label: 'Start Date', field: 'startDate', type: 'date' },
    { label: 'End Date', field: 'endDate', type: 'date' },
  ];

    const sideProjectFields: {
    label: string;
    field: keyof SideProject;
    type?: string;
  }[] = [
    { label: 'Project Name', field: 'projectName' },
    { label: 'Start Date', field: 'startDate', type: 'date' },
    { label: 'End Date', field: 'endDate', type: 'date' },
  ];

    const educationExperienceFields: {
    label: string;
    field: keyof EducationExperience;
    type?: string;
  }[] = [
    { label: 'School Name', field: 'school' },
    { label: 'Degree', field: 'degree' },
    { label: 'City', field: 'city' },
    { label: 'Start Date', field: 'startDate', type: 'date' },
    { label: 'End Date', field: 'endDate', type: 'date' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-2xl font-bold">📄 My Resumes</h1>
        <Link
          href="/"
          className="font-mono px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
        >
          ⬅️ Home
        </Link>
      </div>

      {/* Form Start */}
      <form onSubmit={addResume} className="space-y-6 mb-8">
        {/* 📄 Basic Info */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">👤 Basic Info</h2>
          {([
            { label: 'Full Name', field: 'name' },
            { label: 'Location', field: 'location' },
            { label: 'Phone Number', field: 'phone' },
            { label: 'E-mail', field: 'email' },
          ] as const).map(({ label, field }) => (
            <div key={field} className="space-y-1">
              <label className="block text-gray-700 font-mono">{label}</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded font-mono"
                placeholder={`Enter ${label}`}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* 🔗 Custom Links */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">🔗 Custom Links</h2>
          {([
            { label: 'GitHub Profile', field: 'github', placeholder: 'https://github.com/username' },
            { label: 'Personal Website', field: 'website', placeholder: 'https://yourwebsite.com' },
            { label: 'LinkedIn', field: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
          ] as const).map(({ label, field, placeholder }) => (
            <div key={field} className="space-y-1">
              <label className="block text-gray-700 font-mono">{label}</label>
              <input
                type="url"
                className="w-full p-2 border border-gray-300 rounded font-mono"
                placeholder={placeholder}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* 💼 Work Experience Section */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">💼 Work Experience</h2>

          {formData?.workExperienceList?.map((exp, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-2 relative">
              <button 
                type="button"
                onClick={() => {
                  const newList = [...(formData.workExperienceList || [])];
                  newList.splice(idx, 1);
                  setFormData({ ...formData, workExperienceList: newList });
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
              >
                ✖️
              </button>
              {workExperienceFields.map(({ label, field, type = 'text' }) => (
                <div key={field} className="space-y-1">
                  <label className="block text-gray-700 font-mono">{label}</label>
                  <input
                    type={type}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                    value={exp[field] || ''}
                    onChange={(e) => {
                      const newList = [...(formData.workExperienceList || [])];
                      newList[idx][field] = e.target.value;
                      setFormData({ ...formData, workExperienceList: newList });
                    }}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-gray-700 font-mono">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded font-mono"
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newList = [...(formData.workExperienceList || [])];
                    newList[idx].description = e.target.value;
                    setFormData({ ...formData, workExperienceList: newList });
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newExp = { company: '', title: '', city: '', startDate: '', endDate: '', description: '' };
              const updatedList = [...(formData.workExperienceList || []), newExp];
              setFormData({ ...formData, workExperienceList: updatedList });
            }}
            className="font-mono px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            ➕ Add New Work Experience
          </button>
        </div>

        {/* Side Projects Section */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">💼 Side Projects</h2>

          {formData?.sideProjectList?.map((exp, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-2 relative">
              <button 
                type="button"
                onClick={() => {
                  const newList = [...(formData.sideProjectList || [])];
                  newList.splice(idx, 1);
                  setFormData({ ...formData, sideProjectList: newList });
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
              >
                ✖️
              </button>
              {sideProjectFields.map(({ label, field, type = 'text' }) => (
                <div key={field} className="space-y-1">
                  <label className="block text-gray-700 font-mono">{label}</label>
                  <input
                    type={type}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                    value={exp[field] || ''}
                    onChange={(e) => {
                      const newList = [...(formData.sideProjectList || [])];
                      newList[idx][field] = e.target.value;
                      setFormData({ ...formData, sideProjectList: newList });
                    }}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-gray-700 font-mono">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded font-mono"
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newList = [...(formData.workExperienceList || [])];
                    newList[idx].description = e.target.value;
                    setFormData({ ...formData, workExperienceList: newList });
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newExp = { projectName: '', startDate: '', endDate: '', description: '' };
              const updatedList = [...(formData.sideProjectList || []), newExp];
              setFormData({ ...formData, sideProjectList: updatedList });
            }}
            className="font-mono px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            ➕ Add New Side Projects
          </button>
        </div>

        {/* 💼 Education Experience Section */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">🏫 Education</h2>
          {formData?.educationExperienceList?.map((exp, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50 space-y-2 relative">
              <button 
                type="button"
                onClick={() => {
                  const newList = [...(formData.educationExperienceList || [])];
                  newList.splice(idx, 1);
                  setFormData({ ...formData, educationExperienceList: newList });
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
              >
                ✖️
              </button>
              {educationExperienceFields?.map(({ label, field, type = 'text' }) => (
                <div key={field} className="space-y-1">
                  <label className="block text-gray-700 font-mono">{label}</label>
                  <input
                    type={type}
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                    value={exp[field] || ''}
                    onChange={(e) => {
                      const newList = [...(formData.educationExperienceList || [])];
                      newList[idx][field] = e.target.value;
                      setFormData({ ...formData, educationExperienceList: newList });
                    }}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="block text-gray-700 font-mono">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded font-mono"
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newList = [...(formData.educationExperienceList || [])];
                    newList[idx].description = e.target.value;
                    setFormData({ ...formData, educationExperienceList: newList });
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newExp = { school: '', degree: '', city: '', startDate: '', endDate: '', description: '' };
              const updatedList = [...(formData.educationExperienceList || []), newExp];
              setFormData({ ...formData, educationExperienceList: updatedList });
            }}
            className="font-mono px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            ➕ Add New Education Experience
          </button>
        </div>

        {/* 🛠️ Skills Section */}
        <div className="p-4 border rounded bg-white shadow space-y-4">
          <h2 className="text-xl font-bold font-mono">🛠️ Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData?.skillsList?.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-mono text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData?.skillsList?.filter((_, i) => i !== idx);
                    setFormData({ ...formData, skillsList: updated });
                  }}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ✖️
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded font-mono"
            placeholder="Type a skill and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  const updated = [...(formData.skillsList || []), value];
                  setFormData({ ...formData, skillsList: updated });
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>

        {/* 🎯 Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`font-mono px-4 py-2 rounded ${
              isFormValid
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={async () => {
              // Fetch the latest saved resume for this user (or based on specific filters if needed)
              const { data, error } = await supabase
                .from('user_resumes')
                .select('id')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

              if (error) {
                console.error('Error fetching resume:', error);
                alert(`⚠️ Failed to load preview. Error: ${error.message}`);
                return;
              }

              if (data && data.id) {
                window.open(`/api/preview?id=${data.id}`, '_blank');
              } else {
                alert('⚠️ Please save the resume before previewing.');
              }
            }}
            className="font-mono px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            👀 Preview CV
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              name: '',
              location: '',
              phone: '',
              email: '',
              github: '',
              website: '',
              linkedin: '',
              skillsList: [],
              workExperienceList: [],
            })}
            className="font-mono px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
