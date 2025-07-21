export async function searchTechnologies(query: string, category?: string) {
  if (!query || query.trim().length < 2 || query.length > 100) return [];
  if (/[^a-zA-Z0-9\s]/.test(query)) return [];

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://frontend-test-api.digitalcreative.cn/?no-throttling=true&search=${encodedQuery}`;
  console.log("Api: ", url);

  try {
    console.log("fetching...");
    const res = await fetch(url);
    console.log("fetched!", res);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Results:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch search results:", err);
    return [];
  }
}
