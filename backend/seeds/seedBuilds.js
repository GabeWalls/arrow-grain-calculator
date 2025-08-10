require('dotenv').config();
const mongoose = require('mongoose');
const ArrowBuild = require('../models/ArrowBuild');

function rand(min, max, step = 1) {
  const n = Math.floor((Math.random() * (max - min)) / step) * step + min;
  return Number(n.toFixed(2));
}

function randomBuild(i) {
  const arrowLength = rand(10, 40, 0.25);
  const gpi = rand(4, 13, 0.01);
  const shaft = Number((gpi * arrowLength).toFixed(2));
  const knock = rand(6, 15);
  const insert = rand(10, 60);
  const tip = rand(75, 200);
  const fletching = rand(12, 30);

  const components = [
    { name: 'knock', grains: knock },
    { name: 'fletching', grains: fletching },
    { name: 'shaft', grains: shaft },
    { name: 'insert', grains: insert },
    { name: 'tip', grains: tip }
  ];
  const totalGrains = components.reduce((s, c) => s + c.grains, 0);

  return {
    name: `Seed Build ${i + 1}`,
    components,
    totalGrains,
    gpi,
    arrowLength
  };
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ArrowBuild.deleteMany({});
    const docs = Array.from({ length: 75 }, (_, i) => randomBuild(i));
    await ArrowBuild.insertMany(docs, { ordered: false });
    console.log('Seeded 75 builds.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();