// Global utility functions

export default function kebabToCamel(str) { // TODO: utility .js script
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}