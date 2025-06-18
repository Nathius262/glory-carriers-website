// src/config/handlebarsHelpers.js

export default function registerHelpers(handlebars) {
  handlebars.registerHelper('gt', (a, b) => a > b);
  handlebars.registerHelper('lt', (a, b) => a < b);
  handlebars.registerHelper('eq', (a, b) => a === b);
  handlebars.registerHelper('notEqual', (a, b) => a !== b);
  handlebars.registerHelper('add', (a, b) => a + b);
  handlebars.registerHelper('subtract', (a, b) => a - b);
  handlebars.registerHelper('not', value => !value);
  handlebars.registerHelper('findPrimaryOrFirst', function (images) {
    const primary = images.find(img => img.is_primary);
    return primary || images[0];
  });

  handlebars.registerHelper('findAlternateImage', function (images) {
    const mainImage = images.find(img => img.is_primary) || images[0];
    return images.find(img => img.url !== mainImage.url) || mainImage;
  });
  handlebars.registerHelper('range', (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  });
  handlebars.registerHelper('truncate', (text, wordCount) => {
    if (typeof text !== 'string') return '';
    const words = text.split(' ');
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  });
  handlebars.registerHelper('has', (set, value) => set.has(value));
  handlebars.registerHelper('anyImageIsPrimary', images => images.some(image => image.is_primary));
  handlebars.registerHelper('hasRoleByName', function (roles, roleName, options) {
    const hasRole = roles && roles.some(role => role.name === roleName);
    return hasRole ? options.fn(this) : options.inverse(this);
  });
  handlebars.registerHelper('set', function (varName, varValue, options) {
    if (!options.data.root) options.data.root = {};
    options.data.root[varName] = varValue;
  });
}
