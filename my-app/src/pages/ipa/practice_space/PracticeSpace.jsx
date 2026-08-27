import { useState } from 'react'
import Activity1BuildTheSound from './build_the_sound/index.js'
import Activity2MysterySound from './mystery_sound/index.js'
import Activity3VowelMapDrop from './vowel_map_drop/index.js'
import Activity4VowelDetective from './vowel_detective/index.js'

const activities = [
  { name: 'Build the Sound', Component: Activity1BuildTheSound },
  { name: 'Mystery Sound', Component: Activity2MysterySound },
  { name: 'Vowel Map Drop', Component: Activity3VowelMapDrop },
  { name: 'Vowel Detective', Component: Activity4VowelDetective },
]

export default function PracticeSpace() {
  const [activeActivity, setActiveActivity] = useState(0)
  const ActiveActivity = activities[activeActivity].Component

  return (
    <section className="practice-space-workspace" aria-labelledby="practice-space-heading">
      <div className="ipa-section-heading">
        <h2 id="practice-space-heading">Practice Space</h2>
        <p>Select an activity to practise identifying and using IPA sounds.</p>
      </div>
      <div className="practice-activity-tabs" role="tablist" aria-label="Practice activities">
        {activities.map((activity, index) => (
          <button type="button" role="tab" aria-label={`Activity ${index + 1}: ${activity.name}`} aria-selected={activeActivity === index} key={activity.name} onClick={() => setActiveActivity(index)}>
            <span>Activity {index + 1}</span>
            {activity.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={`Activity ${activeActivity + 1}`}>
        <ActiveActivity />
      </div>
    </section>
  )
}
