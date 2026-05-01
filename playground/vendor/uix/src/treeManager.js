export class TreeManager  {

    constructor(getState) {
        this.getState = getState;
    }

    makeTree(items) {
        items.forEach(item => item.childrens = []);
        const rootItems = [];
        items.forEach(item => {
            if (item.doc.parentId) {
                const parent = items.find(parentItem => parentItem._id === item.doc.parentId);
                if (parent) {
                    parent.childrens.push(item);
                }
            } else {
                rootItems.push(item);
            }
        });
        return items.filter(item => !item.doc.parentId);
    }

    removeNode(docId) {
        function recursiveRemove(docs, docId) {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i]._id === docId) {
                    docs.splice(i, 1);
                    return true;
                }
                if (docs[i].childrens && docs[i].childrens.length > 0) {
                    if (recursiveRemove(docs[i].childrens, docId)) {
                        return true;
                    }
                }
            }
            return false;
        }
        const state = this.getState();
        recursiveRemove(state.items, docId);
        return state.items;
    }

    addNode(newDoc) {
        // Recursively find a parent and insert the node in-place.
        function recursiveInsert(docs, newDoc) {
            for (let doc of docs) {
                if (doc._id === newDoc.doc.parentId) {
                    doc.childrens.push(newDoc);
                    return true;
                }
                if (doc.childrens && doc.childrens.length > 0) {
                    if (recursiveInsert(doc.childrens, newDoc)) {
                        return true;
                    }
                }
            }
            return false;
        }
        const state = this.getState();
        const inserted = recursiveInsert(state.items, newDoc);
        if (!inserted) {
            newDoc.doc.parentId = '-';
            state.items.push(newDoc);
        }
        return state.items;
    }

    updateNode(docId, options) {
        const state = this.getState();
        const recursiveUpdate = (nodes) => {
            for (let node of nodes) {
                if (node._id === docId) {
                    Object.assign(node.doc, options);
                    return true;
                }
                if (node.childrens && node.childrens.length > 0) {
                    if (recursiveUpdate(node.childrens)) {
                        return true;
                    }
                }
            }
            return false;
        };
        recursiveUpdate(state.items);
    }

    findById(items, id) {
        return items.find(doc => doc._id === id);
    }
}
