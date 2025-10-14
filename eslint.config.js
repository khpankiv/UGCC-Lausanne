module.exports = [
  {
    ignores: [
      'node_modules/**',
      '**/vendor/**',
      '**/*.min.js'
    ]
  },
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        document: 'readonly',
        window: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }]
    }
  }
];
