
async function calculateAverageRating(newRating, oldRating) {

  if (typeof newRating !== 'number' || typeof oldRating !== 'number') {
    throw new Error('Both newRating and oldRating should be numbers');
  }

  return oldRating===0? newRating: (newRating + oldRating) / 2;
}

module.exports = calculateAverageRating;