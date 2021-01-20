import {
  default as express
} from 'express';
import {
  NotesStore as notes
} from '../models/notes-store.mjs';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const keyList = await notes.keylist();

    const keyPromises = keyList.map(key => {
      return notes.read(key);
    });

    const noteList = await Promise.all(keyPromises);

    res.render('index', {
      title: 'Notes',
      notelist: noteList
    });
  } catch (err) {
    next(err);
  }
});

export {
  router
};