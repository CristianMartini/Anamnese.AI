// Layout.tsx
import { Outlet } from 'react-router-dom';
import MainNavBar from './MainNavbar'; // Ajuste o path se for ../... 

function Layout() {
  return (
    <>
      <MainNavBar /> {/* <- Chamada */}
      <div style={{ marginTop: '60px' }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
