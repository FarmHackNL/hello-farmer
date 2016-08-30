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


## License

MIT license.
