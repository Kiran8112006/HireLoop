import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link, Globe, Calendar } from 'lucide-react';

interface ModernMinimalProps {
  resumeData: StructuredResume;
}

export default function ModernMinimal({ resumeData }: ModernMinimalProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8" data-resume-section="header">
        <h1 className="text-4xl font-bold mb-2">{personal.full_name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              <span className="truncate">{personal.linkedin}</span>
            </div>
          )}
          {personal.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="truncate">{personal.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {personal.summary && (
          <div className="mb-6" data-resume-section="summary">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0 || skills?.tools?.length > 0) && (
          <div className="mb-6" data-resume-section="skills">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {skills?.technical?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Technical Skills</h3>
                  <p className="text-gray-700 text-sm">{(skills.technical || []).join(' • ')}</p>
                </div>
              )}
              {skills?.tools?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tools & Technologies</h3>
                  <p className="text-gray-700 text-sm">{(skills.tools || []).join(' • ')}</p>
                </div>
              )}
              {skills?.soft?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Soft Skills</h3>
                  <p className="text-gray-700 text-sm">{(skills.soft || []).join(' • ')}</p>
                </div>
              )}
              {skills?.languages?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                  <p className="text-gray-700 text-sm">{(skills.languages || []).join(' • ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6" data-resume-section="experience">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{exp.location}</p>
                    <p className="flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      {exp.start_date} - {exp.end_date}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
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
          <div className="mb-6" data-resume-section="education">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-blue-700">{edu.institution}</p>
                    {edu.result && <p className="text-sm text-gray-600">Result: {edu.result}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.location}</p>
                    <p>{edu.graduation_date}</p>
                  </div>
                </div>
                {edu.honors && edu.honors?.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Honors: {edu.honors.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mb-6" data-resume-section="certifications">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Certifications
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                  <p className="text-gray-700 text-xs">{cert.issuer} • {cert.date}</p>
                  {cert.credential_id && (
                    <p className="text-gray-500 text-xs">ID: {cert.credential_id}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-6" data-resume-section="projects">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Projects
            </h2>
            {projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} className="text-blue-600 text-sm hover:underline">
                      View Project →
                    </a>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-1">{project.description}</p>
                <p className="text-gray-600 text-xs">
                  </p>
              </div>
            ))}
          </div>
        )}

        {/* Awards */}
        {awards?.length > 0 && (
          <div className="mb-6" data-resume-section="awards">
            <h2 className="text-2xl font-bold text-blue-800 mb-3 pb-2 border-b-2 border-blue-800">
              Awards & Achievements
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {awards.map((award, index) => (
                <li key={index}>{award}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

