import { type StructuredResume } from '@/lib/resume-types';

interface ClassicCorporateProps {
  resumeData: StructuredResume;
}

export default function ClassicCorporate({ resumeData }: ClassicCorporateProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg p-12" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">{personal.full_name || 'YOUR NAME'}</h1>
        <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-700">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>|</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>|</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
        {(personal.linkedin || personal.portfolio) && (
          <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-600 mt-1">
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && personal.linkedin && <span>|</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{personal.summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">
                  {exp.start_date} - {exp.end_date}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="font-semibold text-gray-800">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.location}</p>
              </div>
              {exp.description && (
                <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
              )}
              {exp.achievements?.length > 0 && (
                <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
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
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-sm text-gray-600">{edu.graduation_date}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-800">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.location}</p>
              </div>
              {edu.result && (
                <p className="text-sm text-gray-600">Result: {edu.result}</p>
              )}
              {edu.honors && edu.honors?.length > 0 && (
                <p className="text-sm text-gray-600">
                  Honors: {edu.honors.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Skills
          </h2>
          <div className="space-y-2">
            {skills?.technical?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 text-sm">Technical Skills: </span>
                <span className="text-gray-700 text-sm">{(skills.technical || []).join(', ')}</span>
              </div>
            )}
            {skills?.tools?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 text-sm">Tools & Technologies: </span>
                <span className="text-gray-700 text-sm">{(skills.tools || []).join(', ')}</span>
              </div>
            )}
            {skills?.soft?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 text-sm">Professional Skills: </span>
                <span className="text-gray-700 text-sm">{(skills.soft || []).join(', ')}</span>
              </div>
            )}
            {skills?.languages?.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 text-sm">Languages: </span>
                <span className="text-gray-700 text-sm">{(skills.languages || []).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Certifications
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                <span className="text-sm text-gray-600">{cert.date}</span>
              </div>
              <p className="text-gray-700 text-sm">{cert.issuer}</p>
              {cert.credential_id && (
                <p className="text-gray-500 text-xs">Credential ID: {cert.credential_id}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
              <p className="text-gray-700 text-sm mb-1">{project.description}</p>
              {project.link && (
                <p className="text-gray-600 text-xs">
                  <span className="font-semibold">Link:</span> {project.link}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {awards?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2 text-gray-800 border-b border-gray-400">
            Awards & Achievements
          </h2>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            {awards.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
