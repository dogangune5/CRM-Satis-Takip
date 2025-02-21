export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  version: '1.0.0',
  defaultLanguage: 'tr',
  supportedLanguages: ['tr', 'en'],
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiryKey: 'token_expiry',
  apiTimeout: 30000, // 30 seconds
  cacheDuration: 300000, // 5 minutes
  endpoints: {
    auth: {
      login: '/auth/login',
      profile: '/auth/profile',
    },
    customers: '/customers',
    opportunities: '/opportunities',
    proposals: '/proposals',
    orders: '/orders',
    payments: '/payments',
  },
  errorMessages: {
    default: 'Bir hata oluştu',
    network: 'Ağ bağlantısı hatası',
    unauthorized: 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
    notFound: 'İstenilen kayıt bulunamadı',
    validation: 'Lütfen form alanlarını kontrol edin',
  },
};


// 3000 portu, genellikle Node.js tabanlı backend sunucularının varsayılan çalışma portudur 
// Neden Ayrı Portlar Kullanılır?
//Geliştirme Ayrımı: Frontend ve backend'in ayrı portlarda çalıştırılması daha temiz bir geliştirme ortamı sağlar.