declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': {
      url?: string;
      loading?: 'lazy' | 'eager';
      style?: React.CSSProperties;
    };
  }
}
