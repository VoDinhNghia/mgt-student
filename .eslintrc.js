module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: { // These rules are for reference only.
    'prettier/prettier': ['error', {
      'endOfLine': 'auto',
    }],
    'class-methods-use-this': 'off',
    // https://github.com/typescript-eslint/typescript-eslint/issues/1277
    'consistent-return': 'off',
    // 'func-names': 'off',
    // 'max-len': ['error', { 'code': 140, 'ignoreTemplateLiterals': true }],
    'newline-per-chained-call': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    // https://github.com/airbnb/javascript/issues/1342
    'no-param-reassign': ['error', { 'props': false }],
    // https://github.com/airbnb/javascript/issues/1271
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L334-L352
    // 'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
    'no-void': ['error', { 'allowAsStatement': true }],
    'object-curly-newline': 'off',
    'spaced-comment': ['error', 'always', { 'line': { 'markers': ['/', '#region', '#endregion'] } }],

    // Change eslint rule to @typescript-eslint rule
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    'no-dupe-class-members': 'off',
    'no-duplicate-imports': 'off',
    'no-loop-func': 'off',
    'no-return-await': 'off',
    'no-unused-expressions': 'off',
    'object-curly-spacing': 'off',

    // 'import/extensions': ['error', 'never'],
    // https://github.com/benmosher/eslint-plugin-import/issues/1753
    // 'import/named': 'off',
    // 'import/no-default-export': 'error',
    // 'import/order': ['error', { 'groups': [['builtin', 'external', 'internal']], 'newlines-between': 'always', 'alphabetize': { 'order': 'asc', 'caseInsensitive': true } }],
    'import/prefer-default-export': 'off',

    '@typescript-eslint/consistent-indexed-object-style': 'error',
    '@typescript-eslint/consistent-type-assertions': ['error', { 'assertionStyle': 'angle-bracket' }],
    // '@typescript-eslint/explicit-function-return-type': 'error',
    // '@typescript-eslint/explicit-member-accessibility': ['error', { 'overrides': { 'constructors': 'no-public' } }],
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/naming-convention': ['error',
      { 'selector': 'default', 'format': ['strictCamelCase'] },
      { 'selector': 'variable', 'format': ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'] },
      // https://github.com/microsoft/TypeScript/issues/9458
      { 'selector': 'parameter', 'modifiers': ['unused'], 'format': ['strictCamelCase'], 'leadingUnderscore': 'allow' },
      { 'selector': 'property', 'format': null },
      { 'selector': 'typeProperty', 'format': null },
      { 'selector': 'typeLike', 'format': ['StrictPascalCase'] },
      { 'selector': 'enumMember', 'format': ['UPPER_CASE'] }
    ],
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-duplicate-imports': 'error',
    // '@typescript-eslint/no-floating-promises': ['error', { 'ignoreIIFE': true, 'ignoreVoid': true }],
    // '@typescript-eslint/no-inferrable-types': ['error', { 'ignoreParameters': true, 'ignoreProperties': true }],
    // '@typescript-eslint/no-loop-func': 'error',
    // '@typescript-eslint/no-misused-promises': ['error', { 'checksVoidReturn': false }],
    // '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    // '@typescript-eslint/no-unnecessary-condition': 'warn',
    // '@typescript-eslint/no-unnecessary-qualifier': 'error',
    // '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    // '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    // '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/no-unsafe-member-access': 'off',
    // '@typescript-eslint/no-unused-expressions': 'error',
    // '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    // '@typescript-eslint/prefer-includes': 'off',
    // '@typescript-eslint/prefer-optional-chain': 'error',
    // '@typescript-eslint/promise-function-async': 'error',
    // '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/return-await': 'error',
    // '@typescript-eslint/typedef': ['error', { 'memberVariableDeclaration': true, 'parameter': true, 'propertyDeclaration': true }],
    // '@typescript-eslint/unbound-method': ['error', { 'ignoreStatic': true }],

    'sonarjs/no-duplicate-string': 'off'
  }
};
