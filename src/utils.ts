export interface ReplaceStrOptions {
    source: string;
    replace: string;
    start: number;
    end: number;
}

export function replaceString(options: ReplaceStrOptions): string {
    const { source, replace, start, end } = options;

    return source.slice(0, start) + replace + source.slice(end);
}
