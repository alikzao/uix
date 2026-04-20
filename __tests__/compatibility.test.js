const newComponentModule = await import('../src/component.js');
const legacyComponentModule = await import('../../js/component.js');
const newExtendedModule = await import('../src/extendedComponent.js');
const legacyExtendedModule = await import('../../js/extendedComponent.js');
const newPopupModule = await import('../src/popupComponent.js');
const legacyPopupModule = await import('../../js/popupComponent.js');
const packageIndex = await import('../src/index.js');

describe('compatibility layer', () => {
    test('legacy component path re-exports the same Component class', () => {
        expect(legacyComponentModule.Component).toBe(newComponentModule.Component);
    });

    test('legacy extendedComponent path re-exports the same ExtendedComponent class', () => {
        expect(legacyExtendedModule.ExtendedComponent).toBe(newExtendedModule.ExtendedComponent);
    });

    test('legacy popupComponent path re-exports the same PopupComponent class', () => {
        expect(legacyPopupModule.PopupComponent).toBe(newPopupModule.PopupComponent);
    });

    test('package index re-exports the public API', () => {
        expect(packageIndex.Component).toBe(newComponentModule.Component);
        expect(packageIndex.ExtendedComponent).toBe(newExtendedModule.ExtendedComponent);
        expect(packageIndex.PopupComponent).toBe(newPopupModule.PopupComponent);
    });
});
