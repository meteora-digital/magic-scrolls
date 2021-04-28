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
	<div class="banner__image" style="background-image: url('path/to/your/image.jpg');"></div>
</section>
```

```javascript
import MagicScrolls from 'magic-scrolls';

const banner = document.querySelector('.banner');
const image = document.querySelector('.banner__image');
```

## ⚗️ The Magic

#### Create a Magic Scroll!

| Option | Type | Description |
|--------|------|-------------|
| duration | number | number in milliseconds for how long the tween should take to complete | 
| fps | number | The frames per second for the animation | 

```javascript
const magic = new MagicScrolls(banner, {
	duration: 500,
	fps: 60,
});
```

#### Tweening

Use tweening to smoothly animate an element's styles based on your scroll position within the Magic Scroll element!

```javascript
magic.tween(image, (percentage) => {
	image.style.transform = `translateX(${percentage}%)`;
});
```

#### Parallax

Parallax is a powerful spell which will move your elements for you.

```scss
.banner {
	position: relative;
	height: 1000px;
	overflow: hidden;

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 130%;
	}
}

```javascript
magic.parallax(image);
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

