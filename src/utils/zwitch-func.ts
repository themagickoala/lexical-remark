import { Handler, InvalidHandler, UnknownHandler } from "zwitch"

type Options<
  Invalid extends InvalidHandler = InvalidHandler,
  Unknown extends UnknownHandler = UnknownHandler,
  Handlers extends Record<string, Handler> = Record<string, Handler>
> = {
  handlers: Handlers,
  invalid: Invalid,
  unknown: Unknown,
};

const own = {}.hasOwnProperty;

/**
 * Handle values based on a field.
 */
export function zwitchFunc<
  Invalid extends InvalidHandler = InvalidHandler,
  Unknown extends UnknownHandler = UnknownHandler,
  Handlers extends Record<string, Handler> = Record<string, Handler>
>(
  key: string,
  options: Options<Invalid, Unknown, Handlers>
): {
  unknown: Unknown,
  invalid: Invalid,
  handlers: Handlers,
  (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>,
  (...parameters: Parameters<Unknown>): ReturnType<Unknown>
} {
  const settings = options || {};

  function one(this: unknown, value: unknown, ...parameters: unknown[]): unknown {
    let fn = one.invalid;
    const handlers = one.handlers;

    // @ts-expect-error Indexable.
    if (value && typeof value[key] === 'function') {
      // @ts-expect-error Indexable.
      const id = String(value[key]());
      // @ts-expect-error Indexable.
      fn = own.call(handlers, id) ? handlers[id] : one.unknown;
    }

    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }

  one.handlers = settings.handlers || {};
  one.invalid = settings.invalid;
  one.unknown = settings.unknown;

  // @ts-expect-error: matches!
  return one;
}