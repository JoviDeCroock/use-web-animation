import { useRef, useLayoutEffect, useCallback, MutableRefObject } from "react";

export type AnimationOptions = {
  duration?: number;
  infinite?: boolean;
  pause?: boolean;
  delay?: number;
  easing?: string;
  from: string;
  to: string;
  property: string;
};

export const useWebAnimation = (
  options: AnimationOptions
): [MutableRefObject<HTMLElement | undefined>, () => void] => {
  const ref = useRef<HTMLElement>();
  const callback = useRef<any>();
  const animation = useRef<Animation | undefined>();
  const reverse = useRef(false);

  const animate = useCallback(
    (onComplete?: () => void) => {
      if (!ref.current) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error("Please apply the ref to a dom-element.");
        }
        return;
      }

      if (!ref.current.animate) {
        ref.current!.style[options.property as any] = options.to;
        return;
      }

      const timingObject: KeyframeAnimationOptions = {
        duration: options.duration || 750,
        delay: options.delay,
        easing: options.easing
      };

      callback.current = () => {
        if (options.infinite) {
          reverse.current = !reverse.current;
          if (animation.current) {
            ref.current!.style[options.property as any] = reverse.current
              ? options.from
              : options.to;
            animation.current.reverse();
          } else {
            animation.current = ref.current!.animate(
              [
                { [options.property]: options.from },
                { [options.property]: options.to }
              ],
              timingObject
            );
            animation.current.addEventListener("finish", callback.current);
          }
        } else {
          if (animation.current && animation.current.playState === "running") {
            reverse.current = !reverse.current;
            animation.current.reverse();
          } else if (animation.current) {
            ref.current!.style[options.property as any] = reverse.current
              ? options.from
              : options.to;

            if (onComplete) onComplete();

            animation.current = undefined;
            callback.current = undefined;
          } else {
            timingObject.direction = reverse.current ? "reverse" : "normal";
            animation.current = ref.current!.animate(
              [
                { [options.property]: options.from },
                { [options.property]: options.to }
              ],
              timingObject
            );
            animation.current.addEventListener("finish", callback.current);
          }
        }
      };

      callback.current();
    },
    [
      options.delay,
      options.duration,
      options.easing,
      options.from,
      options.infinite,
      options.property,
      options.to
    ]
  );

  useLayoutEffect(() => {
    if (!options.pause) animate();

    if (options.pause && animation.current) {
      animation.current.cancel();
      if (animation.current && callback.current) {
        animation.current.removeEventListener("finish", callback.current);
      }
    }
  }, [options.pause]);

  useLayoutEffect(() => {
    return () => {
      if (animation.current) {
        animation.current.cancel();
        if (animation.current && callback.current) {
          animation.current.removeEventListener("finish", callback.current);
        }
      }
    };
  }, []);

  return [ref, animate];
};
