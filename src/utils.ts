export function openWithBrowser(url: string, queryParams: Record<string, string> = {}): void {
  const params = [];
  for (const [ key, value ] of Object.entries(queryParams)) {
    params.push(`${key}=${value}`);
  }
  window.open(`${url}?${params.join('&')}`);
}
