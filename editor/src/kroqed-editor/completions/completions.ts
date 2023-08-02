import { Completion, CompletionContext, CompletionSource } from "@codemirror/autocomplete";
import symbols from "./symbols.json";
import emojis from "./emojis.json";

// Completions for common mathematical symbols.
const symbolCompletions: Completion[] = symbols;
const emojiCompletions: Completion[] = emojis;

/**
 * Function that creates the `symbolCompletionSource`. 
 * This function can be used in the editor as a completion source.
 */
export const symbolCompletionSource: CompletionSource = function(context: CompletionContext) {
    let before = context.matchBefore(/\\+(\w+\-*)*/);
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null;
    return {
        from: before ? before.from : context.pos,
        options: symbolCompletions,
        validFor: /^\\*$/
    }
}

/**
 * Function that creates the `emojiCompletionSource`.
 * This function can be used in the editor as a completion source. 
 * 
 * Emoji list has been generated by using https://github.com/github/gemoji/blob/master/db/emoji.json
 * from https://github.com/github/gemoji 
 */
export const emojiCompletionSource: CompletionSource = function(context: CompletionContext) {
    let before = context.matchBefore(/:.*/);    
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null;
    return {
        from: before ? before.from : context.pos,
        options: emojiCompletions,
        validFor: /^.*$/
    }
}