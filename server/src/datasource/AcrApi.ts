import FormData from 'form-data';
import fetch from 'node-fetch';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import cutter from '@upplay/mp3-cutter';

dotenv.config();

const defaultOptions = {
  host: process.env.HOST,
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: process.env.ACCESS_KEY as string,
  access_secret: process.env.ACCESS_SECRET as string,
};

function buildStringToSign(
  method: string,
  uri: string,
  accessKey: string,
  dataType: string,
  signatureVersion: string,
  timestamp: number
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString: string, accessSecret: string) {
  return createHmac('sha1', accessSecret)
    .update(Buffer.from(signString, 'utf-8'))
    .digest()
    .toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(
  data: Buffer,
  options: typeof defaultOptions,
  cb: (res?: any, err?: Error) => void
) {
  const current_data = new Date();
  const timestamp = current_data.getTime() / 1000;

  const stringToSign = buildStringToSign(
    'POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp
  );

  const signature = sign(stringToSign, options.access_secret);

  const form = new FormData();
  form.append('sample', data);
  form.append('sample_bytes', data.length);
  form.append('access_key', options.access_key);
  form.append('data_type', options.data_type);
  form.append('signature_version', options.signature_version);
  form.append('signature', signature);
  form.append('timestamp', timestamp);

  fetch(options.host + options.endpoint, { method: 'POST', body: form })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cb(res);
    })
    .catch((err) => {
      cb(null, err);
    });
}

export default function metaSearch(file: string, cb: (res: MetaResponse, err?: Error) => void) {
  const bitmap = cutter.cut({ src: file, start: 10, end: 30 });

  identify(bitmap, defaultOptions, cb);
}

type MetaResponse = {
  status: {
    msg: string,
    code: number,
    version: string
  },
  metadata: {
    music: MusicMeta[],
    timestamp_utc: string
  },
  cost_time: number,
  result_type: number
}

type MusicMeta = {
  external_ids: Record<string, any>,
  label: string,
  duration_ms: number,
  score: number,
  release_date: string,
  play_offset_ms: number,
  external_metadata: Record<string, any>,
  album: {
    name: string
  },
  title: string,
  acrid: string,
  genres?: MetaGenre[],
  result_from: number,
  artists: ArtistGenre[]
}

type MetaGenre = {
  name: string
};

type ArtistGenre = {
  name: string;
};
