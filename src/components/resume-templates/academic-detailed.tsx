import { type StructuredResume } from '@/lib/resume-types';
import { BookOpen, Award, FileText } from 'lucide-react';

interface AcademicDetailedProps {
  resumeData: StructuredResume;
}

export default function AcademicDetailed({ resumeData }: AcademicDetailedProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-gray-900 w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in', fontFamily: 'Times New Roman, serif' }}>
      <div className="p-10">
        {/* Traditional Academic Header */}
        <div className="text-center mb-8 pb-4 border-b-4 border-double border-gray-800">
          <h1 className="text-4xl font-bold mb-3">{personal.full_name || 'Your Name'}</h1>
          <div className="text-sm text-gray-700 space-x-2">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
          </div>
          {(personal.linkedin || personal.portfolio) && (
            <div className="text-sm text-gray-700 mt-1">
              {personal.linkedin && <span>{personal.linkedin}</span>}
              {personal.portfolio && personal.linkedin && <span> • </span>}
              {personal.portfolio && <span>{personal.portfolio}</span>}
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {personal.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Summary
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify">{personal.summary}</p>
          </div>
        )}

        {/* Education - Most Prominent */}
        {education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </h3>
                  <span className="text-sm text-gray-600">{edu.graduation_date}</span>
                </div>
                <p className="text-gray-700 italic">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                {edu.result && <p className="text-sm text-gray-700">Result: {edu.result}</p>}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-sm text-gray-700">Honors: {edu.honors.join(', ')}</p>
                )}
                {/* Coursework not present in type; omit to avoid errors */}
              </div>
            ))}
          </div>
        )}

        {/* Professional Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Professional Experience</h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600">{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                {exp.description && <p className="text-gray-800 mt-1 text-sm">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-0.5 text-sm text-gray-800 mt-1">
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
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Projects</h2>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-3">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-800">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Awards & Achievements */}
        {awards?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Awards & Achievements
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {awards.map((award, index) => (
                <li key={index} className="text-sm text-gray-800">{award}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.tools?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
            <div className="space-y-2">
              {skills?.technical?.length > 0 && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Technical Skills:</span> {skills.technical.join(', ')}
                </p>
              )}
              {skills?.tools?.length > 0 && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Tools & Technologies:</span> {skills.tools.join(', ')}
                </p>
              )}
              {skills?.languages?.length > 0 && (
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Languages:</span> {skills.languages.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Certifications</h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{cert.name}</span> – {cert.issuer}
                  {cert.date && <span> ({cert.date})</span>}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Soft Skills */}
        {skills?.soft?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Soft Skills</h2>
            <p className="text-sm text-gray-800">{skills.soft.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
