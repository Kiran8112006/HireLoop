import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react';

interface CleanContemporaryProps {
  resumeData: StructuredResume;
}

export default function CleanContemporary({ resumeData }: CleanContemporaryProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      {/* Clean Header with Accent Bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
        <div className="pl-10 pr-8 py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">{personal.full_name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            {personal.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-cyan-600" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-cyan-600" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-cyan-600" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-1.5">
                <Link className="h-4 w-4 text-cyan-600" />
                <span className="truncate max-w-xs">{personal.linkedin}</span>
              </div>
            )}
            {personal.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-cyan-600" />
                <span className="truncate max-w-xs">{personal.portfolio}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-10 pb-8">
        {/* Professional Summary */}
        {personal.summary && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>Professional Experience</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600 to-transparent"></div>
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-6 last:mb-0 pl-4 border-l-2 border-cyan-200">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-cyan-700 font-semibold">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                    {exp.start_date} - {exp.end_date || 'Present'}
                  </span>
                </div>
                {exp.description && <p className="text-gray-700 text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-cyan-600 mt-1.5 text-xs">▪</span>
                        <span>{achievement}</span>
                      </li>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>Education</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600 to-transparent"></div>
            </h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-4 pl-4 border-l-2 border-cyan-200">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                    <p className="text-cyan-700 font-semibold">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{edu.graduation_date}</span>
                </div>
                {edu.result && <p className="text-sm text-gray-600 mt-1">Result: {edu.result}</p>}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">{edu.honors.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0 || skills?.tools?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>Skills</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600 to-transparent"></div>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {skills?.technical?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-cyan-700 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, i) => (
                      <span key={i} className="bg-cyan-50 text-cyan-800 px-3 py-1 rounded-md text-sm border border-cyan-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills?.tools?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-cyan-700 mb-2">Tools & Technologies</h3>
                  <p className="text-gray-700 text-sm">{skills.tools.join(' • ')}</p>
                </div>
              )}
              {skills?.soft?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-cyan-700 mb-2">Soft Skills</h3>
                  <p className="text-gray-700 text-sm">{skills.soft.join(' • ')}</p>
                </div>
              )}
              {skills?.languages?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-cyan-700 mb-2">Languages</h3>
                  <p className="text-gray-700 text-sm">{skills.languages.join(' • ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>Projects</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600 to-transparent"></div>
            </h2>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-3 pl-4 border-l-2 border-cyan-200">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>Certifications</span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-600 to-transparent"></div>
            </h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2 pl-4 border-l-2 border-cyan-200">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  <span className="text-gray-600"> – {cert.issuer}</span>
                  {cert.date && <span className="text-gray-500"> ({cert.date})</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

