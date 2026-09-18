# Digital Linguistics Resources

This research project provides interactive learning resources for linguistics students. It is being developed with Professor Saffieh for the University of Toronto Scarborough Department of Language Studies.

The website currently includes:

- An interactive Canadian English vowel chart with audio recordings, articulatory descriptions, and example words
- An interactive Canadian English consonant chart with audio recordings, articulatory descriptions, and example words
- An interactive IPA keyboard and transcription editor
- A Practice Space containing five phonetics activities
- A syntax tree builder app

## Technology

- React 19
- Vite
- Vitest
- React Testing Library
- ESLint

## Getting Started

The React application is inside `my-app`, so npm commands must be run from that directory.

```bash
cd my-app
npm install
npm run dev
```

Vite will print the local development address in the terminal.

## Available Commands

Run these commands from `my-app`:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run test      # Run tests in watch mode
npm run test:run  # Run all tests once
npm run lint      # Run ESLint
```

## Source Code Structure

```text
Linguistics_Programming_Website/
├── Pictures/                         # University and department images
├── Recordings/                       # Vowel and consonant audio files
├── my-app/
│   ├── src/
│   │   ├── App.jsx                   # Main application and page switching
│   │   ├── App.css                   # Shared application and activity styles
│   │   ├── main.jsx                  # React application entry point
│   │   └── pages/
│   │       └── ipa/
│   │           ├── IPA_Page.jsx      # Composes all IPA sections
│   │           ├── index.js          # IPA package exports
│   │           ├── keyboard/
│   │           │   ├── IPAKeyboard.jsx
│   │           │   ├── IPAKeyboard.test.jsx
│   │           │   └── index.js
│   │           ├── sound_listening/
│   │           │   ├── UnderlinedExample.jsx
│   │           │   ├── Vowels.jsx
│   │           │   ├── Vowels.test.jsx
│   │           │   ├── Consonants.jsx
│   │           │   ├── Consonants.test.jsx
│   │           │   ├── ipaData.js
│   │           │   ├── vowelChartPositions.js
│   │           │   └── index.js
│   │           └── practice_space/
│   │               ├── PracticeSpace.jsx
│   │               ├── PracticeSpace.test.jsx
│   │               ├── QuestionTimer.jsx
│   │               ├── QuestionTimer.test.jsx
│   │               ├── ActivityTimers.test.jsx
│   │               ├── QuizSummary.jsx
│   │               ├── index.js
│   │               ├── build_the_sound/
│   │               │   ├── Activity3_BuildTheSound.jsx
│   │               │   ├── Activity3_BuildTheSound.test.jsx
│   │               │   ├── useLevelTime.js
│   │               │   ├── index.js
│   │               │   ├── level_1/
│   │               │   │   ├── Level1BuildTheSound.jsx
│   │               │   │   ├── Level1BuildTheSound.test.jsx
│   │               │   │   ├── level1Questions.js
│   │               │   │   └── level1Questions.test.js
│   │               ├── consonant_map_drop/
│   │               │   ├── Activity2_ConsonantMapDrop.jsx
│   │               │   ├── Activity2_ConsonantMapDrop.test.jsx
│   │               │   ├── ConsonantChartExercise.jsx
│   │               │   ├── chartData.js
│   │               │   ├── level_1/      # Visible headings; place consonants
│   │               │   ├── level_2/      # Place headings and consonants
│   │               │   ├── level_3/      # Match words to first consonant sounds
│   │               │   └── index.js
│   │               ├── mystery_sound/
│   │               │   ├── Activity4_MysterySound.jsx
│   │               │   ├── Activity4_MysterySound.test.jsx
│   │               │   ├── questions.js
│   │               │   ├── questions.test.js
│   │               │   └── index.js
│   │               ├── vowel_map_drop/
│   │               │   ├── LevelSummary.jsx
│   │               │   ├── level_1/      # Vowel placement
│   │               │   ├── level_2/      # Word-to-vowel matching
│   │               │   ├── Activity1_VowelMapDrop.jsx
│   │               │   ├── Activity1_VowelMapDrop.test.jsx
│   │               │   └── index.js
│   │               └── vowel_detective/
│   │                   ├── Activity5_VowelDetective.jsx
│   │                   ├── Activity5_VowelDetective.test.jsx
│   │                   ├── questions.js
│   │                   ├── questions.test.js
│   │                   └── index.js
│   └── package.json
└── README.md
```

## IPA Feature Organization

`IPA_Page.jsx` is a small page-level component that arranges four feature areas:

```text
Vowels, Consonants, IPA Keyboard, Practice Space
```

Each major feature is stored in its own folder with a local `index.js`. Tests are colocated with the components or data they verify.

### Sound Listening

The Canadian English vowel and consonant charts play an example recording when a symbol is selected. Each main chart symbol also displays its articulatory description and example word beneath the audio player, with the spelling associated with the selected sound underlined. Descriptions and recording mappings are maintained in `sound_listening/ipaData.js`, while vowel-chart coordinates are shared through `vowelChartPositions.js`.

### Practice Space

The Practice Space contains five activity packages:

1. **Vowel Map Drop** — Place vowels on the blank Canadian English vowel chart.
2. **Consonant Map Drop** — Place consonants on a blank chart organized by manner and place of articulation.
3. **Build the Sound** — Identify consonants from their voicing, place, and manner features.
4. **Mystery Sound** — Identify a consonant using progressively revealed clues. Correct guesses earn 300, 200, or 100 points depending on the clues used.
5. **Vowel Detective** — Identify vowels from type, height, backness, and rounding features.

The two map activities come first as foundational practice. More advanced activities remain available without requiring completion of the maps; Vowel Map Drop unlocks word matching after a Level 1 score of 70% or above (10/14).

### Consonant Map Drop

Activity 2 has three levels. Levels 1 and 3 have three-minute timers; Level 2 has a five-minute timer.

1. **Place Consonants:** Row and column headings are visible. Drag the 25 consonant tiles into the correct positions.
2. **Complete the Chart:** The chart starts with empty row and column headings as well as empty consonant positions. Place 8 column labels, 7 row labels, and 25 consonant tiles (40 matches total). The shuffled banks separate place labels, manner labels, and consonants.
3. **Match Words:** The completed consonant chart is visible. Match all 24 words using the supplied answer key below. The activity displays the requested first-consonant instructions; the supplied key includes some written or noninitial consonant matches.

The charts reuse the listening chart's manner rows, place columns, and consonant positions. Voiceless consonants go on the left and voiced consonants on the right in paired positions. Levels 1 and 2 include two interchangeable /w/ tiles for the bilabial and velar glide positions. In Level 3, *one* goes to the /w/ target in the velar glide cell.

All levels support drag-and-drop, click or keyboard selection, Undo, reset, scoring, and answer review. Incorrectly typed tiles cannot be placed into a different kind of target (for example, a column label cannot fill a consonant position). Check chart is available when every target is filled. Timeout grades missing matches as incorrect and locks the attempt. Try again clears the chart and restarts the timer. Switching levels preserves the current attempt and pauses its timer; students unlock the next level only after scoring 70% or above on the preceding level (18/25 in Level 1 and 28/40 in Level 2). Earned unlocks are remembered in the browser.

**Level 3 word bank:** psychology • lamb • two • Wednesday • chemistry • ghost • phone • view • theory • those • city • xylophone • chef • genre • question • giant • mnemonic • knee • who • write • university • one • llama • singer

| Supplied IPA target | Word |
| --- | --- |
| /p/ | psychology |
| /b/ | lamb |
| /t/ | two |
| /d/ | Wednesday |
| /k/ | chemistry |
| /g/ | ghost |
| /f/ | phone |
| /v/ | view |
| /θ/ | theory |
| /ð/ | those |
| /s/ | city |
| /z/ | xylophone |
| /ʃ/ | chef |
| /ʒ/ | genre |
| /tʃ/ | question |
| /dʒ/ | giant |
| /m/ | mnemonic |
| /n/ | knee |
| /h/ | who |
| /ɹ/ | write |
| /j/ | university |
| /w/ | one |
| /l/ | llama |
| /ŋ/ | singer |

The implementation is split into `consonant_map_drop/level_1/`, `level_2/`, and `level_3/`. `ConsonantChartExercise.jsx` shares placement, Undo, timer, and grading behavior. `chartData.js` derives chart positions and headings from `sound_listening/ipaData.js`; `level_3/wordData.js` stores the first-consonant word key.

### Activities 1–5: Layout

Vowel Map Drop, Consonant Map Drop, Build the Sound, Mystery Sound, and Vowel Detective use a consistent, moderately enlarged interface. Instructions, headings, timers, navigation, word banks, chart targets, and summary tables have larger text or spacing. Answer cards have a balanced height rather than stretching to fill the screen. On narrow screens, quiz answers use two columns with more compact spacing.

The shared `.practice-activity-roomy` styles in `my-app/src/App.css` apply to Activities 2–5. Activity 1 retains its existing layout. Timers, scoring, and progression rules are unchanged.

### Activity Timers

A clock icon and countdown appear to the left of the question, round, or placement count on the right side of each activity header.

| Activity | Time limit |
| --- | --- |
| Build the Sound | 30 seconds per question |
| Vowel Map Drop — Level 2 | 3 minutes per word-matching attempt |
| Mystery Sound | 30 seconds per round |
| Vowel Map Drop | 3 minutes per chart attempt |
| Consonant Map Drop — Levels 1 and 3 | 3 minutes per level attempt |
| Consonant Map Drop — Level 2 | 5 minutes per level attempt |
| Vowel Detective | 30 seconds per question |

The countdown stops when an answer or attempt is submitted. New questions and rounds receive a fresh countdown; returning to an unfinished question resumes its remaining time. The timer turns red during the final 10 seconds.

When time expires, Level 1 and Vowel Detective record the question as incorrect and reveal the answer. Mystery Sound ends the round without awarding points. The chart activities stop accepting changes and show a review of the current placements, including missing answers. Restarting an attempt resets its timer.

### Build the Sound

Build the Sound selects 10 consonant questions and shuffles their answer choices. Students identify the symbol matching the supplied voicing, manner, and place features.

- **Previous** and **Next** allow navigation while preserving responses within the current session.
- Selecting a choice does not submit it; students must use **Check answer**.
- **View summary** appears once every question has been submitted or timed out. Skipped questions must be completed first.
### Vowel Map Drop: Level 1

Place all 14 vowels on the chart. A score of **70% or above (at least 10 out of 14)** unlocks Level 2. Both levels have three-minute timers. Earned unlocks are retained, and switching levels preserves placements and pauses the inactive timer.

### Vowel Map Drop: Level 2 — Match the Words to the Vowels

Drag each word from the word bank to the vowel that represents its **first vowel sound**.

**IMPORTANT:** Some words contain more than one vowel sound. Focus only on **the first vowel sound** in each word.

The completed chart shows vowel symbols, front/central/back columns, high/mid/low rows, and dividing lines in the style of Activity 1. Students can drag words or select a word and then a vowel using a mouse, touch, or keyboard.

- Select a placed word to move it. Replacing a word returns the displaced word to the bank.
- **Undo** reverses placement changes one at a time without resetting the timer.
- **Reset words** clears placements and Undo history and starts a fresh three-minute attempt.
- **Check matches** becomes available after all 14 words are placed.
- Submission or timeout shows the score and corrections. **Try again** starts a new attempt.

<details>
<summary>Instructor answer key</summary>

| Vowel | Word |
| --- | --- |
| /i/ | fleece |
| /ɪ/ | kit |
| /ej/ | face |
| /ɛ/ | dress |
| /æ/ | trap |
| /ə/ | **a**bout |
| /ʌ/ | strut |
| /u/ | goose |
| /ʊ/ | foot |
| /ow/ | goat |
| /ɑ/ | palm |
| /aj/ | prize |
| /aw/ | loud |
| /ɔj/ | choice |

</details>

### Overall Grades and Time Summary

**Overall summary** in the Vowel Map Drop navigation displays the latest completed attempt for each level:

- Correct answers out of the total and a percentage grade.
- Completion, locked, or timeout status.
- Active working time in minutes and seconds.

After both levels are complete, it also displays the combined grade and total working time. The combined grade uses **total correct answers ÷ total possible answers**, normally out of 28 (14 Level 1 placements and 14 Level 2 matches); it is not an unweighted average of the two percentages.

Working time excludes answer review and time spent on the overall summary. Opening the overall summary pauses the active attempt and preserves it when returning. Retrying a level replaces its saved grade and time only when the new attempt is completed.

Level 2 unlock status and the latest completed results are stored in the current browser's local storage. They are not synced to a student account or another browser. Clearing browser storage removes these saved results. In-progress attempts are not saved across reloads. Older saved results without timing data display **Not recorded**.

### Vowel Map Drop Code Organization

- `vowel_map_drop/Activity1_VowelMapDrop.jsx` coordinates level selection, the 70% unlock, and saved results.
- `vowel_map_drop/level_1/` contains the vowel placement chart. Build the Sound remains a standalone consonant quiz with its answer summary.
- `vowel_map_drop/level_2/` contains word matching, the word bank and answer key, and tests.
- `LevelSummary.jsx` renders grades and elapsed time across both levels.
- `useLevelTime.js` measures active working time.
- `practice_space/QuestionTimer.jsx` provides the shared countdown used by all five activities.
- `practice_space/QuizSummary.jsx` provides the question-by-question review used by Level 1 and Vowel Detective.

Tests cover the 70% unlock boundary, word matching, Undo, timer expiry and reset, summary navigation, combined grades, active time, and saved results. To run the vowel levels, Build the Sound, and timer tests from `my-app`:

```bash
npm run test:run -- src/pages/ipa/practice_space/vowel_map_drop src/pages/ipa/practice_space/build_the_sound src/pages/ipa/practice_space/QuestionTimer.test.jsx src/pages/ipa/practice_space/ActivityTimers.test.jsx
```

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` installs and builds the application from `my-app`, then deploys `my-app/dist` to GitHub Pages.

Exactly 70% unlocks the next level in Activities 1 and 2. The minimum passing scores are 18/25 and 28/40 in Consonant Map Drop, and 10/14 in Vowel Map Drop.

### Consonant Map Drop Overall Summary

Activity 2's **Overall summary** shows the latest completed score, percentage, status, and active working time for each of its three levels. After all three levels are completed, it shows a combined grade (total correct out of 89 matches: 25 + 40 + 24) and total time. Working time excludes answer review, inactive levels, and the overall summary.

Opening the summary preserves placements and pauses the current timer. Results and earned unlocks are saved in this browser. Retrying a level replaces its summary result on completion, without revoking an already-earned unlock. Level 2 requires 70% or above in Level 1; Level 3 requires 70% or above in Level 2.

Vowel Map Drop uses the same activity title, level navigation, control sizing, and spacing as the following activities. Each vowel level has its own heading beneath the level buttons, and both charts use a consistent responsive height.
