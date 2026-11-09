import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import axios from 'axios';
import { fetchPlaces } from '../app/places_fetch.js';
import handler from '../pages/api/fetchPlaces.js';

const places = [
  { displayName: { text: 'Open' }, currentOpeningHours: { openNow: true } },
  { displayName: { text: 'Closed' }, currentOpeningHours: { openNow: false } },
  { displayName: { text: 'Unknown' } },
  { displayName: { text: 'No open flag' }, currentOpeningHours: {} },
  { displayName: { text: 'Null hours' }, currentOpeningHours: null },
];

test('go now keeps only confirmed-open places after deduplication', async (t) => {
  const get = t.mock.method(axios, 'get', async () => ({ data: { places } }));
  const results = await fetchPlaces({ lat: 43.65, lng: -79.38 }, 10, true);

  assert.deepEqual(results, [places[0]]);
  assert.equal(get.mock.callCount(), 9);
});

test('without go now, closed and unknown-hours places remain', async (t) => {
  t.mock.method(axios, 'get', async () => ({ data: { places } }));
  const results = await fetchPlaces({ lat: 43.65, lng: -79.38 }, 10, false);

  assert.deepEqual(results, places);
});

test('go now handles an empty search result', async (t) => {
  t.mock.method(axios, 'get', async () => ({ data: { places: [] } }));

  assert.deepEqual(
    await fetchPlaces({ lat: 43.65, lng: -79.38 }, 10, true),
    []
  );
});

test('API requests current opening hours and passes them to the client', async (t) => {
  const data = { places };
  const post = t.mock.method(axios, 'post', async () => ({ data }));
  const res = {
    status: mock.fn(function () { return this; }),
    json: mock.fn(),
  };

  await handler({ query: { lat: '43.65', lng: '-79.38', radius: '5000' } }, res);

  assert.equal(post.mock.callCount(), 1);
  const [url, , config] = post.mock.calls[0].arguments;
  assert.equal(url, 'https://places.googleapis.com/v1/places:searchNearby');
  const fields = config.headers['X-Goog-FieldMask'].split(',');
  assert.ok(fields.includes('places.currentOpeningHours'));
  assert.ok(fields.every(Boolean));
  assert.equal(res.status.mock.calls[0].arguments[0], 200);
  assert.deepEqual(res.json.mock.calls[0].arguments[0], data);
});
