import { useState } from 'react'
import './App.css'
import utLogo from './utoronto_coa_no_background.png'
import EnglishPage from './pages/EnglishPage.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="page-shell">
      <header className="ut-header">
        <div className="ut-header-left">
          <div className="ut-logo-badge">
            <img src={utLogo} alt="University of Toronto logo" />
          </div>
          <div className="ut-identity">
            <span className="ut-identity-title">UNIVERSITY OF TORONTO SCARBOROUGH</span>
            <span className="ut-identity-subtitle">Department of Language Studies</span>
          </div>
        </div>
        <div className="ut-header-right">
          <span className="ut-dept-name">Linguistics</span>
        </div>
      </header>

      <main>
        {currentPage === 'english' ? (
          <EnglishPage onBack={() => setCurrentPage('home')} />
        ) : (
          <>
            <section className="hero" id="hero">
              <div className="hero-copy">
                <h1>Digital Linguistics Resources</h1>
                <p>Explore a growing collection of interactive tools and learning resources designed to support the study of languages and linguistics.</p>
              </div>

              <aside className="hero-panel">
                <div className="panel-card">
                  <div className="panel-card-header">About This Site</div>
                  <p>
                    These resources are created by the Department of Language Studies at the University of Toronto Scarborough to support students, educators, and anyone with an interest in languages and how they work.
                  </p>
                  <p style={{ marginTop: '12px' }}>
                    New resources will be added regularly!
                  </p>
                </div>
              </aside>
            </section>

            <section className="explore-section">
              <h2>EXPLORE OUR RESOURCES</h2>
              <div className="resource-grid">
                <article className="resource-card">
                  <div className="card-icon ipa-icon">
                    <span>/æ/</span>
                  </div>
                  <h3>International Phonetic Alphabet (IPA)</h3>
                  <p>Explore the symbols used to represent the sounds of spoken languages.</p>
                  <button
                    type="button"
                    className="card-button"
                    onClick={() => setCurrentPage('english')}
                  >
                    Explore IPA →
                  </button>
                </article>

                <article className="resource-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="puzzle-icon">
                      <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4.18C12.4 3.84 11.3 3 10 3S7.6 3.84 7.18 5H3c-1.1 0-2 .9-2 2v4.18C2.16 11.6 3 12.7 3 14s-.84 2.4-2 2.82V21c0 1.1.9 2 2 2h4.18C7.6 21.84 8.7 21 10 21s2.4.84 2.82 2H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3>Morphology</h3>
                  <p>Discover how words are formed and how their parts add meaning.</p>
                  <button type="button" className="card-button">Coming Soon</button>
                </article>

                <article className="resource-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="syntax-icon">
                      <circle cx="12" cy="4.6" r="2" fill="currentColor"/>
                      <path d="M8.8 9.2c.4-2 1.7-3 3.2-3s2.8 1 3.2 3v1.2H8.8Z" fill="currentColor"/>
                      <path d="M12 10.4v3.2M6 13.6h12M6 13.6v2.6M18 13.6v2.6" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="6" cy="17.8" r="1.8" fill="currentColor"/>
                      <path d="M3.2 22c.35-1.9 1.5-2.8 2.8-2.8s2.45.9 2.8 2.8Z" fill="currentColor"/>
                      <circle cx="18" cy="17.8" r="1.8" fill="currentColor"/>
                      <path d="M15.2 22c.35-1.9 1.5-2.8 2.8-2.8s2.45.9 2.8 2.8Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3>Syntax</h3>
                  <p>Learn how words combine to form phrases, clauses, and sentences.</p>
                  <button type="button" className="card-button">Coming Soon</button>
                </article>

                <article className="resource-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 64 64" aria-hidden="true">
                      <path d="M9 30c0-12 10-21 24-21s24 9 24 21-10 21-24 21c-4 0-8-.8-11.5-2.4L10 55l4.4-11.1A20.5 20.5 0 0 1 9 30Z" fill="currentColor"/>
                      <circle cx="23" cy="30" r="3.2" fill="#ffffff"/>
                      <circle cx="33" cy="30" r="3.2" fill="#ffffff"/>
                      <circle cx="43" cy="30" r="3.2" fill="#ffffff"/>
                    </svg>
                  </div>
                  <h3>Sociolinguistics</h3>
                  <p>Explore how language and society influence each other.</p>
                  <button type="button" className="card-button">Coming Soon</button>
                </article>

                <article className="resource-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 64 64" aria-hidden="true">
                      <ellipse cx="32" cy="14" rx="18" ry="8" fill="currentColor"/>
                      <path d="M14 14v32c0 4.4 8.1 8 18 8s18-3.6 18-8V14" fill="currentColor"/>
                      <path d="M14 26c0 4.4 8.1 8 18 8s18-3.6 18-8M14 38c0 4.4 8.1 8 18 8s18-3.6 18-8" fill="none" stroke="#ffffff" strokeWidth="3"/>
                    </svg>
                  </div>
                  <h3>Language Data & Projects</h3>
                  <p>Access datasets, ongoing projects, and tools for language research.</p>
                  <button type="button" className="card-button">Coming Soon</button>
                </article>
              </div>
            </section>
          
          </>
        )}
      </main>

      <footer className="page-footer" id="contact">
        <p>Developed by the Department of Language Studies, University of Toronto Scarborough.</p>
      </footer>
    </div>
  )
}

export default App
