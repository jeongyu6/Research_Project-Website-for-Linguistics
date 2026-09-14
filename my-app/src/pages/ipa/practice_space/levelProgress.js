export function qualifiesForNextLevel(score, total) {
  return Number.isInteger(score) && Number.isInteger(total) && total > 0 && score >= 0 && score <= total && score * 10 >= total * 7
}
