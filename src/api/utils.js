export function refactorTimeZones(timeZones) {
  return timeZones.map((value) => ({
    title: value.slice(value.indexOf("/") + 1).replaceAll("_", " "),
    value,
  }));
}
