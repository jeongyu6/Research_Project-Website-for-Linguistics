export default function PracticeSpace() {
  return (
    <section className="practice-space-workspace" aria-labelledby="practice-space-heading">
      <div className="ipa-section-heading">
        <h2 id="practice-space-heading">Practice Space</h2>
        <p>Practise transcriptions, take notes, or work through exercises here.</p>
      </div>
      <textarea
        className="practice-space-editor"
        aria-label="Practice space editor"
        placeholder="Start practising here…"
        spellCheck="false"
      />
    </section>
  )
}
