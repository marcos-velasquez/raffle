/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_515447164")

  // update collection data
  unmarshal({
    "name": "history"
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file4101391790",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "video/mp4",
      "video/webm"
    ],
    "name": "video",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_515447164")

  // update collection data
  unmarshal({
    "name": "videos"
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file4101391790",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "video/mp4",
      "video/webm"
    ],
    "name": "url",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
