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
          <p>Interactive syntax tree builder for linguistic analysis.</p>
        </div>
        <div className="treeform-container">
          <p>TreeForm application will be displayed here.</p>
        </div>
      </section>
    </div>
  )
}
