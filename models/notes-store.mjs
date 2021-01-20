import { default as DBG } from 'debug';

const debug = DBG('notes:notes-store');
const error = DBG('notes:notes-error');

var _NotesStore;

export async function useModel(model) {
    try {
        let NoteStoreModule = await import(`./notes-${model}.mjs`);
        let NotesStoreClass = NoteStoreModule.default;

        _NotesStore = new NotesStoreClass();

        return _NotesStore;
    } catch (err) {
        throw new Error(`No recognized NotesStore in ${model} because ${err}`);
    }
}

export { _NotesStore as NotesStore };