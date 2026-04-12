import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react';

interface MinimalistProfessionalProps {
  resumeData: StructuredResume;
}

export default function MinimalistProfessional({ resumeData }: MinimalistProfessionalProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      <div className="p-12">
        {/* Minimalist Header */}
        <div className="mb-8 border-b border-gray-300 pb-6">
          <h1 className="text-5xl font-light mb-3 tracking-tight">{personal.full_name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personal.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personal.phone}</span>}
            {personal.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personal.location}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Link className="h-3 w-3" />{personal.linkedin}</span>}
            {personal.portfolio && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{personal.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Experience</h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-semibold">{exp.position}</h3>
                  <span className="text-sm text-gray-600">{exp.start_date} - {exp.end_date || 'Present'}</span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                {exp.description && <p className="text-gray-700 text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-none space-y-1 text-sm text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="pl-4 border-l-2 border-gray-300">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Education</h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <span className="text-sm text-gray-600">{edu.graduation_date}</span>
                </div>
                <p className="text-gray-600">{edu.institution}{edu.location && ` • ${edu.location}`}</p>
                {edu.result && <p className="text-sm text-gray-600">Result: {edu.result}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Skills</h2>
            <div className="space-y-2">
              {skills?.technical?.length > 0 && (
                <p className="text-sm"><span className="font-semibold text-gray-700">Technical:</span> {skills.technical.join(', ')}</p>
              )}
              {skills?.tools?.length > 0 && (
                <p className="text-sm"><span className="font-semibold text-gray-700">Tools:</span> {skills.tools.join(', ')}</p>
              )}
              {skills?.soft?.length > 0 && (
                <p className="text-sm"><span className="font-semibold text-gray-700">Soft Skills:</span> {skills.soft.join(', ')}</p>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Projects</h2>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-4 last:mb-0">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

