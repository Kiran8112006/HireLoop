import { type StructuredResume } from '@/lib/resume-types';
import { Code2, Briefcase, GraduationCap, Award, FolderGit2 } from 'lucide-react';

interface TechCreativeProps {
  resumeData: StructuredResume;
}

export default function TechCreative({ resumeData }: TechCreativeProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-gray-50 text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg" style={{ minHeight: '11in' }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6">
          {/* Profile */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-4">{personal.full_name || 'Your Name'}</h1>

            <div className="space-y-2 text-sm">
              {personal.email && (
                <div className="break-words">
                  <p className="font-semibold text-indigo-200">Email</p>
                  <p className="text-white/90">{personal.email}</p>
                </div>
              )}
              {personal.phone && (
                <div>
                  <p className="font-semibold text-indigo-200">Phone</p>
                  <p className="text-white/90">{personal.phone}</p>
                </div>
              )}
              {personal.location && (
                <div>
                  <p className="font-semibold text-indigo-200">Location</p>
                  <p className="text-white/90">{personal.location}</p>
                </div>
              )}
              {personal.linkedin && (
                <div className="break-words">
                  <p className="font-semibold text-indigo-200">LinkedIn</p>
                  <p className="text-white/90 text-xs">{personal.linkedin}</p>
                </div>
              )}
              {personal.portfolio && (
                <div className="break-words">
                  <p className="font-semibold text-indigo-200">Portfolio</p>
                  <p className="text-white/90 text-xs">{personal.portfolio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.tools?.length > 0) && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5" />
                <h2 className="text-lg font-bold">Skills</h2>
              </div>

              {skills?.technical?.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-indigo-200 text-sm mb-2">Technical</p>
                  <div className="flex flex-wrap gap-1">
                    {(skills.technical || []).map((skill, index) => (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills?.tools?.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-indigo-200 text-sm mb-2">Tools</p>
                  <div className="flex flex-wrap gap-1">
                    {(skills.tools || []).map((tool, index) => (
                      <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills?.languages?.length > 0 && (
                <div>
                  <p className="font-semibold text-indigo-200 text-sm mb-2">Languages</p>
                  <div className="space-y-1 text-xs">
                    {(skills.languages || []).map((lang, index) => (
                      <p key={index}>{lang}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5" />
                <h2 className="text-lg font-bold">Certifications</h2>
              </div>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-3 text-sm">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-white/80 text-xs">{cert.issuer}</p>
                  <p className="text-white/60 text-xs">{cert.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {/* Professional Summary */}
          {personal.summary && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed border-l-4 border-indigo-600 pl-4 italic">
                "{personal.summary}"
              </p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-indigo-900">Experience</h2>
              </div>
              {experience.map((exp, index) => (
                <div key={index} className="mb-6 relative pl-6 border-l-2 border-indigo-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-indigo-700 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-600">
                      {exp.start_date} - {exp.end_date} • {exp.location}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                  )}
                  {exp.achievements?.length > 0 && (
                    <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
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
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-indigo-900">Education</h2>
              </div>
              {education.map((edu, index) => (
                <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-600">
                  <h3 className="text-lg font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-indigo-700 font-semibold">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.graduation_date} • {edu.location}
                  </p>
                  {edu.result && <p className="text-sm text-gray-600 mt-1">Result: {edu.result}</p>}
                  {edu.honors && edu.honors?.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      🏆 {edu.honors.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FolderGit2 className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-indigo-900">Projects</h2>
              </div>
              <div className="grid gap-4">
                {projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    {project.link && (
                      <a href={project.link} className="text-indigo-600 text-sm hover:underline">
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {awards?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-indigo-900">Awards</h2>
              </div>
              <ul className="space-y-2">
                {awards.map((award, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-indigo-600">🏆</span>
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
