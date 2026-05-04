import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // 
  {
    // Define el entorno global del código para reconocer variables específicas
    "env": {
      "node": true,     // Habilita variables globales de Node.js (ej.: process, require, module)
      "es2021": true    // Habilita características del estándar ECMAScript 2021
    },
  
    // Extiende reglas recomendadas por ESLint
    "extends": ["eslint:recommended"],
  
    // Opciones para que ESLint analice correctamente el código
    "parserOptions": {
      "ecmaVersion": 12,        // Permite usar sintaxis ECMAScript versión 12 (2021)
      "sourceType": "module"    // Indica que el código utiliza módulos ES (import/export)
    },
  
    // Aquí puedes añadir reglas personalizadas para ESLint
    "rules": {}
  },  
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
