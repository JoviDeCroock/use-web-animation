import {
  useRef,
  useLayoutEffect,
  useCallback,
  MutableRefObject,
} from "react";

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
}: AnimationOptions): [
  MutableRefObject<HTMLElement | undefined>,
  () => void
] => {
  const ref = useRef<HTMLElement>();
  const callback = useRef<any>();
  const animation = useRef<Animation | undefined>();
  const reverse = useRef(false);

  const animate = useCallback(
    (onComplete?: (() => void)) => {
      if (!ref.current) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error("Please apply the ref to a dom-element.");
        }
        return;
      }

      if (!ref.current.animate) {
        ref.current!.style[property as any] = getValue(to);
        return;
      }
      const timingObject: KeyframeAnimationOptions = {
        duration: duration || 750,
        iterations: 1,
        delay,
        easing
      };

      callback.current = () => {
        if (infinite) {
          reverse.current = !reverse.current;
          if (animation.current) {
            ref.current!.style[property as any] = getValue(reverse.current ? from : to);
            animation.current.reverse();
          } else {
            animation.current = ref.current!.animate(
              [{ [property]: getValue(from) }, { [property]: getValue(to) }],
              timingObject
            );
            animation.current.addEventListener("finish", callback.current);
          }
        } else {
          if (animation.current && animation.current.playState === "running") {
            reverse.current = !reverse.current;
            animation.current.reverse();
            animation.current.removeEventListener("finish", callback.current);
            animation.current.addEventListener("finish", callback.current);
          } else if (animation.current) {
            ref.current!.style[property as any] = getValue(reverse.current ? from : to);

            if (onComplete) onComplete();

            if (animation.current && callback.current) {
              animation.current.removeEventListener(
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
    if (!pause) animate();

    return () => {
      if (animation.current && !pause) {
        animation.current.cancel();
        if (animation.current && callback.current) {
          animation.current.removeEventListener("finish", callback.current);
        }
      }
    };
  }, [pause]);

  return [ref, animate];
};
