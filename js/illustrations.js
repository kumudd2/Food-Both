// Vector illustrations for Smart Cafeteria web platform
window.Illustrations = {
  // Cafeteria Cloche Logo
  ClocheLogo: function({ className = "w-10 h-10" }) {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="26" fill="#5D4BF7"/>
        <path d="M50 22V18" stroke="#FFD166" strokeWidth="4" strokeLinecap="round"/>
        <path d="M43 20C43 20 47 16 50 16C53 16 57 20 57 20" stroke="#FFD166" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="50" cy="28" r="5" fill="#FFFFFF"/>
        <path d="M26 62C26 44.8792 36.7452 35 50 35C63.2548 35 74 44.8792 74 62H26Z" fill="#FFFFFF"/>
        <path d="M22 66C22 64.3431 23.3431 63 25 63H75C76.6569 63 78 64.3431 78 66C78 67.6569 76.6569 69 75 69H25C23.3431 69 22 67.6569 22 66Z" fill="#FFFFFF"/>
        {/* Steam sparkles */}
        <path d="M40 14L42 10M60 14L58 10" stroke="#FFD166" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="68" cy="26" r="2.5" fill="#FFD166"/>
        <circle cx="32" cy="24" r="2" fill="#FFD166"/>
      </svg>
    );
  },

  // Students sharing cafeteria meal
  SplashIllustration: function({ className = "w-full max-w-sm h-auto" }) {
    return (
      <svg className={className} viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Table ellipse */}
        <ellipse cx="170" cy="185" rx="145" ry="45" fill="#EAE5FC"/>
        <ellipse cx="170" cy="180" rx="135" ry="40" fill="#D5CDFA"/>

        {/* Student 1 (Girl holding beverage) */}
        <g>
          <path d="M70 200C70 170 82 150 98 150C114 150 126 170 126 200" fill="#4F46E5"/>
          <ellipse cx="98" cy="115" rx="18" ry="22" fill="#FDBA74"/>
          <path d="M80 110C80 95 90 85 98 85C106 85 116 95 116 110C116 125 112 135 112 135C106 130 90 130 84 135C84 135 80 125 80 110Z" fill="#1E293B"/>
          <path d="M94 122Q98 126 102 122" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="93" cy="114" r="2" fill="#1E293B"/>
          <circle cx="103" cy="114" r="2" fill="#1E293B"/>
        </g>

        {/* Student 2 (Center boy in jacket) */}
        <g>
          <path d="M140 195C140 160 152 142 170 142C188 142 200 160 200 195" fill="#0EA5E9"/>
          <rect x="165" y="128" width="10" height="15" fill="#FED7AA"/>
          <ellipse cx="170" cy="112" rx="19" ry="22" fill="#FED7AA"/>
          <path d="M151 108C151 90 162 82 170 82C178 82 189 90 189 108C180 102 160 102 151 108Z" fill="#0F172A"/>
          <circle cx="164" cy="112" r="2.2" fill="#0F172A"/>
          <circle cx="176" cy="112" r="2.2" fill="#0F172A"/>
          <path d="M166 122Q170 127 174 122" stroke="#C2410C" strokeWidth="2" strokeLinecap="round"/>
        </g>

        {/* Student 3 (Right student with bag) */}
        <g>
          <path d="M210 160L216 195" stroke="#DC2626" strokeWidth="5" strokeLinecap="round"/>
          <path d="M215 198C215 168 228 148 244 148C260 148 272 168 272 198" fill="#EA580C"/>
          <ellipse cx="244" cy="114" rx="18" ry="22" fill="#FDBA74"/>
          <path d="M226 108C226 92 235 84 244 84C253 84 262 92 262 108C255 100 235 100 226 108Z" fill="#334155"/>
          <circle cx="238" cy="113" r="2" fill="#0F172A"/>
          <circle cx="248" cy="113" r="2" fill="#0F172A"/>
          <path d="M240 122Q244 126 248 122" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
        </g>

        {/* Cafeteria Tray on table */}
        <rect x="130" y="170" width="80" height="20" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2"/>
        <ellipse cx="150" cy="177" rx="12" ry="7" fill="#F59E0B"/>
        <rect x="140" y="177" width="20" height="3" fill="#10B981" rx="1"/>
        <ellipse cx="150" cy="181" rx="11" ry="5" fill="#D97706"/>
        <path d="M185 166L188 184H198L201 166Z" fill="#EF4444"/>
        <line x1="193" y1="160" x2="191" y2="170" stroke="#FDE047" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="105" cy="185" rx="14" ry="7" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5"/>
      </svg>
    );
  },

  // Food Tray Illustration (from Login Screen in reference)
  LoginTrayIllustration: function({ className = "w-48 h-36" }) {
    return (
      <svg className={className} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="70" width="164" height="65" rx="14" fill="#3B82F6"/>
        <rect x="23" y="74" width="154" height="57" rx="10" fill="#2563EB"/>

        {/* Burger */}
        <g transform="translate(36, 60)">
          <path d="M10 25C10 11 23 4 36 4C49 4 62 11 62 25H10Z" fill="#F59E0B"/>
          <circle cx="28" cy="14" r="1.5" fill="#FEF3C7"/>
          <circle cx="36" cy="10" r="1.5" fill="#FEF3C7"/>
          <circle cx="44" cy="15" r="1.5" fill="#FEF3C7"/>
          <polygon points="12,25 60,25 50,30 35,26 22,31" fill="#FBBF24"/>
          <rect x="11" y="27" width="50" height="7" rx="3.5" fill="#78350F"/>
          <path d="M10 33C14 31 18 35 22 33C26 31 30 35 34 33C38 31 42 35 46 33C50 31 54 35 62 33" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
          <path d="M12 36C12 36 12 43 36 43C60 43 60 36 60 36H12Z" fill="#D97706"/>
        </g>

        {/* Drink cup with straw */}
        <g transform="translate(100, 32)">
          <path d="M12 25L16 68C16 71 18 73 21 73H39C42 73 44 71 44 68L48 25H12Z" fill="#991B1B"/>
          <rect x="10" y="22" width="40" height="6" rx="3" fill="#E2E8F0"/>
          <path d="M30 22L34 5L44 8" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="30" cy="46" r="8" fill="#FEE2E2"/>
          <circle cx="30" cy="46" r="4" fill="#DC2626"/>
        </g>

        {/* Golden french fries */}
        <g transform="translate(138, 55)">
          <path d="M6 35L11 65C11 67 13 69 15 69H37C39 69 41 67 41 65L46 35H6Z" fill="#DC2626"/>
          <ellipse cx="26" cy="35" rx="20" ry="6" fill="#B91C1C"/>
          <rect x="12" y="16" width="5" height="25" rx="2" fill="#FBBF24" transform="rotate(-10 12 16)"/>
          <rect x="19" y="10" width="5" height="30" rx="2" fill="#F59E0B" transform="rotate(-2 19 10)"/>
          <rect x="26" y="8" width="5.5" height="32" rx="2" fill="#FBBF24"/>
          <rect x="33" y="12" width="5" height="28" rx="2" fill="#F59E0B" transform="rotate(8 33 12)"/>
          <rect x="38" y="18" width="5" height="22" rx="2" fill="#FBBF24" transform="rotate(15 38 18)"/>
        </g>

        {/* Sparkles */}
        <path d="M175 40L177 34L183 36L177 38L175 44L173 38L167 36L173 34Z" fill="#C084FC"/>
        <path d="M25 50L26 46L30 47L26 48L25 52L24 48L20 47L24 46Z" fill="#C084FC"/>
      </svg>
    );
  },

  // Promo Banner Student
  BannerStudentIllustration: function({ className = "w-28 h-32" }) {
    return (
      <svg className={className} viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="65" r="48" fill="rgba(255, 255, 255, 0.15)"/>
        <path d="M30 115C30 92 40 82 55 82C70 82 80 92 80 115" fill="#4338CA"/>
        <ellipse cx="55" cy="55" rx="16" ry="19" fill="#FDBA74"/>
        <path d="M38 52C38 36 46 30 55 30C64 30 72 36 72 52C66 45 44 45 38 52Z" fill="#1E1B4B"/>
        <circle cx="50" cy="54" r="1.8" fill="#1E1B4B"/>
        <circle cx="60" cy="54" r="1.8" fill="#1E1B4B"/>
        <path d="M52 62Q55 65 58 62" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Smartphone */}
        <rect x="76" y="68" width="14" height="26" rx="3" fill="#1E293B" transform="rotate(10 76 68)"/>
        <rect x="78" y="71" width="10" height="20" rx="2" fill="#38BDF8" transform="rotate(10 78 71)"/>
        {/* Takeout bag */}
        <g transform="translate(18, 70)">
          <path d="M8 12L12 40H32L36 12H8Z" fill="#D97706"/>
          <path d="M12 12V6C12 3.8 13.8 2 16 2H28C30.2 2 32 3.8 32 6V12" stroke="#B45309" strokeWidth="2.5" fill="none"/>
          <circle cx="22" cy="24" r="5" fill="#FEF3C7"/>
        </g>
      </svg>
    );
  },

  // Google SSO
  GoogleIcon: function() {
    return (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    );
  },

  // College ID Badge
  CollegeIdIcon: function() {
    return (
      <svg className="w-5 h-5 mr-2 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M3 10h18"/>
        <path d="M5 6l7-3 7 3"/>
        <path d="M4 10v11"/>
        <path d="M20 10v11"/>
        <path d="M8 14v4"/>
        <path d="M12 14v4"/>
        <path d="M16 14v4"/>
      </svg>
    );
  }
};
