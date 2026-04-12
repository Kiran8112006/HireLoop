import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, Link, Globe, MapPin } from 'lucide-react';

interface CreativeSidebarProps {
  resumeData: StructuredResume;
}

export default function CreativeSidebar({ resumeData }: CreativeSidebarProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg flex" style={{ minHeight: '11in' }}>
      {/* Left Sidebar - Teal Theme */}
      <div className="w-2/5 bg-gradient-to-b from-teal-700 to-teal-900 text-white p-6">
        {/* Profile Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-1">{personal.full_name || 'Your Name'}</h1>
        </div>

        {/* Contact Info */}
        <div className="mb-6 space-y-3 text-sm">
          <h2 className="text-lg font-bold border-b border-teal-500 pb-2 mb-3">CONTACT</h2>
          {personal.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-start gap-2">
              <Link className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-words text-xs">{personal.linkedin}</span>
            </div>
          )}
          {personal.portfolio && (
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-words text-xs">{personal.portfolio}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-teal-500 pb-2 mb-3">SKILLS</h2>
            {skills?.technical?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-teal-200 text-sm mb-2">Technical</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, i) => (
                    <span key={i} className="bg-teal-600 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills?.tools?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-teal-200 text-sm mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((tool, i) => (
                    <span key={i} className="bg-teal-600 px-2 py-1 rounded text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills?.soft?.length > 0 && (
              <div>
                <h3 className="font-semibold text-teal-200 text-sm mb-2">Soft Skills</h3>
                <ul className="space-y-1 text-xs">
                  {skills.soft.map((skill, i) => (
                    <li key={i}>• {skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {skills?.languages?.length > 0 && (
          <div>
            <h2 className="text-lg font-bold border-b border-teal-500 pb-2 mb-3">LANGUAGES</h2>
            <ul className="space-y-1 text-sm">
              {skills.languages.map((lang, i) => (
                <li key={i}>• {lang}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-3/5 p-8">
        {/* Summary */}
        {personal.summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-teal-800 mb-3 pb-2 border-b-2 border-teal-600">PROFILE</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-teal-800 mb-3 pb-2 border-b-2 border-teal-600">EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-5 last:mb-0">
                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                <p className="text-teal-700 font-semibold text-sm">{exp.company}</p>
                <p className="text-xs text-gray-600 mb-2">{exp.start_date} - {exp.end_date || 'Present'}</p>
                {exp.description && <p className="text-gray-700 text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-teal-800 mb-3 pb-2 border-b-2 border-teal-600">EDUCATION</h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-4">
                <h3 className="font-bold text-gray-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                <p className="text-teal-700 font-semibold text-sm">{edu.institution}</p>
                <p className="text-xs text-gray-600">{edu.graduation_date}{edu.result && ` • Result: ${edu.result}`}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-teal-800 mb-3 pb-2 border-b-2 border-teal-600">PROJECTS</h2>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-3">
                <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                {project.description && <p className="text-xs text-gray-700">{project.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

