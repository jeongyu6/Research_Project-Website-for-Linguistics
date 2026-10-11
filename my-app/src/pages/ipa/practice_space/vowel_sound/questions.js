const recordings = import.meta.glob('../../../../../Recordings_for_Practice_Activity/{feel,hit,fed,hat,food,book,cut,mop,face,sew,my,now,boy,key,gym,mesh,fang,full,hug,coy}.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

export const vowelSoundQuestions = [
  ['feel', 'i'], ['hit', 'ɪ'], ['fed', 'ɛ'], ['hat', 'æ'], ['food', 'u'],
  ['book', 'ʊ'], ['cut', 'ʌ'], ['mop', 'ɑ'], ['face', 'ej'], ['sew', 'ow'],
  ['my', 'aɪ'], ['now', 'aw'], ['boy', 'ɔj'], ['key', 'i'], ['gym', 'ɪ'],
  ['mesh', 'ɛ'], ['fang', 'æ'], ['full', 'ʊ'], ['hug', 'ʌ'], ['coy', 'ɔj'],
].map(([word, answer]) => ({
  word, answer, audioSrc: recordings[`../../../../../Recordings_for_Practice_Activity/${word}.mp3`],
}))
