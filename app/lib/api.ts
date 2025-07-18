// import { TECHNOLOGIES } from './data';

// export async function searchTechnologies(query: string, category?: string) {
//   await new Promise((resolve) => setTimeout(resolve, 500)); // simulate latency

//   if (!query || query.trim().length < 2 || query.length > 100) return [];
//   if (/[^a-zA-Z0-9\s]/.test(query)) return [];

//   let results = TECHNOLOGIES.filter((item) =>
//     item.title.toLowerCase().includes(query.toLowerCase()) ||
//     item.description.toLowerCase().includes(query.toLowerCase())
//   );

//   if (category) {
//     results = results.filter((item) => item.category === category);
//   }

//   return results;
// }


export async function searchTechnologies(query: string, category?: string) {
  // Guard Clauses
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

    // if (category) {
    //   return data.filter((item: any) => item.category === category);
    // }

    console.log('Results:', data);
    return data;
  } catch (err) {
    console.error('Failed to fetch search results:', err);
    return [];
  }
}
