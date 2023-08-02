// Importing necessary modules from prosemirror-state and prosemirror-view
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { findDescendantsWithType } from './kroqed-utils';
import { QedStatus } from '../../../shared';

// Define interface for UpdateStatusPluginState
export interface IUpdateStatusPluginState {
  status: QedStatus[];
}

// Key to identify the plugin within ProseMirror's plugin system
export const UPDATE_STATUS_PLUGIN_KEY = new PluginKey<IUpdateStatusPluginState>('prosemirror-status-update');

// Helper function to convert status updates to appropriate CSS classes
const statusToDecoration = (status: QedStatus) => {
  switch (status) {
    case QedStatus.Proven:
      return 'proven';
    case QedStatus.Incomplete:
      return 'incomplete';
    default:
      return '';
  }
};

// Plugin specification
let UpdateStatusPluginSpec = {
  key: UPDATE_STATUS_PLUGIN_KEY,
  state: {
    // The function to initialize the plugin state
    init(config, instance){
      return {
        status: [],
      };
    },
    // Function to apply updates to the plugin state
    apply(tr, value, oldState, newState){
      const newStatus = tr.getMeta(UPDATE_STATUS_PLUGIN_KEY);
      if (newStatus === undefined) {
        return value;
      } else {
        return {
          status: newStatus,
        };
      }
    }
  },
  props: {
    // Function to compute decorations based on the plugin state
    decorations: (state) => {
      const statusUpdate = UPDATE_STATUS_PLUGIN_KEY.getState(state)?.status;
      if (statusUpdate && statusUpdate.length > 0) {
        // Get all input nodes in the document
        const inputNodeType = state.schema.nodes.input;
        const inputNodes = findDescendantsWithType(state.doc, true, inputNodeType);

        if (!inputNodes || statusUpdate.length !== inputNodes.length) return null;

        let decorations: Decoration[] = [];
        inputNodes.forEach((inputNode, index) => {
          if (statusUpdate[index] !== undefined) {
            let newStatusUpdate = statusUpdate[index];
            if (inputNode.node.attrs.status !== newStatusUpdate) {
              let decoration = Decoration.node(inputNode.pos, inputNode.pos + inputNode.node.nodeSize, {
                class: statusToDecoration(newStatusUpdate),
              });
              decorations.push(decoration);
            }
          }
        });

        return DecorationSet.create(state.doc, decorations);
      }
      return null;
    },
  },
};

// Create a new instance of the plugin
export const updateStatusPlugin = new Plugin(UpdateStatusPluginSpec);