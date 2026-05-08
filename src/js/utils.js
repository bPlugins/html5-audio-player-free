export function toHHMMSS(time) {
  if (isNaN(time) || time === Infinity) {
    return "00:00";
  }
  var sec_num = parseInt(time, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

export function generateKeyFromUrl(url) {
  if (!url) return;
  if (typeof url === 'object' && url.sources && url.sources.length > 0) {
    url = url.sources[0].src;
  }
  try {
    // try to make url absolute if it's relative
    let absoluteUrl = url;
    if (!absoluteUrl.startsWith('http')) {
        absoluteUrl = window.location.origin + (absoluteUrl.startsWith('/') ? '' : '/') + absoluteUrl;
    }
    // Extract the last part of the path (the "name")
    const pathParts = new URL(absoluteUrl).pathname.split("/"); // Split the path into parts
    const name = pathParts.filter((part) => part.length > 0).pop(); // Get the last non-empty part

    if (!name) {
      throw new Error("No valid name found in the URL path");
    }

    // Generate a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = (hash << 5) - hash + char; // Simple hash algorithm
      hash |= 0; // Convert to 32-bit integer
    }

    // Convert the hash to a base-36 string (alphanumeric)
    const uniqueKey = Math.abs(hash).toString(36);

    // Optionally truncate the key to a specific length (e.g., 8 characters)
    return uniqueKey.substring(0, 8);
  } catch (error) {
    //eslint-disable-next-line no-console
    console.warn(error.message);
  }
}
