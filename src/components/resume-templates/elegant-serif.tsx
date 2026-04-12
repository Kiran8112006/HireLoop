import { type StructuredResume } from '@/lib/resume-types';

interface ElegantSerifProps {
  resumeData: StructuredResume;
}

export default function ElegantSerif({ resumeData }: ElegantSerifProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in', fontFamily: 'Georgia, serif' }}>
      <div className="p-12">
        {/* Elegant Header */}
        <div className="text-center mb-10 pb-6 border-b-2 border-gray-800">
          <h1 className="text-6xl font-light mb-4 tracking-wide" style={{ fontVariant: 'small-caps' }}>
            {personal.full_name || 'Your Name'}
          </h1>
          <div className="text-sm text-gray-600 space-x-3">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>•</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>•</span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
          {(personal.linkedin || personal.portfolio) && (
            <div className="text-sm text-gray-600 mt-2 space-x-3">
              {personal.linkedin && <span>{personal.linkedin}</span>}
              {personal.portfolio && <span>•</span>}
              {personal.portfolio && <span>{personal.portfolio}</span>}
            </div>
          )}
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className="mb-10 text-center">
            <p className="text-gray-700 leading-relaxed italic text-lg">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-light text-center mb-6 pb-2 border-b border-gray-400" style={{ fontVariant: 'small-caps' }}>
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-8 last:mb-0">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-gray-600 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600">{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                {exp.description && <p className="text-gray-700 mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
          <div className="mb-10">
            <h2 className="text-3xl font-light text-center mb-6 pb-2 border-b border-gray-400" style={{ fontVariant: 'small-caps' }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-6 text-center">
                <h3 className="text-xl font-semibold">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                <p className="text-gray-600 italic">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.graduation_date}{edu.result && ` • Result: ${edu.result}`}</p>
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-sm text-gray-700 italic">{edu.honors.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div className="mb-10">
            <h2 className="text-3xl font-light text-center mb-6 pb-2 border-b border-gray-400" style={{ fontVariant: 'small-caps' }}>
              Skills & Expertise
            </h2>
            <div className="text-center space-y-3">
              {skills?.technical?.length > 0 && (
                <p className="text-gray-700"><span className="font-semibold">Technical:</span> {skills.technical.join(' • ')}</p>
              )}
              {skills?.tools?.length > 0 && (
                <p className="text-gray-700"><span className="font-semibold">Tools:</span> {skills.tools.join(' • ')}</p>
              )}
              {skills?.soft?.length > 0 && (
                <p className="text-gray-700"><span className="font-semibold">Professional:</span> {skills.soft.join(' • ')}</p>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-light text-center mb-6 pb-2 border-b border-gray-400" style={{ fontVariant: 'small-caps' }}>
              Certifications
            </h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-3 text-center">
                <p className="text-gray-700"><span className="font-semibold">{cert.name}</span> – {cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
