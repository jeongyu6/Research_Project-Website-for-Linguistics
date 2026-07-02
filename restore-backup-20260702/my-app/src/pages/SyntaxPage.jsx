import SyntaxTreeBuilder from '../components/SyntaxTreeBuilder.jsx'

export default function SyntaxPage({ onBack }) {
  return (
    <div className="syntax-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>Syntax Tree Builder</h1>
      </div>

      <section className="syntax-tool-section">
        <div className="ipa-section-heading">
          <h2>TreeForm Web</h2>
          <p>Create, edit, import, and export syntax trees directly in the browser.</p>
        </div>
        <SyntaxTreeBuilder />
      </section>
    </div>
  )
}
