import React from 'react'
import Header from '../../components/Header'
import { t, setLang } from '../../components/i18n'
import Footer from '../../components/Footer'
import AccountIcon from '../../assets/svgs/account.svg'
import ProfileIcon from '../../assets/svgs/profile.svg'
import NotificationIcon from '../../assets/svgs/notifications.svg'
import Wallet from '../../assets/svgs/waallet.svg'
import PaymentMethod from '../../assets/svgs/payment_method.svg'
import LanguageIcon from '../../assets/svgs/language.svg'
import HelpIcon from '../../assets/svgs/help.svg'
import LogoutIcon from '../../assets/svgs/logout.svg'
import InformationIcon from '../../assets/svgs/info.svg'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
// import ComingSoon from '../components/ComingSoon'


const Settings = () => {
  const navigate = useNavigate()
  const currentLang = localStorage.getItem("current_lang") || "en"

  const changeLanguage = (e) => {
    setLang(e.target.value)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('isAuthenticated')
    toast.success('Logged out successfully!')
    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  // ✅ Move settingsItems here to access currentLang and changeLanguage
  const settingsItems = [
    {
      icon: React.createElement("img", {
        src: AccountIcon,
        alt: "Account",
        className: "w-5 h-5"
      }),
      label: t("AccountManagement"),
      link: "/account"
    },
    {
      icon: <img src={ProfileIcon} alt="Notifications" className="w-5 h-5" />,
      label: t('editProfile'),
      link: '/editprofile',
    },
    {
      icon: <img src={NotificationIcon} alt="Notifications" className="w-5 h-5" />,
      label: t('Notifications'),
      link: '/notifications',
    },
    {
      icon: <img src={Wallet} alt="Wallet" className="w-5 h-5" />,
      label: t('WalletAddress'),
      link: '/wallet',
    },
    {
      icon: <img src={PaymentMethod} alt="Payment Method" className="w-5 h-5" />,
      label: t('AddPaymentMethos'),
      link: '/paymentmethod',
    },
    {
      icon: <img src={LanguageIcon} alt="Language" className="w-5 h-5" />,
      label: t('Language'),
      action: (
        <div className="relative w-full max-w-[200px]">
          <select
            onChange={changeLanguage}
            value={currentLang}
            className="focus:outline-0 focus:box-shadow-none focus:border-gray-300  block appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 font-medium focus:outline-none text-[15px] "
          >
            <option className="text-left" value="en">{t('English')}</option>
            <option className="text-left" value="hi">{t('Hindi')}</option>
            <option className="text-left" value="fr">{t('French')}</option>
          </select>
          {/* Custom arrow icon */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      icon: React.createElement("img", {
        src: HelpIcon,
        alt: "Help",
        className: "w-5 h-5"
      }),
      label: t("HelpFeedback"),
      link: "/help"
    },
    {
      icon: <img src={InformationIcon} alt="About" className="w-5 h-5" />,
      label: t('About'),
      link: '/about',
    },
  ]

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black ">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
          <ToastContainer position="top-right" autoClose={3000} />
          <Header />
          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
            <div className='w-full  pt-3'>
              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-300">{t('Settings')}</h1>

              {/* Settings List */}
              <div className="w-full">
                {settingsItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pl-4 border-b border-gray-300">
                    {item.link ? (
                      <Link to={item.link} className="flex items-center gap-2 py-4 flex-1">
                        <span>{item.icon}</span>
                        <span className="font-medium text-[15px]">{item.label}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 py-4">
                        <span>{item.icon}</span>
                        <span className="font-medium text-[15px]">{item.label}</span>
                      </div>
                    )}
                    {item.action && <div className="pr-4">{item.action}</div>}
                  </div>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  type='button'
                  className="flex items-center  px-4 py-3 text-sm text-[var(--logout)] font-medium"
                >

                  <img src={LogoutIcon} />
                  <span className='pl-2'>{t('Logout')}</span>
                </button>
              </div>

              <div className="mt-auto py-4 text-center text-xs text-gray-500">
                <div className="flex justify-center items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c.867 0 1.625-.367 2.2-.958M18 8a6 6 0 11-12 0 6 6 0 0112 0zm-4.243 7.243a5 5 0 00-7.071 0M15 19.5a3.5 3.5 0 00-6 0"
                    />
                  </svg>
                  <span>A secure P2P service provider</span>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Settings
