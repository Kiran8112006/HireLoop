import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link } from 'lucide-react';

interface TwoColumnBalancedProps {
  resumeData: StructuredResume;
}

export default function TwoColumnBalanced({ resumeData }: TwoColumnBalancedProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="bg-blue-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-2">{personal.full_name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personal.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personal.location}</span>}
          {personal.linkedin && <span className="flex items-center gap-1"><Link className="h-3 w-3" />{personal.linkedin}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Summary */}
          {personal.summary && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">SUMMARY</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">EXPERIENCE</h2>
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="mb-4 last:mb-0">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-blue-700 font-semibold text-sm">{exp.company}</p>
                  <p className="text-xs text-gray-600 mb-1">{exp.start_date} - {exp.end_date || 'Present'}</p>
                  {exp.description && <p className="text-xs text-gray-700 mb-1">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">PROJECTS</h2>
              {projects.map((project, index) => (
                <div key={project.id || index} className="mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                  {project.description && <p className="text-xs text-gray-700">{project.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">EDUCATION</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                  <p className="text-blue-700 font-semibold text-sm">{edu.field}</p>
                  <p className="text-xs text-gray-700">{edu.institution}</p>
                  <p className="text-xs text-gray-600">{edu.graduation_date}</p>
                  {edu.result && <p className="text-xs text-gray-600">Result: {edu.result}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">SKILLS</h2>
              <div className="space-y-3">
                {skills?.technical?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Technical Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills?.tools?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Tools</h3>
                    <p className="text-xs text-gray-700">{skills.tools.join(', ')}</p>
                  </div>
                )}
                {skills?.soft?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Soft Skills</h3>
                    <p className="text-xs text-gray-700">{skills.soft.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">CERTIFICATIONS</h2>
              {certifications.map((cert, index) => (
                <div key={cert.id || index} className="mb-2">
                  <p className="font-bold text-gray-900 text-xs">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {awards?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2 pb-1 border-b-2 border-blue-900">AWARDS</h2>
              <ul className="list-disc list-inside space-y-1">
                {awards.map((award, index) => (
                  <li key={index} className="text-xs text-gray-800">{award}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

