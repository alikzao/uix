/**
 * это нужно для виртуального создания дерева, для более удобного рисования
 * когда например есть какието субдокументы и мы не хотим перерисовывать все табличку то прочто удаляем документ из девера
 * и удаляем его из дуум чтоли
 */
export class TreeManager  {

    constructor(getState) {
        // this.state = state;
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
                    return true; // Возвращаем true, если удаление выполнено
                }
                if (docs[i].childrens && docs[i].childrens.length > 0) {
                    if (recursiveRemove(docs[i].childrens, docId)) {
                        return true; // Прекращаем дальнейший поиск, если удаление выполнено
                    }
                }
            }
            return false;
        }
        // recursiveRemove(this.state.items, docId);
        const state = this.getState();
        recursiveRemove(state.items, docId);
        return state.items;
    }

    addNode(newDoc) {
        // Вспомогательная функция для рекурсивного поиска и вставки
        function recursiveInsert(docs, newDoc) {
            for (let doc of docs) {
                if (doc._id === newDoc.doc.parentId) {
                    doc.childrens.push(newDoc);
                    return true; // Возвращаем true, если вставка выполнена
                }
                if (doc.childrens && doc.childrens.length > 0) {
                    if (recursiveInsert(doc.childrens, newDoc)) {
                        return true; // Прекращаем дальнейший поиск, если вставка выполнена
                    }
                }
            }
            return false;
        }
        const state = this.getState();
        // const inserted = recursiveInsert(this.state.items, newDoc);
        const inserted = recursiveInsert(state.items, newDoc);
        if (!inserted) {
            // Если родитель не найден, вставляем в корень
            newDoc.doc.parentId = '-';
            // this.state.items.push(newDoc);
            state.items.push(newDoc);
        }
        // return this.state.items;
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
        // recursiveUpdate(this.state.items);
        recursiveUpdate(state.items);
        // recursiveUpdate(this.state.items);
    }

    findById(items, id) {
        return items.find(doc => doc._id === id);
    }
}
