import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APINote, NoteType } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

interface NotesSliceState {
	fetched: boolean;
	values: {
		[id: string]: APINote;
	};
}

const initialState: NotesSliceState = {
	fetched: false,
	values: {}
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', (_, { dispatch }) => client.getNotes().catch(err => wrapAPIError(err, dispatch)));
export const createNote = createAsyncThunk('notes/createNote', (data: { id: string; noteType: NoteType }, { dispatch }) => client.createNote(data.id, data.noteType).catch(err => wrapAPIError(err, dispatch)));
export const deleteNote = createAsyncThunk('notes/deleteNote', (id: string, { dispatch }) => client.deleteNote(id).catch(err => wrapAPIError(err, dispatch)));

function addNotesToState(notes: APINote[], state: NotesSliceState) {
	for (const note of notes) {
		const existing = state.values[note.targetUserID];
		if (existing) {
			Object.assign(existing, note);
		} else {
			state.values[note.targetUserID] = note;
		}
	}
}

export const NotesSlice = createSlice({
	name: 'notes',
	initialState,
	reducers: {
		addNote: (state, action) => {
			const note: APINote = action.payload;
			addNotesToState([note], state);
		},
		addNotes: (state, action) => {
			const notes: APINote[] = action.payload.notes;
			addNotesToState(notes, state);
		},
		removeNote: (state, action) => {
			const id: string = action.payload;
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.values[id];
		}
	},
	extraReducers(builder) {
		builder.addCase(fetchNotes.fulfilled, (state, action) => {
			state.fetched = true;
			addNotesToState(action.payload, state);
		});
		builder.addCase(createNote.fulfilled, (state, action) => {
			addNotesToState([action.payload], state);
		});
		builder.addCase(deleteNote.fulfilled, (state, action) => {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.values[action.meta.arg];
		});
	}
});

export const { addNote, addNotes, removeNote } = NotesSlice.actions;

export const selectNotesFetched = (state: { notes: NotesSliceState }) => state.notes.fetched;
export const selectNotes = (state: { notes: NotesSliceState }) => state.notes.values;
export const selectNoteByID = (id: string) => (state: { notes: NotesSliceState }) => selectNotes(state)[id];
export const selectNotesByType = (noteType: NoteType) => (state: { notes: NotesSliceState }) => Object.values(selectNotes(state)).filter(note => note.noteType === noteType);

export default NotesSlice.reducer;
