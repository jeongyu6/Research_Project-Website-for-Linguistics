import SyntaxTreeBuilder from '../components/SyntaxTreeBuilder.jsx'

export default function LanguageDataPage({ onBack }) {
  return (
    <div className="language-data-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>Language Data & Projects</h1>
      </div>

      <section className="language-data-section">
        <div className="ipa-section-heading">
          <h2>TreeForm Application</h2>
          <p>Create, edit, import, and export syntax trees directly in the browser.</p>
        </div>
        <div className="treeform-container">
          <SyntaxTreeBuilder />
        </div>
      </section>
    </div>
  )
}
