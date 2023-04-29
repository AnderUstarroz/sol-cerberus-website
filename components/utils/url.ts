export const siteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_PROTOCOL}//${process.env.NEXT_PUBLIC_DOMAIN}${path}`;
};
