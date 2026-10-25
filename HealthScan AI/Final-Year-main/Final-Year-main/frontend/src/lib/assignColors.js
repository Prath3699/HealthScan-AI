export function assignRandomColors(
  events,
  palette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731", "#A29BFE"]
) {
  return events.map((event) => {
    const randomColor = palette[Math.floor(Math.random() * palette.length)];
    return { ...event, color: randomColor, textColor: "#FFFFFF" };
  });
}
