// src/config/handlebarsHelpers.js
import truncate from 'truncate-html';

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
  handlebars.registerHelper('truncateHTML', (html, wordCount) => {
    if (typeof html !== 'string') return '';

    // Strip HTML tags to count words correctly
    const textOnly = html.replace(/<[^>]+>/g, '');
    const words = textOnly.split(/\s+/);

    if (words.length <= wordCount) {
      return html; // no need to truncate
    }

    // Take first N words and rebuild safe HTML around them
    const truncatedText = words.slice(0, wordCount).join(' ');

    // Truncate the original HTML at the word boundary
    return truncate(html, truncatedText.length, { ellipsis: '...' });
  });
  handlebars.registerHelper('formatDateTime', function (date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  });
  handlebars.registerHelper('formatDateForInput', function (date) {
    if (!date) return "";
    const d = new Date(date);

    // Adjust for timezone offset to get local time ISO string
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

    return localISOTime;
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
  handlebars.registerHelper('contains', function (categoryId, categoryArray) {
    if (!categoryArray || !Array.isArray(categoryArray)) return false;

    return categoryArray.some(function (category) {
      return category.id === categoryId;
    });
  });
  handlebars.registerHelper('stripTags', function (html) {
    return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  });
  handlebars.registerHelper('formatDate', function (date) {
    return new Date(date).toLocaleDateString();
  });
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  /**
     * -----------------------------
     * YOUTUBE DETECTION
     * -----------------------------
     */
  handlebars.registerHelper("isYoutube", function (url = "") {
    return /youtu\.be|youtube\.com/.test(url);
  });

  handlebars.registerHelper("youtubeEmbedUrl", function (url = "") {
    let videoId = "";

    // youtu.be/{id}
    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop().split("?")[0];
    }

    // youtube.com/watch?v={id}
    else if (url.includes("watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }

    // youtube.com/live/{id}
    else if (url.includes("/live/")) {
      videoId = url.split("/live/")[1].split("?")[0];
    }

    return `https://www.youtube.com/embed/${videoId}`;
  });


  /**
   * -----------------------------
   * FACEBOOK DETECTION
   * -----------------------------
   */
  handlebars.registerHelper("isFacebook", function (url = "") {
    return /facebook\.com/.test(url);
  });


  /**
   * -----------------------------
   * FACEBOOK EMBED BUILDER
   * -----------------------------
   */
  handlebars.registerHelper("facebookEmbedUrl", function (url = "") {

    if (!url) return "";

    const cleanUrl = url.replace("web.facebook.com", "www.facebook.com");

    // extract ID
    const match =
      cleanUrl.match(/\/videos\/(\d+)/) ||
      cleanUrl.match(/[?&]v=(\d+)/);

    if (!match) return "";

    const videoId = match[1];

    // 🔥 IMPORTANT: use watch URL (most stable for embed)
    const watchUrl = `https://www.facebook.com/watch/?v=${videoId}`;

    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(watchUrl)}&show_text=false&width=560`;
  });

  handlebars.registerHelper( "formatNumber",  function(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    return new Intl.NumberFormat("en-NG").format(Number(value));
  });

  handlebars.registerHelper( "formatCurrency",  function(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(value));
  });

  handlebars.registerHelper("inc", function(value) {
    return Number(value) + 1;
  });

}
