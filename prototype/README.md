# Hello Farmer

Prototype app.


## Update data

Data is currently stored in [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) and
[GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) files. Edit them, for example, with
a spreadsheet (like [LibreOffice](http://libreoffice.org/)) and a
[GIS](https://en.wikipedia.org/wiki/Geographic_information_system) editor (like [geojson.io](http://geojson.io))
respectively.

Each region has its own set of files (they start with the same name). For _Vechtdal_, for
example, you'll find [places](https://github.com/FarmHackNL/hello-farmer/blob/master/prototype/vechtdal.places.csv)
containing farmers and retailers; [lands](https://github.com/FarmHackNL/hello-farmer/blob/master/prototype/vechtdal.lands.geojson)
with lots, with `producer_id` referencing an `id` in _places_; and [products](https://github.com/FarmHackNL/hello-farmer/blob/master/prototype/vechtdal.products.csv)
that reference zero or more places by `retailer_ids` for shops, as well by `producer_ids` for
farmers, and _lands_ by `land_ids`.

Note that `icon`, `type` and `crop_id` and `produce_id` are identifiers for [icons](https://github.com/FarmHackNL/hello-farmer/tree/master/prototype/src/assets/icons).


## Develop

 ```sh
 $ git clone https://github.com/FarmHackNL/hello-farmer.git
 $ cd hello-farmer/prototype
 $ npm install
 ```

Then start the app

```sh
$ npm start
```

and open [http://localhost:8080/](http://localhost:8080/)

At the moment you can add a region id as hash.


## Release

```sh
$ npm run build
```

Then the folder `build/` contains a ready-to-deploy website.
For updating the Github Pages website, run `npm run deploy` instead.


## Geodata

Preparing the data requires some gathering and manipulation of geo data. Pointers:

* [QGIS Desktop](http://qgis.org/)
* [Geocoding](http://www.freegeocoding.com/batch.php)
* Get farmlands from [Crop-R](https://www.crop-r.com/) using something like

    https://layer.crop-r.com/reference/georeference_with_properties/2016/json?bbox=6.259889602661133,52.508855657039184,6.41575813293457,52.5447298083506


## License

MIT license.
