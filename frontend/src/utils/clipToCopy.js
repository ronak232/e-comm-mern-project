export const handleCopyToClipBoard = (copyRef) => {
  if (copyRef && copyRef.current) {
    const text = copyRef.current?.innerText;
    navigator.clipboard
      .writeText(text)
      .then((resp) => {
        alert("Coped to clipboard")
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
};