import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            compilationMode: 'infer', // 자동으로 컴포넌트와 훅 감지
          }],
        ],
      },
    }),
  ],
})
