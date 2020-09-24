import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APINote, NoteType } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

interface NotesSliceState {
	values: {
		[id: string]: APINote;
	};
}

const initialState: NotesSliceState = {
	values: {}
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', (_, { dispatch }) => client.getNotes().catch(err => wrapAPIError(err, dispatch)));
export const createNote = createAsyncThunk('notes/createNote', (data: { id: string; noteType: NoteType }, { dispatch }) => client.createNote(data.id, data.noteType).catch(err => wrapAPIError(err, dispatch)));
export const deleteNote = createAsyncThunk('notes/deleteNote', (id: string, { dispatch }) => client.deleteNote(id).catch(err => wrapAPIError(err, dispatch)));

export const NotesSlice = createSlice({
	name: 'notes',
	initialState,
	reducers: {
		addNote: (state, action) => {
			const note: APINote = action.payload;
			const existing = state.values[note.targetUserID];
			if (existing) {
				Object.assign(existing, note);
			} else {
				state.values[note.targetUserID] = note;
			}
		},
		addNotes: (state, action) => {
			const notes: APINote[] = action.payload.notes;
			for (const note of notes) {
				const existing = state.values[note.targetUserID];
				if (existing) {
					Object.assign(existing, note);
				} else {
					state.values[note.targetUserID] = note;
				}
			}
		},
		removeNote: (state, action) => {
			const id: string = action.payload;
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.values[id];
		}
	}
});

export const { addNote, addNotes, removeNote } = NotesSlice.actions;

export const selectNotes = (state: { notes: NotesSliceState }) => state.notes.values;
export const selectNoteByID = (id: string) => (state: { notes: NotesSliceState }) => selectNotes(state)[id];
export const selectNotesByType = (noteType: NoteType) => (state: { notes: NotesSliceState }) => Object.values(selectNotes(state)).filter(note => note.noteType === noteType);

export default NotesSlice.reducer;
