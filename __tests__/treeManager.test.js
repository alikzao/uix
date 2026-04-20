import { TreeManager } from '../src/treeManager.js';

describe('TreeManager', () => {
    test('addNode inserts child under an existing parent', () => {
        const state = {
            items: [
                { _id: 'root', doc: { parentId: null }, childrens: [] }
            ]
        };
        const manager = new TreeManager(() => state);
        const child = { _id: 'child', doc: { parentId: 'root' }, childrens: [] };

        manager.addNode(child);

        expect(state.items[0].childrens).toContain(child);
    });

    test('addNode falls back to root when parent is missing', () => {
        const state = { items: [] };
        const manager = new TreeManager(() => state);
        const orphan = { _id: 'child', doc: { parentId: 'missing' }, childrens: [] };

        manager.addNode(orphan);

        expect(orphan.doc.parentId).toBe('-');
        expect(state.items).toContain(orphan);
    });

    test('removeNode removes nested nodes from the tree', () => {
        const child = { _id: 'child', doc: { parentId: 'root' }, childrens: [] };
        const state = {
            items: [
                { _id: 'root', doc: { parentId: null }, childrens: [child] }
            ]
        };
        const manager = new TreeManager(() => state);

        manager.removeNode('child');

        expect(state.items[0].childrens).toEqual([]);
    });

    test('updateNode patches doc fields in place', () => {
        const state = {
            items: [
                { _id: 'root', doc: { title: 'Old' }, childrens: [] }
            ]
        };
        const manager = new TreeManager(() => state);

        manager.updateNode('root', { title: 'New', status: 'ok' });

        expect(state.items[0].doc).toEqual({ title: 'New', status: 'ok' });
    });
});
