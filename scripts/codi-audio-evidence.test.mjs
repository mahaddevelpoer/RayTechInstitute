import test from 'node:test';
import assert from 'node:assert/strict';
import {savedAudioSource} from './codi-audio-evidence.mjs';
const base='https://raytechinstitute.web.app';
const hash='b5353b75671a0f7ddf72a72d94ff06cb1fed86f49a6c1fd9d28b0cca6827bda8';
const prepared={url:`${base}/codi/audio/${hash}.mp3`,status:200,contentType:'audio/mpeg'};
const storage={url:`https://btxrkhwyugzliswznkpx.supabase.co/storage/v1/object/public/codi-lesson-audio/${hash}.json`,status:200,contentType:'application/json; charset=utf-8'};
test('saved speech evidence accepts Firebase MP3 and Supabase recordings for the selected sentence',()=>{
  assert.equal(savedAudioSource(prepared,hash,base),'prepared');
  assert.equal(savedAudioSource(storage,hash,base),'storage');
});
test('failed requests, HTML fallbacks, unrelated sentences and other origins are not audio evidence',()=>{
  for(const response of [
    {...prepared,status:404}, {...prepared,status:500},
    {...prepared,contentType:'text/html'}, {...storage,contentType:'text/html'},
    {...prepared,url:prepared.url.replace(hash,'a'.repeat(64))},
    {...storage,url:storage.url.replace(hash,'a'.repeat(64))},
    {...prepared,url:prepared.url.replace(base,'https://other.example')},
    {...storage,url:storage.url.replace('btxrkhwyugzliswznkpx','other')},
    {...prepared,url:'invalid URL'},
  ])assert.equal(savedAudioSource(response,hash,base),null);
  assert.equal(savedAudioSource(prepared,'invalid',base),null);
});
