import { type StructuredResume } from '@/lib/resume-types';
import { Briefcase, GraduationCap, Award, Target } from 'lucide-react';

interface ExecutiveProfessionalProps {
  resumeData: StructuredResume;
}

export default function ExecutiveProfessional({ resumeData }: ExecutiveProfessionalProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg p-12" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="border-b-4 border-slate-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {personal.full_name || 'Your Name'}
        </h1>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>

        {(personal.linkedin || personal.portfolio) && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 mt-1">
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Executive Summary */}
      {personal.summary && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-6 w-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              Executive Summary
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-justify">
            {personal.summary}
          </p>
        </div>
      )}

      {/* Core Competencies */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide mb-3 border-b-2 border-slate-300 pb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2">
            {[...(skills.technical || []), ...(skills.soft || [])].map((skill, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-800 mt-1">▪</span>
                <span className="text-slate-700 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience?.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-6 w-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              Professional Experience
            </h2>
          </div>

          {experience.map((exp, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                  <p className="text-slate-700 font-semibold">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-medium">
                    {exp.start_date} - {exp.end_date}
                  </p>
                  <p className="text-slate-600 text-sm">{exp.location}</p>
                </div>
              </div>

              {exp.description && (
                <p className="text-slate-700 mb-2 italic">{exp.description}</p>
              )}

              {exp.achievements?.length > 0 && (
                <ul className="space-y-1.5">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                      <span className="text-slate-800 mt-1 font-bold">•</span>
                      <span className="flex-1">{achievement}</span>
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
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              Education
            </h2>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-slate-700 font-semibold">{edu.institution}</p>
                  {edu.result && (
                    <p className="text-slate-600 text-sm">Result: {edu.result}</p>
                  )}
                  {edu.honors && edu.honors?.length > 0 && (
                    <p className="text-slate-600 text-sm">
                      Honors: {edu.honors.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-medium">{edu.graduation_date}</p>
                  <p className="text-slate-600 text-sm">{edu.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Certifications */}
      {certifications?.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-slate-800" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              Professional Certifications
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-slate-700 pl-3">
                <p className="font-bold text-slate-900">{cert.name}</p>
                <p className="text-slate-600 text-sm">{cert.issuer}</p>
                <p className="text-slate-500 text-sm">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notable Projects */}
      {projects?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide mb-4 border-b-2 border-slate-300 pb-2">
            Notable Projects & Initiatives
          </h2>

          {projects.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
              <p className="text-slate-700 text-sm mb-2">{project.description}</p>
              {project.link && (
                <p className="text-slate-600 text-sm">
                  <span className="font-semibold">Link:</span>{' '}
                  <a href={project.link} className="text-blue-700 hover:underline">
                    {project.link}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Awards & Recognition */}
      {awards?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide mb-3 border-b-2 border-slate-300 pb-2">
            Awards & Recognition
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {awards.map((award, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-700 text-sm">
                <span className="text-slate-800 mt-1">▪</span>
                <span>{award}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Proficiencies */}
      {(skills.tools.length > 0 || skills.languages?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide mb-3 border-b-2 border-slate-300 pb-2">
            Technical Proficiencies
          </h2>

          {skills?.tools?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-slate-800 text-sm">Tools & Platforms: </span>
              <span className="text-slate-700 text-sm">{(skills.tools || []).join(', ')}</span>
            </div>
          )}

          {skills?.languages?.length > 0 && (
            <div>
              <span className="font-semibold text-slate-800 text-sm">Languages: </span>
              <span className="text-slate-700 text-sm">{(skills.languages || []).join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
