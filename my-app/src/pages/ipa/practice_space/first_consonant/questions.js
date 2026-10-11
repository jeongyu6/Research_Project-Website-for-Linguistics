const recordings = import.meta.glob('../../../../../Recordings_for_Practice_Activity/{book,do,food,gin,hat,key,long,mop,nod,pull,run,seal,shin,took,veal,well,yell,zoned,cheese,thick}.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

export const firstConsonantQuestions = [
  ['book', 'b', ['p', 'b', 'd', 'm']],
  ['do', 'd', ['t', 'ɡ', 'n', 'd']],
  ['food', 'f', ['f', 'v', 'p', 'θ']],
  ['gin', 'dʒ', ['ɡ', 'ʒ', 'dʒ', 'tʃ']],
  ['hat', 'h', ['k', 'h', 'f', 'ʃ']],
  ['key', 'k', ['ɡ', 't', 's', 'k']],
  ['long', 'l', ['l', 'ɹ', 'n', 'w']],
  ['mop', 'm', ['n', 'b', 'm', 'p']],
  ['nod', 'n', ['m', 'n', 'ŋ', 'd']],
  ['pull', 'p', ['b', 'f', 't', 'p']],
  ['run', 'ɹ', ['ɹ', 'l', 'w', 'j']],
  ['seal', 's', ['z', 'ʃ', 's', 'θ']],
  ['shin', 'ʃ', ['s', 'ʃ', 'tʃ', 'ʒ']],
  ['took', 't', ['d', 'k', 'θ', 't']],
  ['veal', 'v', ['v', 'f', 'b', 'w']],
  ['well', 'w', ['v', 'ɹ', 'w', 'j']],
  ['yell', 'j', ['dʒ', 'j', 'w', 'l']],
  ['zoned', 'z', ['s', 'ʒ', 'dʒ', 'z']],
  ['cheese', 'tʃ', ['tʃ', 'ʃ', 'dʒ', 'k']],
  ['thick', 'θ', ['t', 'ð', 'θ', 'f']],
].map(([word, answer, choices]) => ({
  word, answer, choices, audioSrc: recordings[`../../../../../Recordings_for_Practice_Activity/${word}.mp3`],
}))
