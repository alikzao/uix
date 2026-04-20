import * as counter from "./counter.example.js";
import * as popup from "./popup.example.js";
import * as nestedComponents from "./nested-components.example.js";
import * as eventBindings from "./event-bindings.example.js";
import * as functionalComponent from "./functional-component.example.js";

export const examples = [counter, popup, nestedComponents, eventBindings, functionalComponent];

export const examplesById = Object.fromEntries(
  examples.map((example) => [example.id, example])
);

export const defaultExampleId = "counter";
