/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // remove field
  collection.fields.removeById("bool989355118")

  // remove field
  collection.fields.removeById("number2006895353")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_739515003")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool989355118",
    "name": "completed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2006895353",
    "max": 1000,
    "min": 1,
    "name": "numbers",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
