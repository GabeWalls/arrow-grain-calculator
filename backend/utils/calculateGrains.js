function calculateTotalGrains(components) {
  let total = 0;

  for (const component of components) {
    const grains = parseFloat(component.grains);
    if (!isNaN(grains)) {
      total += grains;
    }
  }

  return total;
}

module.exports = calculateTotalGrains;
