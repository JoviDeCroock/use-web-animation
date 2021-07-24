import { useRef, useLayoutEffect, useCallback, MutableRefObject } from "react";

const DEFAULT_DURATION = 750;

export type AnimationOptions = {
  duration?: number;
  infinite?: boolean;
  pause?: boolean;
  delay?: number;
  easing?: string;
  from: number;
  to: number;
  getValue: (x: number) => string;
  property: string;
};

export const useWebAnimation = ({
  duration,
  infinite,
  getValue,
  from,
  to,
  property,
  delay,
  easing,
  pause
}: AnimationOptions): [MutableRefObject<HTMLElement | undefined>, () => void] => {
  const ref = useRef<HTMLElement>();
  const callback = useRef<any>();
  const animation = useRef<Animation | undefined>();
  const reverse = useRef(false);

  const animate = useCallback(
    (onComplete?: (() => void)) => {
      if (!ref.current || !ref.current.animate) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('Please apply the ref to a dom-element.');
        }
        return;
      }

      if (!ref.current.animate) {
        ref.current!.style[property as any] = getValue(to);
        return;
      }

      const timingObject: KeyframeAnimationOptions = {
        duration: duration || DEFAULT_DURATION,
        iterations: 1,
        delay: delay || 0,
        easing,
        direction: "normal"
      };
      reverse.current = false;

      callback.current = () => {
        if (infinite) {
          timingObject.direction = reverse.current ? "reverse" : "normal";
          reverse.current = !reverse.current;

          animation.current = ref.current!.animate(
            [{ [property]: getValue(from) }, { [property]: getValue(to) }],
            timingObject
          );
          animation.current.addEventListener("finish", callback.current);
        } else {
          if (animation.current) {
            ref.current!.style[property as any] = getValue(to);
            if (onComplete) {
              onComplete();
            }
            if (animation.current && callback.current) {
              animation.current!.removeEventListener(
                "finish",
                callback.current
              );
            }
            animation.current = undefined;
            callback.current = undefined;
          } else {
            animation.current = ref.current!.animate(
              [{ [property]: getValue(from) }, { [property]: getValue(to) }],
              timingObject
            );
            animation.current.addEventListener("finish", callback.current);
          }
        }
      };

      callback.current();
    },
    [delay, duration, easing, from, infinite, property, to]
  );

  useLayoutEffect(() => {
    if (!pause) {
      animate();
    }

    return () => {
      if (animation.current && !pause) {
        if (animation.current && callback.current) {
          animation.current!.removeEventListener("finish", callback.current);
        }
        animation.current.cancel();
      }
    };
  }, [pause]);

  return [ref, animate];
};
