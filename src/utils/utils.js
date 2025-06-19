

export default function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export const getPublicIdFromUrl = (url) => {
    // Extract the part of the URL after 'upload/' and before the file extension
    let publicId = url
      .replace(/^.*\/upload\/(?:v[0-9]+\/)?/, '')  // Removes everything up to and including 'upload/v123456/'
      .replace(/\.[^/.]+$/, '');  // Removes the file extension (e.g., .jpg, .mp3, etc.)
    // Decode the URL-encoded string to convert %20 back to spaces or other characters
    return decodeURIComponent(publicId);
};
  