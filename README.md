# use-web-animation

[![npm version](https://badgen.net/npm/v/use-web-animation)](https://www.npmjs.com/package/use-web-animation)
[![Bundle size](https://badgen.net/bundlephobia/minzip/use-web-animation)](https://badgen.net/bundlephobia/minzip/use-web-animation)

This project aims to provide an API to use the [web-animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

> This isn't supported in IE11 without a polyfill, in IE11 this library will just execute the ending value.

> If you want to use "native-preact" you can import it with "use-web-animation/preact"

## useWebAnimation

This package exports 1 function called `useWebAnimation` which allows you to manipulate stylistic properties.

```js
import { useWebAnimation } from 'use-web-animation';

const RotatingAnimation = () => {
  const [ref] = useWebAnimation({
    from: 0,
    to: 180,
    property: "transform",
    infinite: true,
  });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "red",
        width: 100,
        height: 100,
      }}
    />
  );
};
```

The second returned argument is a `play` function which can be used to imperatively
start playing a paused animation. This function also accepts an `onComplete` callback
which will be called when the animation completes.

Accepted properties:

```ts
type AnimationOptions = {
  duration?: number; // How long the animation should take
  infinite?: boolean; // Should the animation keep looping?
  pause?: boolean; // Start the animation out in a non-playing state
  delay?: number; // Delay before starting to animate
  easing?: string; // https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/easing
  from: string; // The starting value
  to: string; // The ending value
  property: string; // The property name
};
```

## Examples

- https://codesandbox.io/s/zealous-rubin-fgdhk
- https://codesandbox.io/s/charming-hermann-v4o2h
- https://codesandbox.io/s/breathing-button-test-z24f1
