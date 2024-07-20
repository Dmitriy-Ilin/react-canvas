import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Canvas from './components/Canvas';
import SettingBar from './components/Settingbar';
import ToolBar from './components/Toolbar';

import './scss/main.scss';

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route
            path='/:id'
            element={
              <>
                <ToolBar />
                <SettingBar />
                <Canvas />
              </>
            }
          />
          <Route
            path='/'
            element={
              <>
                <ToolBar />
                <SettingBar />
                <Canvas />
                <Navigate to={`/f${(+new Date()).toString(16)}`} replace />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
