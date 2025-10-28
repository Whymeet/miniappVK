import { Spinner } from '@vkontakte/vkui';

export default function LoadingScreen() {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      zIndex: 9999
    }}>
      {/* Логотип или название */}
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: '#FFFFFF',
        marginBottom: '24px',
        textAlign: 'center',
        padding: '0 20px',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        💰 Кубышка займ
      </div>
      
      {/* Спиннер */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <Spinner size="large" style={{ color: '#FFFFFF' }} />
      </div>
      
      {/* Текст загрузки */}
      <div style={{
        marginTop: '24px',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.9)',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        Загрузка предложений...
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

