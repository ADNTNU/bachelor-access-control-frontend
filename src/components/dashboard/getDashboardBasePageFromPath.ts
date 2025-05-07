export default function getDashboardBasePageFromPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return "";
  }
  const basePageSegment = segments[2] ?? "";
  return basePageSegment;
}
