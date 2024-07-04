import { consola } from 'consola';
import { colors } from 'consola/utils';
import { defineNuxtPlugin } from '#app';

type AvailableMethodsLowerCase = 'get' | 'post' | 'put' | 'delete' | 'patch';
type AvailableMethodsUpperCase = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type TagColor =
  | 'white'
  | 'cyan'
  | 'magenta'
  | 'yellow'
  | 'blue'
  | 'red'
  | 'green';

type Method = AvailableMethodsLowerCase | AvailableMethodsUpperCase | string;

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

export const createLogger = (
  _method: Method,
  path: string,
  options?: {
    leadingTag?: string;
    leadingTagColor?: TagColor;
    trailingTag?: string;
    trailingTagColor?: TagColor;
    noDate?: boolean;
  }
) => {
  const leadingTag = createTagColor(
    `${options?.leadingTag || ''}`,
    options?.leadingTagColor
  );
  const trailingTag = createTagColor(
    `${options?.trailingTag || ''}`,
    options?.trailingTagColor
  );

  const method = _method.toUpperCase() as AvailableMethodsUpperCase;

  const dateTag = new Date().toISOString().split('T').join(' ').split('.')[0];

  const methodTag = createMethodTag(method);
  const pathTag = createPathTag(method, path);

  const tags: string[] = [];

  if (!options?.noDate) {
    tags.push(dateTag!);
  }
  if (leadingTag) {
    tags.push(leadingTag);
  }
  if (methodTag) {
    tags.push(methodTag);
  }
  if (pathTag) {
    tags.push(pathTag);
  }
  if (trailingTag) {
    tags.push(trailingTag);
  }

  return consola.withDefaults({
    tag: tags.join(' ') + ']\n[>',
  });
};

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      createLogger,
    },
  };
});
