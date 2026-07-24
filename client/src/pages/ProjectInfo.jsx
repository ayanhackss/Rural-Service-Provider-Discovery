import React from 'react';
import { Users, GraduationCap, Code2, Award, Briefcase, Eye, ShieldCheck, Search, MessageSquare, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: "Ayan Hussain",
    role: "Lead Developer",
    program: "BCA — 3rd Semester",
    skills: ["React", "Node.js", "MongoDB", "UI/UX"],
    color: "var(--color-primary)",
    image: "/ayan.png"
  },
  {
    name: "Gautam Kumar",
    role: "Backend Architecture",
    program: "BCA — 3rd Semester",
    skills: ["Express", "API Design", "Database", "Security"],
    color: "var(--color-accent)",
    image: "/gautam.jpeg"
  },
  {
    name: "Ishaan Dinesh Singh",
    role: "Frontend Specialist",
    program: "BCA — 3rd Semester",
    skills: ["Responsive Design", "Animation", "CSS", "Vite"],
    color: "oklch(65% 0.14 145)",
    image: "/ishaan.jpeg"
  },
  {
    name: "Abhishek Kumar",
    role: "QA & Integration",
    program: "BCA — 3rd Semester",
    skills: ["Testing", "Deployment", "Optimization", "Auth"],
    color: "var(--color-ink)",
    image: "/abhishek.jpeg"
  }
];

export default function ProjectInfo() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      {/* ── HERO SECTION ── */}
      <section className="section mesh-bg" style={{ textAlign: 'center', paddingBlock: 'var(--space-16) var(--space-12)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-paper-2)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-rule)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              <GraduationCap size={14} style={{ color: 'var(--color-accent)' }} />
              BCA 3rd Semester • Amity University Patna
            </div>
            <h1 className="display pi-hero-title" style={{ marginBottom: 'var(--space-4)' }}>
              The Team Behind <span style={{ color: 'var(--color-primary)' }}>GraamSeva</span>
            </h1>
            <p className="pi-hero-desc" style={{ color: 'var(--color-ink-dim)', maxWidth: '60ch', margin: '0 auto', lineHeight: 1.6 }}>
              Built by four BCA 3rd Semester students as a Non-Teaching Credit Course (NTCC) submission at Amity University Patna. Our mission is to bridge the gap between skilled rural professionals and community needs, empowering local economies through technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT THE PROJECT ── */}
      <section className="section" style={{ background: 'var(--color-paper-2)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)' }}>
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-paper)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-rule)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
                <Eye size={14} style={{ color: 'var(--color-primary)' }} />
                The Mission
              </div>
              <h2 className="pi-section-title">About GraamSeva</h2>
            </div>
            
            <div className="pi-about-grid">
              <div className="card pi-vision-card" style={{ padding: 'var(--space-8)', height: '100%', background: 'linear-gradient(145deg, var(--color-paper), var(--color-paper-2))', border: '1px solid var(--color-rule)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  The Vision
                </h3>
                <p style={{ color: 'var(--color-ink-dim)', lineHeight: 1.7, fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
                  In rural and semi-urban areas, finding reliable skilled workers—such as electricians, plumbers, or tutors—often relies solely on word-of-mouth. This limits opportunities for service providers and makes it difficult for residents to find verified help quickly.
                </p>
                <p style={{ color: 'var(--color-ink-dim)', lineHeight: 1.7, fontSize: 'var(--text-base)' }}>
                  <strong>GraamSeva</strong> was conceptualized as part of our Amity University NTCC project to digitize this unorganized sector, bringing visibility to skilled laborers and convenience to rural households.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="card pi-feature-card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--color-paper)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Role-Based Access</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Distinct dashboard experiences for Residents, Providers, and Admins.</p>
                  </div>
                </div>

                <div className="card pi-feature-card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--color-paper)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent)', flexShrink: 0 }}>
                    <Search size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Real-time Search</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Easily search and filter verified services by category and availability.</p>
                  </div>
                </div>

                <div className="card pi-feature-card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--color-paper)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-md)', color: 'oklch(65% 0.14 145)', flexShrink: 0 }}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Booking & Reviews</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Secure service requests with a transparent community review system.</p>
                  </div>
                </div>

                <div className="card pi-feature-card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--color-paper)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-paper-2)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-md)', color: 'var(--color-ink)', flexShrink: 0 }}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>Mobile-First UI</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Built with an intuitive, responsive design for maximum accessibility.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM GRID ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-paper-2)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-rule)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              <Users size={14} />
              Our Crew
            </div>
            <h2 className="pi-section-title">Meet the Team</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>BCA 3rd Semester • Amity University Patna</p>
          </div>
          <div className="pi-team-grid-v2">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 * (i + 1) }}
                style={{ 
                  borderRadius: 'var(--radius-lg, 16px)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-rule)',
                  background: 'var(--color-paper)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6)', textAlign: 'center' }}>
                  {/* Avatar */}
                  <div className="pi-team-avatar" style={{ 
                    width: 88, 
                    height: 88, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    border: '2px solid var(--color-rule)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: 'var(--space-5)',
                  }}>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '4px' }}>{member.name}</h3>
                  <p style={{ color: member.color, fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                    {member.role}
                  </p>
                  <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-5)' }}>
                    {member.program}
                  </p>

                  <div style={{ width: '40px', height: '1px', background: 'var(--color-rule)', marginBottom: 'var(--space-5)' }} />

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center' }}>
                    {member.skills.map(skill => (
                      <span key={skill} style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 10px', 
                        borderRadius: 'var(--radius-full)', 
                        background: 'var(--color-paper-2)', 
                        border: '1px solid var(--color-rule)', 
                        color: 'var(--color-ink-dim)',
                        fontWeight: 500
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT DETAILS ── */}
      <section className="section" style={{ background: 'var(--color-paper-2)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)', marginTop: 'var(--space-8)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="pi-section-title" style={{ marginBottom: 'var(--space-6)' }}>Project Highlights</h2>
          
          <div className="pi-highlights-grid">
            <div style={{ padding: 'var(--space-6)', background: 'var(--color-paper)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-rule)' }}>
              <Code2 size={24} style={{ margin: '0 auto var(--space-3) auto', color: 'var(--color-primary)' }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Modern Stack</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>MERN architecture tailored for high performance and scalability.</p>
            </div>
            
            <div style={{ padding: 'var(--space-6)', background: 'var(--color-paper)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-rule)' }}>
              <Award size={24} style={{ margin: '0 auto var(--space-3) auto', color: 'var(--color-accent)' }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>NTCC Project</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Developed as a Non-Teaching Credit Course to bridge the gap between academic theory and real-world application at Amity University Patna.</p>
            </div>

            <div style={{ padding: 'var(--space-6)', background: 'var(--color-paper)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-rule)' }}>
              <Briefcase size={24} style={{ margin: '0 auto var(--space-3) auto', color: 'oklch(65% 0.14 145)' }} />
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Rural Impact</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Bringing digital discovery to untapped rural service providers.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
