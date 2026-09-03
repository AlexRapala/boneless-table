/** Joins consumer supplied class names without imposing a CSS framework. */
export function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ')
}
