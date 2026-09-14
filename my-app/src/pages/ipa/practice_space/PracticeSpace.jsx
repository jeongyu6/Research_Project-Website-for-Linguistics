import Activity2ConsonantMapDrop from './consonant_map_drop/index.js'
import { useState } from 'react'
import Activity3BuildTheSound from './build_the_sound/index.js'
import Activity4MysterySound from './mystery_sound/index.js'
import Activity1VowelMapDrop from './vowel_map_drop/index.js'
import Activity5VowelDetective from './vowel_detective/index.js'

const activities = [
  { name: 'Vowel Map Drop', Component: Activity1VowelMapDrop },
  { name: 'Consonant Map Drop', Component: Activity2ConsonantMapDrop },
  { name: 'Build the Sound', Component: Activity3BuildTheSound },
  { name: 'Mystery Sound', Component: Activity4MysterySound },
  { name: 'Vowel Detective', Component: Activity5VowelDetective },
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
          <button type="button" role="tab" aria-selected={activeActivity === index} key={activity.name} onClick={() => setActiveActivity(index)}>
            Activity #{index + 1}: {activity.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={`Activity #${activeActivity + 1}: ${activities[activeActivity].name}`}>
        <ActiveActivity />
      </div>
    </section>
  )
}
