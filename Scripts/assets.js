// Handles asset loading

// Variable names are base filenames in camelCase
const FileLoader = {
    assets: {},

    getType(url) {
        const ext = url.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
        if (['json'].includes(ext)) return 'json';
        if (['txt', 'csv', 'md'].includes(ext)) return 'text';
        if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
        return 'blob';
    },

    // derive a safe variable name from path (filename without extension)
    keyFromPath(path) {
        const parts = path.split('/');
        const name = parts[parts.length - 1].replace(/\.[^/.]+$/, '');
        // normalize: allow letters, numbers, underscore; replace others with _
        return name.replace(/[^\w]/g, '_');
    },

    // load a single resource and return a Promise resolving to its value
    loadOne(path) {
        const type = this.getType(path);
        const key = this.keyFromPath(path);

        if (type === 'image') {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.assets[key] = img;
                    resolve({ key, value: img });
                };
                img.onerror = (e) => reject(new Error(`Image load failed: ${path}`));
                img.src = path;
            });
        }

        if (type === 'audio') {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.onloadeddata = () => {
                    this.assets[key] = audio;
                    resolve({ key, value: audio });
                };
                audio.onerror = () => reject(new Error(`Audio load failed: ${path}`));
                audio.src = path;
            });
        }

        // Fetch-based loaders for json, text, blob
        return fetch(path).then(async (res) => {
            if (!res.ok) throw new Error(`Fetch failed: ${path} (${res.status})`);
            if (type === 'json') {
                const j = await res.json();
                this.assets[key] = j;
                return { key, value: j };
            }
            if (type === 'text') {
                const t = await res.text();
                this.assets[key] = t;
                return { key, value: t };
            }
            // blob fallback (e.g., binary files). store blob and object URL
            const b = await res.blob();
            const url = URL.createObjectURL(b);
            this.assets[key] = { blob: b, url };
            return { key, value: { blob: b, url } };
        });
    },

    // load many paths in parallel; returns Promise resolving to assets object
    loadAll(paths = []) {
        const loads = paths.map(p => this.loadOne(p));
        return Promise.allSettled(loads).then(results => {
            const errors = results
                .filter(r => r.status === 'rejected')
                .map(r => r.reason?.message || r.reason);
            if (errors.length) {
                // still return assets but surface errors
                return { assets: this.assets, errors };
            }
            return { assets: this.assets };
        });
    }
};

// // Example call:
// FileLoader.loadAll(defaultUnlocks).then(result => {
//     if (result.errors) console.warn('Some loads failed:', result.errors);
//     // access loaded items:
//     // FileLoader.assets.alphaSS1 -> HTMLImageElement
//     // FileLoader.assets.config -> parsed JSON
//     // FileLoader.assets.license -> string
//     console.log(FileLoader.assets);
// });