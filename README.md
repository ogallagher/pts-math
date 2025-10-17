# pts-math 

**pts-math** isolates the math (ex. vectors, geometry, linear algebra) that is defined within the [Pts](https://ptsjs.org) visualization library.

---    

### Usage

**Option 1**   
Get the latest `pts-math.js` or `pts-math.min.js` (in `dist` folder).

**Option 2:**   
Install via `npm install pts-math`. Then you can choose to import some parts of Pts into your project as needed. 
```js
import {Pt, Group, Line} from 'pts-math';
```

---    

### For development

Pts is written in typescript. You can clone or fork this project and build it as follows:

#### Build and test

Clone this repo and install dependencies via `npm install`.

```bash
npm start
npm run build
npm test
```

#### Generate documentations

Run this to generate Pts styled documentations. (Requires python 3.6)
```bash
npm run docs 
```

If you prefer to generate default typedocs, run this:
```bash
typedoc --readme none --out typedocs src --name Pts
```

---

### Contributing

See instructions at the parent library **Pts**. For **pts-math**,open 

---    

### License
Apache License 2.0. See LICENSE file for details.   
Copyright © 2017-today by William Ngan and contributors.

