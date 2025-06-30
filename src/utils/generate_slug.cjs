const slugify = require('slugify');

/**
 * Generates a unique slug for a given model based on a name.
 * @param {string} name - The name to generate a slug from.
 * @param {Model} model - The Sequelize model to check uniqueness against.
 * @returns {string} - A unique slug for the specified model.
 */
async function generateUniqueSlug(name, model) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let suffix = 1;

  // Check if a record with the generated slug already exists in the specified model
  while (await model.findOne({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return uniqueSlug;
}

module.exports = generateUniqueSlug;