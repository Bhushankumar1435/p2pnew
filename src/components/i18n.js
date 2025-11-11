// i18n.js
const translations = {
  en: {
    home: "Home",
    contact: "Contact Us",
    welcome: "Welcome, {{name}}!",
    Settings: "Settings",
    P2p: 'P2P',
    Orders: 'Orders',
    ad: 'Ad',
    CreateAd: 'Create Ad',
    profile: "Profile",
    hello: "Hello",
    Account: "Account",
    Language: "Language",
    English: "English",
    Hindi: "Hindi",
    French: "French",
    AccountManagement: 'Account Management',
    editProfile: 'Edit Profile',
    Notifications: "Notifications",
    WalletAddress: "Wallet address (BEP20)",
    AddPaymentMethos: "Add Payment Methods",
    HelpFeedback: "Help & feedback",
    About: 'About',
    Logout: 'Log Out',
    AddPaymentMethod: 'Add Payment Methods',
    bankDetails: 'Bank Details',
    addBankDetails: 'Add Bank Details',
    UPIDetails: 'UPI Details',
    NameInBank: 'Name (as per bank records)',
    bankAccount: 'Account Number',
    ifscCode: 'IFSC Code',
    bankName: 'Bank Name',
    confirm: 'Confirm',
    yourUPI:'Your UPI ID',
    Delete: 'Delete'
  },
  hi: {
    home: "होम",
    welcome: "स्वागत है, {{name}}!",
    Settings: "सेटिंग्स",
    P2p: 'पी2पी',
    Orders: 'आदेश',
    ad: 'विज्ञापन',
    CreateAd: 'विज्ञापन बनाएं',
    profile: "प्रोफ़ाइल",
    hello: "नमस्ते",
    Account: "खाता",
    Language: "भाषा",
    English: "अंग्रेज़ी",
    Hindi: "हिन्दी",
    French: "फ़्रेंच",
    AccountManagement: 'खाता प्रबंधन',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    Notifications: "सूचनाएं",
    WalletAddress: "वॉलेट पता (BEP20)",
    AddPaymentMethos: "भुगतान विधियाँ जोड़ें",
    HelpFeedback: "सहायता एवं प्रतिक्रिया",
    About: 'के बारे में',
    Logout: 'लॉग आउट',
    AddPaymentMethod: 'भुगतान विधियाँ जोड़ें',
    bankDetails: 'बैंक विवरण',
    addBankDetails: 'बैंक विवरण जोड़ें',
    UPIDetails: 'यूपीआई विवरण',
    NameInBank: 'नाम (बैंक रिकॉर्ड के अनुसार)',
    bankAccount: 'खाता संख्या',
    ifscCode: 'आईएफएससी कोड',
    bankName: 'बैंक का नाम',
    confirm: 'पुष्टि करें',
    yourUPI:'आपकी यूपीआई आईडी',
    Delete: 'मिटायें'

  },
  fr: {
    home: "Accueil",
    contact: "Contactez-nous",
    welcome: "Bienvenue, {{name}}!",
    Settings: "Paramètres",
    P2p: 'P2P',
    Orders: 'Orders',
    ad: 'Annonce',
    CreateAd: 'Créer Une Annonce',
    profile: "Profil",
    Account: "Compte",
    Language: "Langue",
    English: "English"    ,
    English: "Anglaise",
    Hindi: "Hindi",
    French: "française",
    AccountManagement: 'Gestion des comptes',
    editProfile: 'Modifier le profil',
    Notifications: "Notifications",
    WalletAddress: "Adresse de portefeuille (BEP20)",
    AddPaymentMethos: "Ajouter des méthodes de paiement",
    HelpFeedback: "Aide et commentaires",
    About: 'À propos',
    Logout: 'Se déconnecter',
    AddPaymentMethod: 'Ajouter des méthodes de paiement',
    bankDetails: 'Coordonnées bancaires',
    addBankDetails: 'Ajouter des coordonnées bancaires',
    UPIDetails: 'Détails UPI',
    NameInBank: 'Nom (selon les relevés bancaires)',
    bankAccount: 'Numéro de compte',
    ifscCode: 'Code IFSC',
    bankName: 'Nom de la banque',
    confirm: 'Confirmer',
    yourUPI:'Votre identifiant UPI',
    Delete: 'Supprimer'
  }
};

let currentLang = localStorage.getItem("current_lang"); // default

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('current_lang', lang);
  location.reload()
}

export function t(key, vars = {}) {
  let text =
    translations[currentLang]?.[key] ||
    translations['en']?.[key] || 
    key;

  if (!translations[currentLang]?.[key]) {
    console.warn(`Missing translation for key: "${key}" in "${currentLang}"`);
  }

  // Interpolation
  Object.keys(vars).forEach(k => {
    text = text.replace(`{{${k}}}`, vars[k]);
  });

  return text;
}
