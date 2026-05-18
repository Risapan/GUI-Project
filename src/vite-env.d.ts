declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (msg: string) => string;
  }
}

export {};
