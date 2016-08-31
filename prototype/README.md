# Hello Farmer

Prototype app.


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
