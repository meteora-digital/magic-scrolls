# 🧙‍♀️ Magic Scrolls 📜

An easy to use scroll based tweening class.
Any element can be tweened by a percentage based on how far through the chosen element we have scrolled.
The class will handle the tweening, you do the rest!

## 🪄 Installation

with webpack

```bash
yarn add magic-scrolls
```

## 🧪 Usage

```html
<section class="banner">
	<h1 class="banner__text">Magic Text!</h1>
</section>
```

```es6
import MagicScrolls from 'magic-scrolls';

const banner = document.querySelector('.banner');
const text = document.querySelector('.banner__text');

const magic = new MagicScrolls(banner, {
	duration: 500,
	fps: 60,
});

magic.push(text, (percentage) => {
	text.style.transform = `translateX(${percentage}%)`;
});
```

## ⚗️ Options

```es6
new MagicScrolls(document.querySelector('selector'), {
	duration: 500,
	fps: 60,
});
```

| Option | Type | Description |
|--------|------|-------------|
| duration | number | number in milliseconds for how long the transition should take to complete | 
| fps | number | The frames per second for the animation | 


## License
[MIT](https://choosealicense.com/licenses/mit/)

