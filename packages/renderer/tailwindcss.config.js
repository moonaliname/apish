const content_prefix =
  process.env.NODE_ENV === 'development' ? './packages/renderer' : '.'

export default {
  content: [
    `${content_prefix}/src/**/*.{js,ts,jsx,tsx}`,
    `${content_prefix}/index.html`,
  ],
  theme: { extend: {} },
  plugins: [],
}
