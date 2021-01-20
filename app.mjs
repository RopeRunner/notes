import {
  default as express
} from 'express';
import hbs from 'hbs';
import * as path from 'path';
import {
  default as logger
} from 'morgan';
import {
  default as cookieParser
} from 'cookie-parser';
import {
  default as bodyParser
} from 'body-parser';
import * as http from 'http';
import {
  router as notesRouter
} from './routes/notes.mjs';
import {
  default as rfs
} from 'rotating-file-stream';
import {
  default as fs
} from 'fs';
import {
  approotdir
} from './approotdir.mjs';
import { useModel as useNotesModel } from './models/notes-store.mjs';

useNotesModel(process.env.NOTES_MODEL ? process.env.NOTES_MODEL : 'memory')
  .then(store => { })
  .catch(err => { onError({ code: 'ENOTESSTORE', err }); });

const __dirname = approotdir;

import {
  normalizePort,
  onError,
  onListening,
  handle404,
  basicErrorHandler,
} from './appsupport.mjs';

import {
  router as indexRouter
} from './routes/index.mjs'


export const app = express();
const accessLogStream = fs.createWriteStream(`${__dirname}/access.log`, {
  flags: 'a'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'))

app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: process.env.REQUEST_LOG_FILE ?
    rfs.createStream(process.env.REQUEST_LOG_FILE, {
      size: '10M', // rotate every 10 MegaBytes written
      interval: '1d', // rotate daily
      compress: 'gzip' // compress rotated files
    }) : process.stdout
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);