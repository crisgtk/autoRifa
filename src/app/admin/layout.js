/**
 * Layout principal para el panel de administración.
 * Aísla la administración de los estilos globales públicos y define la estructura básica.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos.
 * @returns {React.ReactElement} Elemento React.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout-root" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {children}
    </div>
  );
}
