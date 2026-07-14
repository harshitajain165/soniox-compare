const displayNames = new Intl.DisplayNames(["en"], { type: "language" });

export function getLanguageName(code: string): string {
  try {
    return displayNames.of(code) || code;
  } catch {
    return code;
  }
}
