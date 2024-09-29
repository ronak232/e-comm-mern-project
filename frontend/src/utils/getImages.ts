export const getImageUrl = (pathUrl: string) => {
  try {
    // Check if the file exists in the directory
    if (pathUrl) {
      return `/static/images/${pathUrl}`;
    } else {
      console.error("File does not exist");
      return null;
    }
  } catch (err) {
    console.error("Error reading the file:", err);
    return null;
  }
};
