import { type StructuredResume } from '@/lib/resume-types';

interface CompactEfficientProps {
  resumeData: StructuredResume;
}

export default function CompactEfficient({ resumeData }: CompactEfficientProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      <div className="p-8">
        {/* Compact Header */}
        <div className="bg-gray-900 text-white p-4 mb-4 -mx-8">
          <h1 className="text-3xl font-bold">{personal.full_name || 'YOUR NAME'}</h1>
          <div className="flex flex-wrap gap-3 text-xs mt-2">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>| {personal.phone}</span>}
            {personal.location && <span>| {personal.location}</span>}
            {personal.linkedin && <span>| {personal.linkedin}</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-4">
            {/* Summary */}
            {personal.summary && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Professional Summary</h2>
                <p className="text-xs text-gray-700 leading-relaxed">{personal.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Work Experience</h2>
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold">{exp.position}</h3>
                      <span className="text-xs text-gray-600">{exp.start_date} - {exp.end_date || 'Present'}</span>
                    </div>
                    <p className="text-xs text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 mt-1">
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
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Key Projects</h2>
                {projects.map((project, index) => (
                  <div key={project.id || index} className="mb-2">
                    <h3 className="text-sm font-bold">{project.name}</h3>
                    {project.description && <p className="text-xs text-gray-700">{project.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-4">
            {/* Education */}
            {education?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Education</h2>
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="mb-3">
                    <h3 className="text-xs font-bold">{edu.degree}</h3>
                    <p className="text-xs text-gray-700">{edu.field}</p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.graduation_date}</p>
                    {edu.result && <p className="text-xs text-gray-600">Result: {edu.result}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Skills</h2>
                {skills?.technical?.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-xs font-bold text-gray-700 mb-1">Technical</h3>
                    <p className="text-xs text-gray-700">{skills.technical.join(', ')}</p>
                  </div>
                )}
                {skills?.tools?.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-xs font-bold text-gray-700 mb-1">Tools</h3>
                    <p className="text-xs text-gray-700">{skills.tools.join(', ')}</p>
                  </div>
                )}
                {skills?.soft?.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-xs font-bold text-gray-700 mb-1">Soft Skills</h3>
                    <p className="text-xs text-gray-700">{skills.soft.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Certifications</h2>
                {certifications.map((cert, index) => (
                  <div key={cert.id || index} className="mb-2">
                    <p className="text-xs font-bold">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold bg-gray-200 px-2 py-1 mb-2 uppercase">Awards</h2>
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
    </div>
  );
}
