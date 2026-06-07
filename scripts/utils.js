// Global utility functions
import { ctx } from "./dom.js";

export function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function drawCircle(color, obj) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(obj.x + obj.radius, obj.y + obj.radius, obj.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

export default { kebabToCamel, drawCircle }