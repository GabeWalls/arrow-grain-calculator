function calculateTotalGrains(components) {
  let total = 0;

  for (const component of components) {
    // Validate grains is a positive number
    // This matters because: Looping (iteration), Basic algorithmic checks, Custom error handling
    const grains = parseFloat(component.grains);
    if (isNaN(grains) || grains < 0) {
      throw new Error(`Invalid grain value for component: ${component.name}`);
    }
    total += grains;
  }

  return total;
}

module.exports = calculateTotalGrains;
