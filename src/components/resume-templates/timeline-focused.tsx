import { type StructuredResume } from '@/lib/resume-types';
import { Circle, Mail, Phone, MapPin } from 'lucide-react';

interface TimelineFocusedProps {
  resumeData: StructuredResume;
}

export default function TimelineFocused({ resumeData }: TimelineFocusedProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-gray-50 text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-8">
        <h1 className="text-5xl font-bold mb-3">{personal.full_name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {personal.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{personal.location}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personal.summary && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Timeline - Experience */}
        {experience?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">Career Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-300"></div>
              
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-12 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-1">
                    <Circle className="h-5 w-5 fill-purple-600 text-purple-600" />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-purple-700 font-semibold text-lg">{exp.company}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </span>
                    </div>
                    {exp.location && <p className="text-gray-600 text-sm mb-2">{exp.location}</p>}
                    {exp.description && <p className="text-gray-700 mb-3">{exp.description}</p>}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">▸</span>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Education</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="bg-white p-4 rounded-lg shadow mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-purple-700 font-semibold">{edu.field}</p>
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.graduation_date}</p>
                  {edu.result && <p className="text-sm text-gray-600 mt-1">Result: {edu.result}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <div>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Skills</h2>
              <div className="bg-white p-4 rounded-lg shadow space-y-4">
                {skills?.technical?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Technical</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.technical.map((skill, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills?.tools?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Tools</h3>
                    <p className="text-sm text-gray-700">{skills.tools.join(' • ')}</p>
                  </div>
                )}
                {skills?.soft?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Soft Skills</h3>
                    <p className="text-sm text-gray-700">{skills.soft.join(' • ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
