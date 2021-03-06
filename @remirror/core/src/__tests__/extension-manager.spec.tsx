import { createEditor, doc, p } from 'jest-prosemirror';
import { EditorView } from 'prosemirror-view';
import React, { FC } from 'react';

import { EMPTY_PARAGRAPH_NODE, Tags } from '@remirror/core-constants';
import { Cast } from '@remirror/core-helpers';
import {
  Attrs,
  EditorState,
  KeyBindingCommandFunction,
  KeyBindings,
  NodeExtensionSpec,
} from '@remirror/core-types';
import { PortalContainer } from '@remirror/react-portals';
import {
  baseExtensions,
  createTestManager,
  extensions,
  helpers as initHelpers,
} from '@remirror/test-fixtures';
import { defaultRemirrorThemeValue } from '@remirror/ui';

import { Extension } from '../extension';
import { ExtensionManager, isExtensionManager } from '../extension-manager';
import { NodeExtension } from '../node-extension';

describe('ExtensionManager', () => {
  let state: EditorState;

  const helpers = {
    getState: Cast(jest.fn(() => state)),
    portalContainer: new PortalContainer(),
    getTheme: () => defaultRemirrorThemeValue,
  };
  const innerMock = jest.fn();
  const mock = jest.fn((_: Attrs) => innerMock);
  const getInformation = jest.fn(() => 'information');

  const SSRComponent: FC<Attrs> = () => <div />;

  class DummyExtension extends Extension {
    public name = 'dummy';
    public tags = ['simple', Tags.LastNodeCompatible];
    public commands() {
      return { dummy: mock };
    }

    public helpers() {
      return {
        getInformation,
      };
    }

    public attributes() {
      return {
        class: 'custom',
      };
    }
  }

  class BigExtension extends NodeExtension {
    public name = 'big' as const;

    public schema: NodeExtensionSpec = {
      toDOM: () => ['h1', 0],
    };

    get defaultOptions() {
      return {
        SSRComponent,
      };
    }
  }

  const dummy = new DummyExtension();
  const big = new BigExtension();
  let manager = ExtensionManager.of([
    ...extensions,
    { extension: dummy, priority: 1 },
    { extension: big, priority: 10 },
  ]);

  let view: EditorView;

  beforeEach(() => {
    manager = ExtensionManager.create([
      ...extensions,
      { extension: dummy, priority: 1 },
      { extension: big, priority: 10 },
    ]);
    manager.init(helpers);
    state = manager.createState({ content: EMPTY_PARAGRAPH_NODE });
    view = new EditorView(document.createElement('div'), {
      state,
      editable: () => true,
    });
    manager.initView(view);
  });

  test('commands', () => {
    const attrs = { a: 'a' };
    manager.data.actions.dummy(attrs);

    expect(mock).toHaveBeenCalledWith(attrs);
    expect(innerMock).toHaveBeenCalledWith(state, view.dispatch, view);
  });

  test('helpers', () => {
    const val = manager.data.helpers.getInformation();

    expect(val).toBe('information');
    expect(getInformation).toHaveBeenCalled();
  });

  describe('#properties', () => {
    it('should sort extensions by priority', () => {
      expect(manager.extensions).toHaveLength(11);
      expect(manager.extensions[0]).toEqual(dummy);
      expect(manager.extensions[10]).toEqual(big);
    });

    it('should throw if data accessed without init', () => {
      const testManager = createTestManager();

      expect(() => testManager.data).toThrowErrorMatchingInlineSnapshot(
        `"Extension Manager must be initialized before attempting to access the data"`,
      );
    });

    it('should provide the schema at instantiation', () => {
      expect(createTestManager().schema).toBeTruthy();
    });

    it('should provide access to `attributes`', () => {
      expect(manager.attributes.class).toInclude('custom');
    });

    it('should provide access to `components`', () => {
      expect(manager.components.big).toEqual(SSRComponent);
    });
  });

  test('isExtensionManager', () => {
    expect(isExtensionManager({})).toBeFalse();
    expect(isExtensionManager(manager)).toBeTrue();
  });

  describe('#isEqual', () => {
    it('should be equal for the same instance', () => {
      expect(manager.isEqual(manager)).toBeTrue();
    });

    it('should be equal for different instances but identical otherwise', () => {
      expect(createTestManager().isEqual(createTestManager())).toBeTrue();
    });

    it('should not be equal for different managers', () => {
      expect(manager.isEqual(createTestManager())).toBeFalse();
    });

    it('should not be equal for different objects', () => {
      expect(manager.isEqual({})).toBeFalse();
    });
  });
});

test('keymaps', () => {
  const mocks = {
    firstEnter: jest.fn((..._: Parameters<KeyBindingCommandFunction>) => false),
    secondEnter: jest.fn((..._: Parameters<KeyBindingCommandFunction>) => false),
    thirdEnter: jest.fn((..._: Parameters<KeyBindingCommandFunction>) => false),
  };

  class FirstExtension extends Extension {
    public name = 'first' as const;

    public keys(): KeyBindings {
      return {
        Enter: mocks.firstEnter,
      };
    }
  }

  class SecondExtension extends Extension {
    public name = 'second' as const;

    public keys() {
      return {
        Enter: mocks.secondEnter,
      };
    }
  }
  class ThirdExtension extends Extension {
    public name = 'third' as const;

    public keys() {
      return {
        Enter: mocks.thirdEnter,
      };
    }
  }

  const manager = ExtensionManager.of([
    ...baseExtensions,
    { extension: new FirstExtension(), priority: 1 },
    { extension: new SecondExtension(), priority: 10 },
    { extension: new ThirdExtension(), priority: 100 },
  ]);
  manager.init(initHelpers);

  createEditor(doc(p('simple<cursor>')), { plugins: manager.data.keymaps })
    .press('Enter')
    .callback(() => {
      expect(mocks.firstEnter).toHaveBeenCalled();
      expect(mocks.secondEnter).toHaveBeenCalled();
      expect(mocks.thirdEnter).toHaveBeenCalled();

      jest.clearAllMocks();
      mocks.firstEnter.mockImplementation(() => true);
    })
    .press('Enter')
    .callback(() => {
      expect(mocks.firstEnter).toHaveBeenCalled();
      expect(mocks.secondEnter).not.toHaveBeenCalled();
      expect(mocks.thirdEnter).not.toHaveBeenCalled();

      jest.clearAllMocks();
      mocks.firstEnter.mockImplementation(({ next }) => {
        return next();
      });
    })
    .press('Enter')
    .callback(() => {
      expect(mocks.secondEnter).toHaveBeenCalledTimes(1);
      expect(mocks.thirdEnter).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      mocks.secondEnter.mockImplementation(() => true);
    })
    .press('Enter')
    .callback(() => {
      expect(mocks.secondEnter).toHaveBeenCalledTimes(1);
      expect(mocks.thirdEnter).not.toHaveBeenCalled();
    });
});
