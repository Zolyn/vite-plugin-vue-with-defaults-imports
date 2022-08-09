# vite-plugin-vue-with-defaults-imports

Import defaults in Vue SFC for withDefaults

## Installation

```bash
# ni
ni -D vite-plugin-vue-with-defaults-imports

# npm
npm i -D vite-plugin-vue-with-defaults-imports

# yarn
yarn add -D vite-plugin-vue-with-defaults-imports

# pnpm
pnpm add -D vite-plugin-vue-with-defaults-imports
```

## Usage

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueWithDefaultsImports from 'vite-plugin-vue-with-defaults-imports';

export default defineConfig({
    plugins: [Vue(), VueWithDefaultsImports()],
});
```

## Example

```vue
<script setup lang="ts">
import { propsDefaults } from './defaults';

interface Props {
    foo: string;
    bar: number;
}

const props = withDefaults(defineProps<Props>(), propsDefaults);
</script>
```

```typescript
// defaults.ts

export const propsDefaults = {
    foo: 'foo',
    bar: 1,
};
```

<details>
<summary>Output</summary>

```vue
<script setup lang="ts">
import { propsDefaults } from './defaults';

interface Props {
    foo: string;
    bar: number;
}

const props = withDefaults(defineProps<Props>(), { ...propsDefaults });
</script>
```

</details>

## How it works

How it works is very simple, it just turns `defaults` into `{ ...defaults }` to force Vue to [fallback to runtime merging](https://github.com/vuejs/core/blob/769e5555f9d9004ce541613341652db859881570/packages/compiler-sfc/src/compileScript.ts#L678-L682)

## License

[MIT](LICENSE)
