import { type StructuredResume } from '@/lib/resume-types';
import { Link, Globe } from 'lucide-react';

interface PortfolioShowcaseProps {
  resumeData: StructuredResume;
}

export default function PortfolioShowcase({ resumeData }: PortfolioShowcaseProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      {/* Creative Header */}
      <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white p-10">
        <h1 className="text-5xl font-black mb-3">{personal.full_name || 'YOUR NAME'}</h1>
        {personal.summary && (
          <p className="text-white/90 mb-3 leading-relaxed">{personal.summary}</p>
        )}
        <div className="flex gap-4 text-sm">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>
        <div className="flex gap-3 mt-3">
          {personal.linkedin && (
            <a href="#" className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30">
              <Link className="h-3 w-3" /> LinkedIn
            </a>
          )}
          {personal.portfolio && (
            <a href="#" className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30">
              <Globe className="h-3 w-3" /> Portfolio
            </a>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Projects Showcase */}
        {projects && projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-black text-purple-700 mb-6">Featured Projects</h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div key={project.id || index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-purple-600 hover:underline mt-2 inline-block">
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-black text-purple-700 mb-4">Work Experience</h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-6 border-l-4 border-purple-400 pl-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600 font-semibold">{exp.start_date} - {exp.end_date || 'Present'}</span>
                </div>
                <p className="text-purple-600 font-semibold mb-2">{exp.company}</p>
                {exp.description && <p className="text-gray-700 text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.tools?.length > 0) && (
            <div>
              <h2 className="text-2xl font-black text-purple-700 mb-4">Skills & Tools</h2>
              <div className="space-y-3">
                {skills?.technical?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Technical</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.technical.map((skill, i) => (
                        <span key={i} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills?.tools?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((tool, i) => (
                        <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-purple-700 mb-4">Education</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-purple-600 font-semibold text-sm">{edu.field}</p>
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                  <p className="text-gray-500 text-xs">{edu.graduation_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

