import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      logout();
      navigate('/login');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'Aluno';
      case 'ADMIN':
        return 'Administrador';
      case 'GUARD':
        return 'Vigia';
      default:
        return role;
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <header className="bg-gradient-to-r from-[#2d8659] to-[#1a5f3f] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo-ifma.png" 
              alt="IFMA" 
              className="h-8 md:h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            {user.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/requests"
                  className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-all ${
                    isActive('/admin/requests')
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  Requisições
                </Link>
                <Link
                  to="/admin/guards"
                  className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-all ${
                    isActive('/admin/guards')
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  Cadastrar Vigia
                </Link>
              </>
            )}

            {user.role === 'STUDENT' && (
              <Link
                to="/student/requests"
                className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-all ${
                  isActive('/student/requests')
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Minhas Requisições
              </Link>
            )}

            {user.role === 'GUARD' && (
              <Link
                to="/guard/agenda"
                className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-all ${
                  isActive('/guard/agenda')
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Agenda
              </Link>
            )}
          </nav>

          {/* Menu do Usuário */}
          <div className="flex items-center gap-4 pl-4 border-l border-white/20">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs opacity-80">{getRoleLabel(user.role)}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/90 hover:bg-red-600 rounded-[5px] text-sm font-medium transition-all hover:-translate-y-0.5"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
