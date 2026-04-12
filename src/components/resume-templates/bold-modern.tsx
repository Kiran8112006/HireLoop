import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Award, Briefcase } from 'lucide-react';

interface BoldModernProps {
  resumeData: StructuredResume;
}

export default function BoldModern({ resumeData }: BoldModernProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto shadow-lg" style={{ minHeight: '11in' }}>
      {/* Bold Header with Angled Design */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-8 pb-16">
        <h1 className="text-5xl font-black mb-2">{personal.full_name || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          {personal.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{personal.location}</span>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      <div className="px-8 pb-8 -mt-4">
        {/* Summary */}
        {personal.summary && (
          <div className="mb-6 bg-gray-50 p-6 rounded-lg border-l-4 border-orange-600">
            <h2 className="text-xl font-black text-orange-600 mb-2 uppercase">Profile</h2>
            <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-black text-red-600 mb-4 uppercase flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-5 pl-4 border-l-4 border-orange-300">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-orange-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">{exp.start_date} - {exp.end_date || 'Now'}</span>
                </div>
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
          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-red-600 mb-4 uppercase">Education</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="mb-4 bg-gray-50 p-4 rounded">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-orange-600 font-semibold text-sm">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">{edu.graduation_date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <div>
              <h2 className="text-xl font-black text-red-600 mb-4 uppercase">Skills</h2>
              <div className="space-y-3">
                {skills?.technical?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-orange-600 text-sm mb-2">TECHNICAL</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.technical.map((skill, i) => (
                        <span key={i} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills?.soft?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-orange-600 text-sm mb-2">SOFT SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.soft.map((skill, i) => (
                        <span key={i} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
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
