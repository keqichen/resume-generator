import { NextResponse } from 'next/server';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { supabase } from '@/lib/supabaseClient';
import { EducationExperience, ResumeData, SideProject, WorkExperience } from '@/lib/types';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { data: resume } = await supabase
    .from('user_resumes')
    .select('data')
    .eq('id', id)
    .single();

  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const content = generateLatexTemplate(resume.data);
  const texFile = path.resolve('/tmp/resume.tex');
  const pdfFile = path.resolve('/tmp/resume.pdf');

  writeFileSync(texFile, content);

  try {
    await execAsync(`pdflatex -output-directory=/tmp ${texFile}`);
    const pdfBuffer = readFileSync(pdfFile);

    // Cleanup temporary files
    unlinkSync(texFile);
    unlinkSync(pdfFile);

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function generateLatexTemplate(data: ResumeData): string {
  return `
\\documentclass{article}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{${data.name}}} \\\\
    \\vspace{0.2cm}
    ${data.location} | ${data.phone} | ${data.email} \\\\
\\end{center}

\\section*{Work Experience}
${data.workExperienceList?.map((exp: WorkExperience) => `
\\textbf{${exp.title}} at ${exp.company} \\\\
${exp.city} | ${exp.startDate} -- ${exp.endDate} \\\\
${exp.description} \\\\
\\vspace{0.5cm}
`).join('')}

\\section*{Projects}
${data.sideProjectList?.map((exp: SideProject) => `
\\textbf{${exp.projectName}} \\\\
${exp.startDate} -- ${exp.endDate} \\\\
${exp.description} \\\\
\\vspace{0.5cm}
`).join('')}

\\section*{Education}
${data.educationExperienceList?.map((exp: EducationExperience) => `
\\textbf{${exp.degree}} at ${exp.school} \\\\
${exp.city} | ${exp.startDate} -- ${exp.endDate} \\\\
${exp.description} \\\\
\\vspace{0.5cm}
`).join('')}

\\section*{Techinical Skills}
${data.skillsList?.join(', ')}

\\end{document}
  `;
}
