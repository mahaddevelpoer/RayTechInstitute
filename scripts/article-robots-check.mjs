import assert from 'node:assert/strict';
export function checkArticleRobots(html,route){
 const noindex=/<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i.test(html);
 if(noindex)assert.ok(!/<meta[^>]*name="googlebot"[^>]*content="[^"]*\bindex\b/i.test(html),route+' contradictory googlebot');
 return noindex;
}
