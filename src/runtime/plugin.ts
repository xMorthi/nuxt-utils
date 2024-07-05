import type { H3Event } from 'h3';
import { consola } from 'consola';
import { colors } from 'consola/utils';
import defu from 'defu';

type AvailableMethodsUpperCase = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type TagColor =
  | 'white'
  | 'cyan'
  | 'magenta'
  | 'yellow'
  | 'blue'
  | 'red'
  | 'green';

const createTagColor = (text: string, color?: TagColor) => {
  if (!color) {
    return text;
  }

  switch (color) {
    case 'blue':
      return colors.bgBlueBright(colors.black(text));
    case 'red':
      return colors.bgRedBright(colors.black(text));
    case 'green':
      return colors.bgGreenBright(colors.black(text));
    case 'yellow':
      return colors.bgYellowBright(colors.black(text));
    case 'magenta':
      return colors.bgMagentaBright(colors.black(text));
    case 'cyan':
      return colors.bgCyanBright(colors.black(text));
    default:
      return colors.bgWhite(colors.black(text));
  }
};

const createMethodTag = (method: AvailableMethodsUpperCase) => {
  switch (method) {
    case 'GET':
      return createTagColor(`[${method}]`, 'yellow');
    // return colors.bgYellowBright(colors.black(`[${method}]`));
    case 'POST':
      return createTagColor(`[${method}]`, 'blue');
    // return colors.bgBlueBright(colors.black(`[${method}]`));
    case 'PUT':
      return createTagColor(`[${method}]`, 'cyan');
    // return colors.bgCyanBright(colors.black(`[${method}]`));
    case 'DELETE':
      return createTagColor(`[${method}]`, 'red');
    // return colors.bgRedBright(colors.black(`[${method}]`));
    case 'PATCH':
      return createTagColor(`[${method}]`, 'magenta');
    // return colors.bgMagentaBright(colors.black(`[${method}]`));
    default:
      return createTagColor(`[${method}]`, 'green');
    // return colors.bgGreenBright(colors.black(`[${method}]`));
  }
};

const createPathTag = (method: AvailableMethodsUpperCase, path: string) => {
  switch (method) {
    case 'GET':
      return colors.yellowBright(path);
    case 'POST':
      return colors.blueBright(path);
    case 'PUT':
      return colors.cyanBright(path);
    case 'DELETE':
      return colors.redBright(path);
    case 'PATCH':
      return colors.magentaBright(path);
    default:
      return colors.greenBright(path);
  }
};

/**
 * Creates a logger based on the provided event and options.
 *
 * @param event - The event object.
 * @param options - The options for the logger.
 * @param options.leadingTag - The leading tag for the logger.
 * @param options.leadingTagColor - The color of the leading tag.
 * @param options.trailingTag - The trailing tag for the logger.
 * @param options.trailingTagColor - The color of the trailing tag.
 * @param options.showDate - Whether to show the date in the logger.
 * @param options.showTime - Whether to show the time in the logger.
 * @param options.noDate - Whether to exclude the date from the logger.
 * @param options.tagChar - The character used to separate tags in the logger.
 * @returns The created logger.
 */
export const createLogger = (
  event: H3Event,
  options?: {
    leadingTag?: string;
    leadingTagColor?: TagColor;
    trailingTag?: string;
    trailingTagColor?: TagColor;
    showDate?: boolean;
    showTime?: boolean;
    noDate?: boolean;
    tagChar?: string;
  },
) => {
  if (event?.context?.logger) {
    return event?.context?.logger;
  }

  options = defu(options, {
    showDate: false,
    showTime: false,
    noDate: false,
    tagChar: '>',
  });
  const leadingTag = createTagColor(
    `${options?.leadingTag || ''}`,
    options?.leadingTagColor
  );
  const trailingTag = createTagColor(
    `${options?.trailingTag || ''}`,
    options?.trailingTagColor
  );

  const method = event.method.toUpperCase() as AvailableMethodsUpperCase;

  const methodTag = createMethodTag(method);
  const pathTag = createPathTag(method, event.context.matchedRoute.path);

  const tags: string[] = [];

  if (!options?.noDate) {
    const [date, time] = new Date().toISOString().split('.')[0].split('T');
    if (options.showDate) { tags.push(date) }
    if (options.showTime) { tags.push(time) }
  }

  if (leadingTag) { tags.push(leadingTag) }
  if (methodTag) { tags.push(methodTag) }
  if (pathTag) { tags.push(pathTag) }
  if (trailingTag) { tags.push(trailingTag) }

  const logger = consola.withDefaults({
    tag: tags.join(' ') + ']\n[' + options.tagChar,
  });

  if (event?.context) {
    event.context.logger = logger;
    return event.context.logger;
  }

  return logger;
};
