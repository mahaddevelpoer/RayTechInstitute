import { authoredFoundationTopics } from './catalog.mjs';
import { authoredPythonTopics } from './python/topics.mjs';
export async function authoredCourseTopics() { return [...await authoredFoundationTopics(), ...authoredPythonTopics()]; }
