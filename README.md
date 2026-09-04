# Digital Linguistics Resources

This research project provides interactive learning resources for linguistics students. It is being developed with Professor Saffieh for the University of Toronto Scarborough Department of Language Studies.

The website currently includes:

- An interactive Canadian English vowel chart with audio recordings, articulatory descriptions, and example words
- An interactive Canadian English consonant chart with audio recordings, articulatory descriptions, and example words
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
│   │       │   │   ├── UnderlinedExample.jsx
│   │       │   │   ├── Vowels.jsx
│   │       │   │   ├── Vowels.test.jsx
│   │       │   │   ├── Consonants.jsx
│   │       │   │   ├── Consonants.test.jsx
│   │       │   │   ├── ipaData.js
│   │       │   │   ├── vowelChartPositions.js
│   │       │   │   └── index.js
│   │       │   └── practice_space/
│   │       │       ├── PracticeSpace.jsx
│   │       │       ├── PracticeSpace.test.jsx
│   │       │       ├── QuizSummary.jsx
│   │       │       ├── index.js
│   │       │       ├── build_the_sound/
│   │       │       │   ├── Activity1_BuildTheSound.jsx
│   │       │       │   ├── Activity1_BuildTheSound.test.jsx
│   │       │       │   ├── questions.js
│   │       │       │   ├── questions.test.js
│   │       │       │   └── index.js
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
│   │       └── treeform/
│   │           ├── Treeform_Page.jsx
│   │           ├── SyntaxTreeBuilder.jsx
│   │           └── index.js
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

The Practice Space contains four independent activity packages:

1. **Build the Sound** — Students identify consonants from voicing, manner, and place features.
2. **Mystery Sound** — Students identify a consonant from progressively revealed phonetic clues, with more points awarded for solving it sooner.
3. **Vowel Map Drop** — Students place vowels on the shared Canadian English vowel chart and review mistakes.
4. **Vowel Detective** — Students identify vowels from type, height, backness, and rounding features.

Activities 1 and 4 randomly select questions, shuffle answer choices, track scores, and display an end-of-session review. Activity 2 runs continuous scored rounds with optional clues and skipping. Activity 3 uses the same vowel coordinates as the listening chart.

### Syntax Tree Builder

The Tree Builder supports creating and editing syntax trees in the browser, including common branching templates, terminals, features, movement links, and import/export controls.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` installs and builds the application from `my-app`, then deploys `my-app/dist` to GitHub Pages.
