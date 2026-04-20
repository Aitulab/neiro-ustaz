import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { I18nProvider } from './i18n/i18n'
import { AuthProvider } from './state/auth'
import { ProgressProvider } from './state/progress'
import { AchievementsProvider } from './state/achievements'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <ProgressProvider>
          <AchievementsProvider>
            <App />
          </AchievementsProvider>
        </ProgressProvider>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>,
)
