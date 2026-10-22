import test from "node:test";
import assert from "node:assert/strict";
import { fetchCatalogRows } from "./catalog-fetch.mjs";
import { readFile } from "node:fs/promises";

test("static publication uses only the private build credential", async () => {
  const source = await readFile(new URL('./generate-static-data.mjs', import.meta.url), 'utf8');
  assert.match(source, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /fetchCatalogRows\(supabaseUrl, snapshotKey, name\)/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
});

test("fetches every MCQ beyond the API row limit, in stable order", async () => {
  const source = Array.from({ length: 1201 }, (_, id) => ({ id }));
  let calls = 0;
  const result = await fetchCatalogRows(
    "https://example.test",
    "test-key",
    "mcqs",
    async (url) => {
      calls++;
      const query = new URL(url).searchParams;
      assert.equal(query.get("order"), "id.asc");
      const offset = Number(query.get("offset"));
      return Response.json(
        source.slice(offset, offset + Number(query.get("limit"))),
      );
    },
  );
  assert.deepEqual(result, source);
  assert.equal(calls, 3);
});
test("deleting the final record stays empty and does not resurrect demo content", async () => {
  assert.deepEqual(
    await fetchCatalogRows("https://example.test", "key", "blogs", async () =>
      Response.json([]),
    ),
    [],
  );
});
test("an unavailable table fails the build instead of publishing an empty snapshot", async () => {
  await assert.rejects(
    fetchCatalogRows(
      "https://example.test",
      "key",
      "blogs",
      async () => new Response("", { status: 503 }),
    ),
    /snapshot fetch failed/,
  );
});
test("a malformed response is not treated as deletion", async () => {
  await assert.rejects(
    fetchCatalogRows("https://example.test", "key", "blogs", async () =>
      Response.json({ error: "bad" }),
    ),
    /invalid snapshot/,
  );
});
