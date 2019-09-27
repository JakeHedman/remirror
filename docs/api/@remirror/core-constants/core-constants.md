<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@remirror/core-constants](./core-constants.md)

## core-constants package

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [ExtensionType](./core-constants.extensiontype.md) | Defines the type of the extension. |
|  [MarkGroup](./core-constants.markgroup.md) | Marks are categorized into different groups. One motivation for this was to allow the <code>code</code> mark to exclude other marks, without needing to explicitly name them. Explicit naming requires the named mark to exist in the schema. This is undesirable because we want to construct different schemas that have different sets of nodes/marks. |
|  [NodeGroup](./core-constants.nodegroup.md) |  |
|  [Side](./core-constants.side.md) | Used to determine the side where a gap-cursor is drawn |
|  [Tags](./core-constants.tags.md) | These are the default supported tag strings which help categorize different behaviors that extensions can exhibit. |

## Variables

|  Variable | Description |
|  --- | --- |
|  [DEFAULT\_EXTENSION\_PRIORITY](./core-constants.default_extension_priority.md) | The default extension priority level |
|  [EDITOR\_CLASS\_NAME](./core-constants.editor_class_name.md) | The editor class name |
|  [EDITOR\_CLASS\_SELECTOR](./core-constants.editor_class_selector.md) | The editor class selector |
|  [EMPTY\_PARAGRAPH\_NODE](./core-constants.empty_paragraph_node.md) | A default empty object node. Useful for resetting the content of a prosemirror document. |
|  [LEAF\_NODE\_REPLACING\_CHARACTER](./core-constants.leaf_node_replacing_character.md) | Explanation from <code>@atlaskit</code> ProseMirror uses the Unicode Character 'OBJECT REPLACEMENT CHARACTER' (U+FFFC) as text representation for leaf nodes, i.e. nodes that don't have any content or text property (e.g. hardBreak, emoji, mention, rule) It was introduced because of https://github.com/ProseMirror/prosemirror/issues/262 This can be used in an input rule regex to be able to include or exclude such nodes. |
|  [NULL\_CHARACTER](./core-constants.null_character.md) | The null character.<!-- -->See [https://stackoverflow.com/a/6380172](https://stackoverflow.com/a/6380172) |
|  [SELECTED\_NODE\_CLASS\_NAME](./core-constants.selected_node_class_name.md) | The css class added to a node that is selected. |
|  [SELECTED\_NODE\_CLASS\_SELECTOR](./core-constants.selected_node_class_selector.md) | The css selector for a selected node. |
|  [ZERO\_WIDTH\_SPACE\_CHAR](./core-constants.zero_width_space_char.md) | A character useful for separating inline nodes. |
