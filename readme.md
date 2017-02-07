# BattleShips

> AH Computing Project App

#Notes

While possibly not initially clear, the use of `Object.freeze()` in the various JS classes for the game has a purpose. The problem with readability that I was addressing is the fact that the use of numbers to represent constants is not clear to debug or read generally. The problem with trying to define enums in JavaScript is there is no type for them, so improper handling at runtime could lead to the value of what should be a constant being redefined. The use of `Object.freeze()` allows the creation of pseudo-enums by freezing the properties of the 'enum' objecton creation, this means that any attempt to modify them will lead to the attempt failing, or a `TypeError` being thrown.


## Dev

```
$ npm install
```

### Run

```
$ npm start
```

### Build

```
$ npm run build
```

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Connor](http://connorl.com)
