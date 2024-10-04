export const getImageUrl = (pathUrl: string) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  try {
    // Check if the file exists in the directory
    if (pathUrl) {
      return `${baseURL}/static/images/${pathUrl}`;
    } else {
      console.error("File does not exist");
      return null;
    }
  } catch (err) {
    console.error("Error reading the file:", err);
    return null;
  }
};
