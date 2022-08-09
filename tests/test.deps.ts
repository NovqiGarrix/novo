export { assert, assertEquals, assertThrows, equal, assertNotEquals } from 'https://deno.land/std@0.149.0/testing/asserts.ts';
export { afterAll, beforeAll, describe, it } from 'https://deno.land/std@0.149.0/testing/bdd.ts';

export function getRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}