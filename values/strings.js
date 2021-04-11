const errors = {
  "AliasExistsException": {
    title: 'כתובת מייל זו כבר קיימת במערכת.',
    yes: 'אישור'  
  },
  "report_lot_logged_in": {
    title: 'קרתה שגיאה, אנא נסו שנית.',
    yes: 'אישור'  
  },
  "UsernameExistsException": {
    title: 'אימייל כבר קיים במערכת.',
    yes: 'אישור'  
  },
  "UserNotFoundException": {
    title: 'משתמש לא קיים במערכת.',
    yes: 'אישור'  
  },
  "short_password": {
    title: 'הסיסמה צריכה להיות לפחות באורך 8 תווים.',
    yes: 'אישור'  
  },
  "enter_code": {
    title: 'אנא הזינו את הקוד שנשלח אליכם באימייל.',
    yes: 'אישור'  
  },
  "CodeMismatchException": {
    title: 'הקוד שהוזן שגוי.',
    yes: 'אישור'
  },
  "NotAuthorizedException": {
    title: 'שם משתמש או סיסמה שגויים.',
    yes: 'אישור'
  },
  "NetworkError": {
    title: 'נראה שיש בעיה עם החיבור לאינטרנט.',
    yes: 'אישור'
  },
  "enter_name": {
    title: 'אנא מלאו שם מלא.',
    yes: 'אישור'
  },
  "invalid_email": {
    title: 'כתובת אימייל לא תקינה.',
    yes: 'אישור'
  },
}

