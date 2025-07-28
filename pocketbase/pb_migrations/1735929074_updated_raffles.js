/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": 1,
    "name": "price",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // remove field
  collection.fields.removeById("number3402113753")

  return app.save(collection)
})
