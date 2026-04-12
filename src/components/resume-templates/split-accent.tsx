import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react';

interface SplitAccentProps {
  resumeData: StructuredResume;
}

export default function SplitAccent({ resumeData }: SplitAccentProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto flex" style={{ minHeight: '11in' }}>
      {/* Left accent strip */}
      <div className="w-16 bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-600"></div>
      
      {/* Main content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 leading-tight">
            {personal.full_name || 'Your Name'}
          </h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-emerald-600" />
                <span className="truncate">{personal.linkedin}</span>
              </div>
            )}
          </div>
          {personal.portfolio && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Globe className="h-4 w-4 text-emerald-600" />
              <span className="truncate">{personal.portfolio}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
              <h2 className="text-xl font-bold text-gray-900">PROFESSIONAL PROFILE</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
              <h2 className="text-xl font-bold text-gray-900">EXPERIENCE</h2>
            </div>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-5 last:mb-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </span>
                </div>
                <p className="text-emerald-700 font-semibold mb-1">
                  {exp.company}{exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && <p className="text-gray-700 text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-emerald-600 mt-1 font-bold">→</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Education */}
          {education?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-teal-600 to-cyan-600"></div>
                <h2 className="text-lg font-bold text-gray-900">EDUCATION</h2>
              </div>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  {edu.field && <p className="text-sm text-gray-700">{edu.field}</p>}
                  <p className="text-sm text-emerald-700 font-semibold">{edu.institution}</p>
                  <p className="text-xs text-gray-600">{edu.graduation_date}</p>
                  {edu.result && <p className="text-xs text-gray-600">Result: {edu.result}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.tools?.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-teal-600 to-cyan-600"></div>
                <h2 className="text-lg font-bold text-gray-900">SKILLS</h2>
              </div>
              <div className="space-y-3">
                {skills?.technical?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Technical</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.technical.map((skill, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-xs font-medium border border-emerald-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills?.tools?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Tools</h3>
                    <p className="text-xs text-gray-700">{skills.tools.join(' • ')}</p>
                  </div>
                )}
                {skills?.soft?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Soft Skills</h3>
                    <p className="text-xs text-gray-700">{skills.soft.join(' • ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-600 to-emerald-600"></div>
              <h2 className="text-lg font-bold text-gray-900">PROJECTS</h2>
            </div>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-3">
                <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                {project.description && <p className="text-xs text-gray-700">{project.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-600 to-emerald-600"></div>
              <h2 className="text-lg font-bold text-gray-900">CERTIFICATIONS</h2>
            </div>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  <span className="text-gray-600"> • {cert.issuer}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

