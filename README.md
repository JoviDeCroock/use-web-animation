# use-web-animation

[![npm version](https://badgen.net/npm/v/hoofd)](https://www.npmjs.com/package/hoofd)
[![Bundle size](https://badgen.net/bundlephobia/minzip/hoofd)](https://badgen.net/bundlephobia/minzip/hoofd)

This project aims to provide an API to use the [web-animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

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
    getValue: (x) => `rotate(${x}deg)`
  });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "red",
        width: 100,
        height: 100,
        marginRight: 12
      }}
    />
  );
};
```

Accepted properties:

```ts
type AnimationOptions = {
  duration?: number; // How long the animation should take
  infinite?: boolean; // Should the animation keep looping?
  pause?: boolean; // Start the animation out in a non-playing state
  delay?: number; // Delay before starting to animate
  easing?: string; // https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/easing
  from: number; // The starting value
  to: number; // The ending value
  getValue: (x: number) => string; // Function used to inject the value for "from" and "to"
  property: string; // The property name
};
```

## Examples

- https://codesandbox.io/s/zealous-rubin-fgdhk?file=/src/use-animation/index.ts
- https://codesandbox.io/s/charming-hermann-v4o2h?file=/src/useSpring.ts
