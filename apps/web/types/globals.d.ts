// src/types/css.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// برای CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}