/**
 * In-memory data store for techniques.
 * Replace this module with a real database adapter (e.g. Prisma, MongoDB)
 * when you are ready to persist data.
 */

let nextId = 1;

/** @type {Array<{id: number, technique: string, category: string, description: string}>} */
const techniques = [];

module.exports = { techniques, getId: () => nextId++ };
