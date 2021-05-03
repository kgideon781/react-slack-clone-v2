import React, {
    useCallback,
    useMemo,
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
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../app/firebase";
import firebase from "firebase";
import {Button} from "@material-ui/core";
import styled from "styled-components";

export default function TextInput({channelName, channelId, chatRef}) {

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);
    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);
    const allMessagesRef = db.collection('rooms').doc(channelId).collection('messages').orderBy('timestamp', 'asc');


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


    const sendMessage = () => {
        //e.preventDefault();
        console.log("clicked")
        if (input) {
            if (!channelId) {
                return false;
            }

            allMessagesRef.get().then((documentSnapshots)=> {
                const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];



                console.log('The document id be '+lastVisible?.id)



                db.collection('rooms')
                    .doc(channelId).collection('messages')
                    .add({
                        user_id: user.uid,
                        message: input,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        user: user.displayName,
                        userImage: user.photoURL,
                        likesCount: 0,
                        reads: null,


                    }).then((rs) =>{
                    console.log("succeeded")

                });

            });



        }
        chatRef.current.scrollIntoView({
            behavior:'smooth',

        });


    }

    return (
        <ChatInputContianer>
            <form className={editorStyles.editor}
                  onClick={() => {
                      //ref.current.focus();
                  }}>

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
                <Button onClick={() => {
                    const contentState = editorState.getCurrentContent();
                    const raw = convertToRaw(contentState);

                    let mentionedUsers = [];
                    for (let key in raw.entityMap){
                        const ent = raw.entityMap[key];
                        if (ent.type === 'mention'){
                            mentionedUsers.push(ent.data.mention)
                        }
                    }

                    console.log(raw.blocks)
                    raw.blocks.map((txt) => {
                        console.log(txt.text)
                        setInput(txt.text)
                    })
                    sendMessage()
                    //console.log(contentState)
                    console.log(mentionedUsers)
                }}>Extract Info</Button>
            </form>
        <form
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

        </form>
            <div>

                <Button onClick={() => {
                    const contentState = editorState.getCurrentContent();
                    const raw = convertToRaw(contentState);

                    let mentionedUsers = [];
                    for (let key in raw.entityMap){
                        const ent = raw.entityMap[key];
                        if (ent.type === 'mention'){
                            mentionedUsers.push(ent.data.mention)
                        }
                    }

                    console.log(raw.blocks)
                    raw.blocks.map((txt) => {
                        console.log(txt.text)
                        setInput(txt.text)
                    })
                    sendMessage()
                    //console.log(contentState)
                    console.log(mentionedUsers)
                }}>Extract Info</Button>
            </div>

</ChatInputContianer>
    );
}

const ChatInputContianer = styled.div`
  border-radius: 20px;
  >form{
  position: relative;
  display: flex;
  justify-content: center;
  }
  >form > Editor{
  position: fixed;
  width: 60%;
  bottom: 30px;
  border: 1px solid gray;
  border-radius: 3px;
  padding: 20px;
  outline: none;
  }
  >form >Button{
  bottom: 30px;
  position: fixed;
  display: none;
  }
`