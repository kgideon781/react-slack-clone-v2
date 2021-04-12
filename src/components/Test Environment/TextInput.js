import React, {
    ReactElement,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
    defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import editorStyles from './editorStyles.module.css';
import mentions from './Mentions';
import '@draft-js-plugins/mention/lib/plugin.css';

export default function TextInput() {
    const ref = useRef<Editor>(null);
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);

    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin();
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
    }, []);

    const onOpenChange = useCallback((_open: boolean) => {
        setOpen(_open);
    }, []);
    const onSearchChange = useCallback(({ value }: { value: string }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
    }, []);
    //console.log(mentions)

    return (
        <div>
        <div
            className={editorStyles.editor}
            onClick={() => {
                //ref.current.focus();
            }}
        >
            <Editor

                editorState={editorState}
                onChange={setEditorState}
                plugins={plugins}
               // ref={ref}
            />
            <MentionSuggestions
                open={open}
                onOpenChange={onOpenChange}
                suggestions={suggestions}
                onSearchChange={onSearchChange}
                onAddMention={() => {

                    // get the mention object selected
                }}
            />
        </div>
            <div>
                <button onClick={() => {
                    const contentState = editorState.getCurrentContent();
                    const raw = convertToRaw(contentState);

                    let mentionedUsers = [];
                    for (let key in raw.entityMap){
                        const ent = raw.entityMap[key];
                        if (ent.type === 'mention'){
                            mentionedUsers.push(ent.data.mention)
                        }
                    }
                    console.log(mentionedUsers)
                }}>Extract Info</button>
            </div>
</div>
    );
}
