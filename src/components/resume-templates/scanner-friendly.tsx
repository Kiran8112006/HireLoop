import { type StructuredResume } from '@/lib/resume-types';
import { Mail, Phone, MapPin, Link } from 'lucide-react';

interface ScannerFriendlyProps {
  resumeData: StructuredResume;
}

export default function ScannerFriendly({ resumeData }: ScannerFriendlyProps) {
  const { personal, experience, education, skills, certifications, projects, awards } = resumeData;

  return (
    <div className="bg-white text-black w-full max-w-[8.5in] mx-auto" style={{ minHeight: '11in' }}>
      <div className="p-10">
        {/* Simple ATS-Friendly Header */}
        <div className="mb-6 pb-4 border-b-2 border-black">
          <h1 className="text-4xl font-bold mb-2">{personal.full_name || 'YOUR NAME'}</h1>
          <div className="text-sm space-y-1">
            {personal.email && <div><Mail className="inline h-3 w-3 mr-2" />{personal.email}</div>}
            {personal.phone && <div><Phone className="inline h-3 w-3 mr-2" />{personal.phone}</div>}
            {personal.location && <div><MapPin className="inline h-3 w-3 mr-2" />{personal.location}</div>}
            {personal.linkedin && <div><Link className="inline h-3 w-3 mr-2" />{personal.linkedin}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {personal.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 border-b border-black">PROFESSIONAL SUMMARY</h2>
            <p className="text-sm leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Skills - Prominent for ATS */}
        {(skills?.technical?.length > 0 || skills?.tools?.length > 0 || skills?.soft?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 border-b border-black">SKILLS</h2>
            <div className="space-y-2 text-sm">
              {skills?.technical?.length > 0 && (
                <div>
                  <span className="font-bold">Technical Skills: </span>
                  <span>{skills.technical.join(', ')}</span>
                </div>
              )}
              {skills?.tools?.length > 0 && (
                <div>
                  <span className="font-bold">Tools & Technologies: </span>
                  <span>{skills.tools.join(', ')}</span>
                </div>
              )}
              {skills?.soft?.length > 0 && (
                <div>
                  <span className="font-bold">Professional Skills: </span>
                  <span>{skills.soft.join(', ')}</span>
                </div>
              )}
              {skills?.languages?.length > 0 && (
                <div>
                  <span className="font-bold">Languages: </span>
                  <span>{skills.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 border-b border-black">PROFESSIONAL EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <span className="text-sm">{exp.start_date} - {exp.end_date || 'Present'}</span>
                </div>
                <div className="text-sm mb-2">
                  <span className="font-semibold">{exp.company}</span>
                  {exp.location && <span>, {exp.location}</span>}
                </div>
                {exp.description && <p className="text-sm mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
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
            <h2 className="text-xl font-bold mb-3 border-b border-black">EDUCATION</h2>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <span className="text-sm">{edu.graduation_date}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{edu.institution}</span>
                  {edu.location && <span>, {edu.location}</span>}
                </div>
                {edu.result && <div className="text-sm">Result: {edu.result}</div>}
                {edu.honors && edu.honors.length > 0 && (
                  <div className="text-sm">{edu.honors.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 border-b border-black">CERTIFICATIONS</h2>
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-2 text-sm">
                <span className="font-bold">{cert.name}</span> – {cert.issuer}
                {cert.date && <span> ({cert.date})</span>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 border-b border-black">PROJECTS</h2>
            {projects.map((project, index) => (
              <div key={project.id || index} className="mb-3">
                <h3 className="font-bold text-sm">{project.name}</h3>
                {project.description && <p className="text-sm">{project.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Awards */}
        {awards?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2 border-b border-black">AWARDS & HONORS</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
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

