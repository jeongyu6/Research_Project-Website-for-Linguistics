# Digital Linguistics Resources

This research project provides interactive learning resources for linguistics students. It is being developed with Professor Saffieh for the University of Toronto Scarborough Department of Language Studies.

The website currently includes:

- A Canadian English vowel chart with audio recordings
- A Canadian English consonant chart with audio recordings
- An interactive IPA keyboard and transcription editor
- A Practice Space containing four phonetics activities
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
│   │       ├── ipa/
│   │       │   ├── IPA_Page.jsx      # Composes all IPA sections
│   │       │   ├── index.js          # IPA package exports
│   │       │   ├── keyboard/
│   │       │   │   ├── IPAKeyboard.jsx
│   │       │   │   ├── IPAKeyboard.test.jsx
│   │       │   │   └── index.js
│   │       │   ├── sound_listening/
│   │       │   │   ├── Vowels.jsx
│   │       │   │   ├── Consonants.jsx
│   │       │   │   ├── ipaData.js
│   │       │   │   ├── vowelChartPositions.js
│   │       │   │   └── index.js
│   │       │   └── practice_space/
│   │       │       ├── PracticeSpace.jsx
│   │       │       ├── PracticeSpace.test.jsx
│   │       │       ├── QuestionTimer.jsx
│   │       │       ├── QuestionTimer.test.jsx
│   │       │       ├── ActivityTimers.test.jsx
│   │       │       ├── QuizSummary.jsx
│   │       │       ├── index.js
│   │       │       ├── build_the_sound/
│   │       │       │   ├── Activity1_BuildTheSound.jsx
│   │       │       │   ├── Activity1_BuildTheSound.test.jsx
│   │       │       │   ├── LevelSummary.jsx
│   │       │       │   ├── useLevelTime.js
│   │       │       │   ├── index.js
│   │       │       │   ├── level_1/
│   │       │       │   │   ├── Level1BuildTheSound.jsx
│   │       │       │   │   ├── Level1BuildTheSound.test.jsx
│   │       │       │   │   ├── level1Questions.js
│   │       │       │   │   └── level1Questions.test.js
│   │       │       │   └── level_2/
│   │       │       │       ├── Level2WordVowelMatch.jsx
│   │       │       │       ├── Level2WordVowelMatch.test.jsx
│   │       │       │       └── level2Words.js
│   │       │       ├── mystery_sound/
│   │       │       │   ├── Activity2_MysterySound.jsx
│   │       │       │   ├── Activity2_MysterySound.test.jsx
│   │       │       │   ├── questions.js
│   │       │       │   ├── questions.test.js
│   │       │       │   └── index.js
│   │       │       ├── vowel_map_drop/
│   │       │       │   ├── Activity3_VowelMapDrop.jsx
│   │       │       │   ├── Activity3_VowelMapDrop.test.jsx
│   │       │       │   └── index.js
│   │       │       └── vowel_detective/
│   │       │           ├── Activity4_VowelDetective.jsx
│   │       │           ├── Activity4_VowelDetective.test.jsx
│   │       │           ├── questions.js
│   │       │           ├── questions.test.js
│   │       │           └── index.js
│   │       └── treeform/.               # For edit later throughout the work
│   │           ├── Treeform_Page.jsx
│   │           ├── SyntaxTreeBuilder.jsx
│   │           └── index.js
│   └── package.json
└── README.md
```

## IPA Feature Organization

`IPA_Page.jsx` is a small page-level component that arranges four feature areas:

```text
Vowels, Consonants,  IPA Keyboard, Practice Space
```

Each major feature is stored in its own folder with a local `index.js`. Tests are colocated with the components or data they verify.

### Practice Space

The Practice Space contains four activity packages:

1. **Build the Sound** — A two-level activity: identify consonants, then match words to their first vowel sound.
2. **Mystery Sound** — Identify a consonant using progressively revealed clues. Correct guesses earn 300, 200, or 100 points depending on how many clues have been revealed.
3. **Vowel Map Drop** — Place vowels on the Canadian English vowel chart, undo placements, and review mistakes.
4. **Vowel Detective** — Identify vowels from type, height, backness, and rounding features.

### Activity Timers

A clock icon and countdown appear to the left of the question, round, or placement count on the right side of each activity header.

| Activity | Time limit |
| --- | --- |
| Build the Sound — Level 1 | 30 seconds per question |
| Build the Sound — Level 2 | 3 minutes per word-matching attempt |
| Mystery Sound | 30 seconds per round |
| Vowel Map Drop | 3 minutes per chart attempt |
| Vowel Detective | 30 seconds per question |

The countdown stops when an answer or attempt is submitted. New questions and rounds receive a fresh countdown; returning to an unfinished question resumes its remaining time. The timer turns red during the final 10 seconds.

When time expires, Level 1 and Vowel Detective record the question as incorrect and reveal the answer. Mystery Sound ends the round without awarding points. The chart activities stop accepting changes and show a review of the current placements, including missing answers. Restarting an attempt resets its timer.

### Build the Sound: Level 1

Level 1 selects 10 consonant questions and shuffles their answer choices. Students identify the symbol matching the supplied voicing, manner, and place features.

- **Previous** and **Next** allow navigation while preserving responses within the current session.
- Selecting a choice does not submit it; students must use **Check answer**.
- **View summary** appears once every question has been submitted or timed out. Skipped questions must be completed first.
- A score of **70% or higher (7 out of 10)** unlocks Level 2. The Level 1 summary includes **Continue to Level 2** after unlocking.

### Build the Sound: Level 2 — Match the Words to the Vowels

Drag each word from the word bank to the vowel that represents its **first vowel sound**.

**IMPORTANT:** Some words contain more than one vowel sound. Focus only on **the first vowel sound** in each word.

**Student word bank:** about • choice • dress • face • fleece • foot • goose • goat • kit • loud • palm • prize • strut • trap

The completed chart shows vowel symbols, front/central/back columns, high/mid/low rows, and dividing lines in the style of Activity 3. Students can drag words or select a word and then a vowel using a mouse, touch, or keyboard.

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

**Overall summary** in the Build the Sound navigation displays the latest completed attempt for each level:

- Correct answers out of the total and a percentage grade.
- Completion, locked, or timeout status.
- Active working time in minutes and seconds.

After both levels are complete, it also displays the combined grade and total working time. The combined grade uses **total correct answers ÷ total possible answers**, normally out of 24 (10 Level 1 questions and 14 Level 2 matches); it is not an unweighted average of the two percentages.

Working time excludes answer review and time spent on the overall summary. Opening the overall summary pauses the active attempt and preserves it when returning. Retrying a level replaces its saved grade and time only when the new attempt is completed.

Level 2 unlock status and the latest completed results are stored in the current browser's local storage. They are not synced to a student account or another browser. Clearing browser storage removes these saved results. In-progress attempts are not saved across reloads. Older saved results without timing data display **Not recorded**.

### Build the Sound Code Organization

- `build_the_sound/Activity1_BuildTheSound.jsx` coordinates level selection, the 70% unlock, and saved results.
- `level_1/` contains the original consonant quiz, its question data, and tests.
- `level_2/` contains word matching, the word bank and answer key, and tests.
- `LevelSummary.jsx` renders grades and elapsed time across both levels.
- `useLevelTime.js` measures active working time.
- `practice_space/QuestionTimer.jsx` provides the shared countdown used by all four activities.
- `practice_space/QuizSummary.jsx` provides the question-by-question review used by Level 1 and Vowel Detective.

Tests cover the 70% unlock boundary, word matching, Undo, timer expiry and reset, summary navigation, combined grades, active time, and saved results. To run the Build the Sound and timer tests from `my-app`:

```bash
npm run test:run -- src/pages/ipa/practice_space/build_the_sound src/pages/ipa/practice_space/QuestionTimer.test.jsx src/pages/ipa/practice_space/ActivityTimers.test.jsx
```

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` installs and builds the application from `my-app`, then deploys `my-app/dist` to GitHub Pages.