export const strings = {
  pleaseSelectLocation: (fetchingPlace) => {
    if (fetchingPlace) {
      return 'מחפשים אתר טבע בקרבתכם...'
    } else {
      return 'אנא בחרו אתר טבע'
    }
  },
  code: 'קוד',
  showInfo: 'הצג\nמידע',
  popups: {
    waze: {
      title: 'לפתוח הוראות ניווט עם Waze?',
      yes: "יאללה, מגניב",
      no: 'פעם אחרת',
    },
    halaWebsite: {
      title: 'לעבור לאתר החברה להגנת הטבע?',
      yes: "יאללה, מגניב",
      no: "בהזדמנות",
    },
    signupNow: {
      title: 'כדי להשתמש בנקודות צמיחה צריך להירשם לבשביל הטבע.\n\nשנעשה את זה עכשיו?',
      yes: 'אני בעניין',
      no: 'אחר כך'
    },
    empty: {
      title: "",
      yes: "",
      no: ""
    },
    loginError: (code) => {
      return errors[code] ?? {
        title: 'אירעה שגיאה, אנה נסו שוב.',
        yes: 'אישור'
      }
    },
    cantBuy: {
      title: 'אין מספיק נקודות טבע.\nשחקו עוד באפליקציה כדי לצבור עוד נקודות.',
      yes: 'אחלה'
    },
    locationPermissions: {
      title: "כדי שנוכל למצוא לך אתרי טבע\nבסביבתך נצטרך גישה למיקום שלך.",
      yes: "יאללה, מגניב",
      no: "בהזדמנות",
    },
    pushPermissions: {
      title: "תרצו שנזכיר לכם לעדכן אותנו במצב הטבע אחרי שטיילתם?",
      yes: "יאללה, מגניב",
      no: "בהזדמנות",
    },
    exitReport: {
      title: "יציאה באמצע דיווח תמחק אותו.\nבטוח שתרצה לצאת?",
      no: "כן, בוא נצא", // because reverse buttons
      yes: "לא, בוא נמשיך",
    },
    camera: {
      title: "נא לאשר הרשאות למצלמה בהגדרות",
      yes: "קדימה",
      no: "בהזדמנות",
    },
    gallery: {
      title: "נא לאשר הרשאות לתמונות בהגדרות",
      yes: "קדימה",
      no: "בהזדמנות",
    },
  },
  continue: "המשך",
  guest: 'אורח/ת',
  or: "או",
  email: "אימייל",
  fullName: "שם מלא",
  password: "סיסמה",
  login: "התחברות",
  logout: "התנתקות",
  distanceFromYou: (distance) => {
    return `${distance ?? `-`} ק״מ ממך`;
  },
  distanceFromYouAlt: (distance) => {
    let str = "";
    str += `km`;
    str += ` ${distance} `;
    str += "ממך";
    return str;
  },
  onboardingScreen: {
    lastButtonTitle: 'בואו נתחיל',
    secondButton: 'בואו נמשיך',
    firstButton: 'בשביל זה אני פה',
    skipButton: 'דילוג',
    newTitle: 'ברוכים הבאים!',
    newDescription: 'כאן תוכלו לדווח בקלות,\nלהתעדכן, ולהשפיע על מצב\nהניקיון באתרי הטבע היפים\nשל ארצנו.',
    item1: "גלו אתרי טבע שלא הכרתם",
    item2: "דווחו מהשטח והשפיעו על מצב הטבע",
    item3: "צברו נקודות ועלו שלבים",
    newItem1: 'חפשו מבין מאות אתרי טבע וגלו\nאם הם נקיים או מלוכלכים,\nריקים מאדם או עמוסים במבקרים',
    newItem2: 'דווחו על מצב הניקיון והעומס\nבמבקרים ועזרו למטיילים אחרים\nלטייל חכם ולנו לשפר את מצב הטבע.',
    newItem3: `התקדמו עם כל דיווח בסולם\nהמעורבות של ״בשביל הטבע״.`,
    done: 
    "השתמשו בנקודות שצברתם" + "\n" + 
    "כדי לגלות מהו עומס המבקרים" + "\n" +
    "באתר בו תרצו לטייל",
    coolButton: "מגניב",
  },
  placeScreen: {
    ranksTitle: (cleanness) => {
      return cleanness ? 'רמת הניקיון' : 'עומס במבקרים'
    },
    infoDesc: 'אתרי הטבע באפליקציית ״בשביל הטבע״ מציגים דירוג לרמת הנקיון והעומס במבקרים באתר. הדירוג לאתרי הטבע נקבע על ידי משתמשים כמוך ומתעדכן כל הזמן.',
    infoTitle: 'סולם דירוג אתרי טבע',
    sharePlace: (name) => {
      return `מצאתי באפליקציית "בשביל הטבע" את ${name.trim()} וחשבתי שיעניין אתכם`
    },
    recentVisitors: (locked) => {
      return 'מבקר אחרון';
    },
    cleannessTitle: (locked) => {
      // return locked ? "מצב וניקיון הטבע" : "מצב הטבע";
      return 'רמת הניקיון באתר';
    },
    crowdnessTitle: (small) => {
      return small ? 
      `עומס מטיילים בסופ"ש` :
      `עומס מבקרים בסופ"ש`
    },
    waze: 'הגיעו לאתר הטבע\nבאמצעות ניווט',
    share: 'שתפו את אתר\nהטבע עם חברים',
    report: 'צרו דיווח משלכם\nלאתר הטבע',
  },
  homeScreen: {
    recentVisitor: (male) => {
      return 'מדווחים הכי פעילים'
      // return male !== 0 ? "ביקר לאחרונה" : "ביקרה לאחרונה";
    },
  },
  exploreScreen: {
    suggestionSent: 'ההצעה נשלחה, תודה!',
    newPlaceSuggestion: (name) => {
      return `הציעו את ״${name}״ כאתר חדש`
    },
    didntFindTitle: 'לא מצאנו במאגר שלנו את אתר הטבע...',
    globalSites: 'אתר מדד בשביל הטבע',
    searchPlaceholder: "חפש",
  },
  progressScreen: {
    thankYou: "תודה לך!",
    signup: "הרשמה",
    logout: "התנתקות",
    reportsTitle: "דיווחים מהשטח",
    pointsTitle: "נק‘ טבע",
  },
  loginScreen: {
    passwordLength: '(8 תווים)',
    title: "התחברות למדד הטבע",
    signupTitle: "הרשמה למדד הטבע",
    updateDetailsTitle: "שינוי פרטים אישיים",
    login: "התחברות",
    signup: "הרשמה",
    forgotPassword: "שכחתי סיסמה",
    finishSignup: "סיום הרשמה",
    updateDetails: "עדכון שינויים",
    profilePic: "תמונת פרופיל",
    notMandatory: '(לא חובה)',
    restorePassword: "שחזור סיסמה",
    restorePasswordButton: "שחזר סיסמה",
    emailSentButton: "אוקיי, אבדוק",
    emailSentDesc: 
    "קוד אימות נשלח אליכם למייל," +
    "\n" + 
    "אנא הזינו אותו בשלב הבא ובחרו סיסמה חדשה.",
    chooseNewPasswordTitle: "בחר סיסמה חדשה",
    chooseNewPasswordTitle: "החלף סיסמה",
  },
  reportScreen: {
    nextTime: 'בפעם אחרת',
    gladToJoin: 'אשמח להצטרף ולעזור',
    searchNewPlace: 'על איזה אתר טבע\nנדווח היום?',
    sharePlace: (name) => {
      return `דיווחתי ועזרתי לשמור על הטבע ב${name.trim()} עם אפליקציית בשביל הטבע`
    },
    scrollHint: "גרירה למטה ולמעלה\nכדי לבחור ציון",
    share: "שיתוף",
    done: "סגירה",
    doneTitle: (user) => {
      return user != null
        ? `תודה ששיתפת אותנו ${user.name.split(' ')[0]},\nעזרת לנו מאוד לשמור על הטבע.`
        : 'תודה ששיתפתם אותנו!\nהצטרפו לקהילת הפעילים שלנו, עזרו לשמור על הטבע וצברו 100 נקודות טבע על הדיווח.';
    },
    additionalInfo: "מידע נוסף שחשוב שנדע",
    finishButton: "סיום דיווח",
    takePic1: "הפרטים הבאים אינם חובה",
    takePic2: "צילום המקום",
    goBack: "חזרה",
    newReport: "דיווח חדש",
    cleanTitle: "מה מצב הניקיון\nוהטבע במקום?",
    cleanTitles: [
      'ממש מלוכלך',
      'קצת מלוכלך',
       'ככה ככה',
       'נקי'
       ,'ממש נקי'
      ],
    crowdTitle: "מה מצב עומס\nהמבקרים במקום?",
    crowdTitles: [
      "עמוס מאוד", 
      "עמוס",
      "סביר",
      'מעט אנשים'
      , "ריק מאדם"
    ],
    otherPeople: (num) => {
      if (num === 0) {
        return 'אתם המדווחים הראשונים,\nכל הכבוד!'
      } else {
        return `${num} אנשים דיווחו כמוך`
      }
    },
  },
};
