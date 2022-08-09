import { Plugin } from 'vite';
import { replaceString } from './utils';

export * from './utils';
export default function VitePluginVueWithDefaultsImports(): Plugin {
    return {
        enforce: 'pre',
        name: 'vite-plugin-vue-with-defaults-imports',
        transform(code, id) {
            if (!/\.vue/.test(id)) {
                return code;
            }

            const scriptRE = /<script(.+)>(.|\n)+<\/script>/g;
            const setupRE = /setup/;
            const tsLangRE = /lang=['"](ts|tsx)['"]/;
            const withDefaultsRE = /withDefaults\(\s*defineProps<.+>\(\)\s*,\s*(.+)\)/g;
            const commentRE = /\/\/.+|\/\*(.|\n)*\*\/(?!\w)/g;
            const literalRE = /\{.*\}/;
            const importRE = /import\s*([\w\d_$]+)?,?\s*(\{\s*(([\w\d_$]+,?\s*)+)\s*\})? from ['"].+['"]/g;

            const scriptMatch = code.matchAll(scriptRE);
            let isScriptSetupTs = false;

            for (const m of scriptMatch) {
                const attrs = m[1];
                if (setupRE.test(attrs) && tsLangRE.test(attrs)) {
                    isScriptSetupTs = true;
                }
            }

            if (!isScriptSetupTs) {
                return code;
            }

            // Strip comments
            const replacedCode = code.replace(commentRE, '');
            const offset = code.length - replacedCode.length;

            let defaults = '';
            let fullDefaults = '';
            let defaultsStart = 0;
            let defaultsEnd = 0;

            let matches: RegExpExecArray | null;

            while ((matches = withDefaultsRE.exec(replacedCode)) !== null) {
                defaults = matches[1].trim();
                fullDefaults = matches[0];
                defaultsStart = matches.index + offset;
                defaultsEnd = withDefaultsRE.lastIndex + offset;
            }

            if (!defaults) {
                return code;
            }

            if (literalRE.test(defaults)) {
                return code;
            }

            const imports: string[] = [];
            const importMatch = replacedCode.matchAll(importRE);

            for (const m of importMatch) {
                const typeOrDefault = m[1]?.trim();

                const specifiers = m[3];

                if (specifiers) {
                    imports.push(...specifiers.split(',').map(v => v.trim()));
                }

                if (typeOrDefault && typeOrDefault !== 'type') {
                    imports.push(typeOrDefault);
                }
            }

            let replaceVal = ' {}';

            if (imports.length && imports.includes(defaults)) {
                replaceVal = ` { ...${defaults} }`;
            }

            const replaceStart = fullDefaults.indexOf(',') + 1;
            const transformedCode = replaceString({
                source: code,
                replace: replaceVal,
                start: defaultsStart + replaceStart,
                end: defaultsEnd - 1,
            });

            return transformedCode;
        },
    };
}
