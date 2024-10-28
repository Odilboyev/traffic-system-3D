export const fixIncompleteJSON = (message) => {
  // Check if message starts with "{" and doesn't end with "}"
  if (message.startsWith("{") && !message.endsWith("}")) {
    // Count opening and closing braces
    const openBracesCount = (message.match(/{/g) || []).length;
    const closeBracesCount = (message.match(/}/g) || []).length;

    // If there are more opening braces than closing braces, add the missing closing braces
    if (openBracesCount > closeBracesCount) {
      const missingBraces = openBracesCount - closeBracesCount;
      message += "}".repeat(missingBraces);
    }
  }

  return message;
};
