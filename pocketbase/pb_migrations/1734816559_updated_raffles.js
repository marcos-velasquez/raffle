/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file3760176746",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp"
    ],
    "name": "images",
    "presentable": false,
    "protected": true,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file3760176746",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "images",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
