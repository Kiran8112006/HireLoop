import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Welcome to HireLoop</h1>
        <p className="tagline">Select your role to continue</p>
        
        <div className="button-group">
          <Link href="/admin" className="cta">Admin</Link>
          <Link href="/student" className="cta">Student</Link>
          <Link href="/recruiter" className="cta">Recruiter</Link>
        </div>
      </section>

      <footer className="footer">© 2026 HireLoop</footer>
    </main>
  )
}
