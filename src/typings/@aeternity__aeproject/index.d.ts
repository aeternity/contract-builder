declare module '@aeternity/aeproject' {
  // eslint-disable-next-line import/prefer-default-export
  export const utils: { getFilesystem: (path: string) => { [key: string]: string } };
}
