"use client";

import { useState, useEffect } from "react";

interface AIAdvisorProps {
  atsScore: number | null;
  atsJobTitle: string;
  atsSummary: string;
  skillsFound?: string[];
  yearsExperience?: number;
  strengths?: string[];
  weaknesses?: string[];
}

interface AIGuidance {
  overall_assessment: string;
  improvement_suggestions: string[];
  next_steps: string[];
  motivation_message: string;
  skill_gaps: string[];
  interview_tips: string[];
}

export default function AIResumeAdvisor({
  atsScore,
  atsJobTitle,
  atsSummary,
  skillsFound,
  yearsExperience,
  strengths,
  weaknesses,
}: AIAdvisorProps) {
  const [guidance, setGuidance] = useState<AIGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (atsScore !== null && atsJobTitle && atsScore > 0) {
      fetchAIGuidance();
    }
  }, [atsScore, atsJobTitle]);

  const fetchAIGuidance = async () => {
    if (!atsJobTitle.trim()) {
      setError("Job title is required for AI guidance");
      return;
    }

    setLoading(true);
    setError("");
    setGuidance(null);

    try {
      const response = await fetch("http://localhost:5000/get-resume-guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          atsScore: atsScore,
          jobTitle: atsJobTitle,
          summary: atsSummary,
          skills: skillsFound || [],
          yearsExperience: yearsExperience || 0,
          strengths: strengths || [],
          weaknesses: weaknesses || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI guidance");
      }

      const data = await response.json();
      setGuidance(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to get AI guidance. Ensure backend server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!atsScore) {
    return (
      <div style={{ padding: "20px", color: "#666" }}>
        <p>📊 AI Resume Advisor will appear here after ATS analysis</p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "2px solid #4F46E5",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#F8F7FF",
        marginTop: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
        <span style={{ fontSize: "24px", marginRight: "10px" }}>🤖</span>
        <h2 style={{ margin: 0, color: "#4F46E5" }}>Personal AI Career Advisor</h2>
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>🔄 AI is analyzing your profile...</p>
      ) : error ? (
        <p style={{ color: "#DC2626" }}>❌ {error}</p>
      ) : guidance ? (
        <div>
          {/* ATS Score Badge */}
          <div
            style={{
              backgroundColor: getScoreColor(atsScore || 0),
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>ATS Match Score</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              {atsScore}%
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
              {getScoreLabel(atsScore || 0)}
            </p>
          </div>

          {/* Overall Assessment */}
          <div
            style={{
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "15px",
              borderLeft: "4px solid #4F46E5",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#1F2937" }}>
              📋 Assessment
            </h3>
            <p style={{ margin: 0, color: "#4B5563", lineHeight: "1.6" }}>
              {guidance.overall_assessment}
            </p>
          </div>

          {/* Improvement Suggestions */}
          {guidance.improvement_suggestions.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
                borderLeft: "4px solid #F59E0B",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#1F2937" }}>
                💡 Improvement Suggestions
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563" }}>
                {guidance.improvement_suggestions.map((suggestion, idx) => (
                  <li key={idx} style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skill Gaps */}
          {guidance.skill_gaps.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
                borderLeft: "4px solid #EF4444",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#1F2937" }}>
                🎯 Skill Gaps to Address
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563" }}>
                {guidance.skill_gaps.map((skill, idx) => (
                  <li key={idx} style={{ marginBottom: "8px" }}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Tips */}
          {guidance.interview_tips.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
                borderLeft: "4px solid #10B981",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#1F2937" }}>
                🎤 Interview Tips
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563" }}>
                {guidance.interview_tips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {guidance.next_steps.length > 0 && (
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
                borderLeft: "4px solid #3B82F6",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#1F2937" }}>
                🚀 Next Steps
              </h3>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#4B5563" }}>
                {guidance.next_steps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Motivation Message */}
          <div
            style={{
              backgroundColor: "#DBEAFE",
              padding: "15px",
              borderRadius: "6px",
              borderLeft: "4px solid #0EA5E9",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#0369A1", fontStyle: "italic" }}>
              ✨ {guidance.motivation_message}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981"; // Green
  if (score >= 60) return "#F59E0B"; // Amber
  return "#EF4444"; // Red
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match 🌟";
  if (score >= 80) return "Good Match ✅";
  if (score >= 70) return "Fair Match ⚠️";
  if (score >= 60) return "Moderate Match 📊";
  return "Needs Improvement 📈";
}
