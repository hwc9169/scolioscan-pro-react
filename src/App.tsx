import { type ReactElement } from 'react';
import { Login } from './pages/Login';
import { FullSheetProvider } from './contexts/FullSheetContext';
import { CacheStorageProvider } from './contexts/CacheStorageContext';
import { FullSheetProvider as FullSheetRenderer } from './components/FullSheet/FullSheetProvider';

function App(): ReactElement {
  return (
    <FullSheetProvider>
      <CacheStorageProvider>
        <Login />
        <FullSheetRenderer />
      </CacheStorageProvider>
    </FullSheetProvider>
  );
}

export default App;
