export function formatDateToLocal(timestamp) {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(timestamp).toLocaleString("en-US", options);
}
