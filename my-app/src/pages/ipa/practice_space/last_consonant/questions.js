const recordings = import.meta.glob('../../../../../Recordings_for_Practice_Activity/{nibs,book,calf,cheese,beige,fang,breath,breathe,feel,gym,gin,hit,hug,mesh,mop,nod,rich,edge,loose,roof}.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

export const lastConsonantQuestions = [
  ['nibs', 'z'], ['book', 'k'], ['calf', 'f'], ['cheese', 'z'], ['beige', 'ʒ'],
  ['fang', 'ŋ'], ['breath', 'θ'], ['breathe', 'ð'], ['feel', 'l'], ['gym', 'm'],
  ['gin', 'n'], ['hit', 't'], ['hug', 'ɡ'], ['mesh', 'ʃ'], ['mop', 'p'],
  ['nod', 'd'], ['rich', 'tʃ'], ['edge', 'dʒ'], ['loose', 's'], ['roof', 'f'],
].map(([word, answer]) => ({
  word, answer, audioSrc: recordings[`../../../../../Recordings_for_Practice_Activity/${word}.mp3`],
}))
