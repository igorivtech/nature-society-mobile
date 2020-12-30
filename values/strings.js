const errors = {
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
  pleaseSelectLocation: 'אנא בחרו אתר טבע',
  code: 'קוד',
  showInfo: 'הצג\nמידע',
  popups: {
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
      title: "כדי שנוכל להתאים לך אתרי טיול\nבסביבתך נצטרך גישה למיקום שלך.",
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
  guest: "אורח",
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
    item1: "גלו אתרי טבע שלא הכרתם",
    item2: "דווחו מהשטח והשפיעו על מצב הטבע",
    item3: "צברו נקודות ועלו שלבים",
    done: 
    "השתמשו בנקודות שצברתם" + "\n" + 
    "כדי לגלות מהו עומס המבקרים" + "\n" +
    "באתר בו תרצו לטייל",
    coolButton: "מגניב",
  },
  placeScreen: {
    sharePlace: (name) => {
      return `מצאתי באפליקציית "בשביל הטבע" את ${name} וחשבתי שיענין אתכם`
    },
    recentVisitors: (locked) => {
      return 'מבקר אחרון';
    },
    cleannessTitle: (locked) => {
      // return locked ? "מצב וניקיון הטבע" : "מצב הטבע";
      return "מצב וניקיון הטבע";
    },
    crowdnessTitle: (small) => {
      return small ? 
      "עומס מטיילים" :
      "עומס מבקרים"
    },
    waze: "הגיעו למקום\nעם Waze",
    share: "שתפו את המקום\nעם חברים",
    report: "כתבו דיווח\nמשלכם למקום",
  },
  homeScreen: {
    recentVisitor: (male) => {
      return male !== 0 ? "ביקר לאחרונה" : "ביקרה לאחרונה";
    },
  },
  exploreScreen: {
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
    title: "התחברות למדד הטבע",
    signupTitle: "הרשמה למדד הטבע",
    updateDetailsTitle: "שינוי פרטים אישיים",
    login: "התחברות",
    signup: "הרשמה",
    forgotPassword: "שכחתי סיסמה",
    finishSignup: "סיום הרשמה",
    updateDetails: "עדכון שינויים",
    profilePic: "תמונת פרופיל",
    restorePassword: "שחזור סיסמה",
    restorePasswordButton: "שחזר סיסמה",
    emailSentButton: "אוקיי, אבדוק",
    emailSentDesc: "לינק ליצירת סיסמה חדשה נשלח\nאליך לאימייל.",
    chooseNewPasswordTitle: "בחר סיסמה חדשה",
    chooseNewPasswordTitle: "החלף סיסמה",
  },
  reportScreen: {
    sharePlace: (name) => {
      return "משהו משהו משהו"
    },
    scrollHint: "גרירה למטה ולמעלה\nכדי לבחור ציון",
    share: "שיתוף",
    done: "סגירה",
    doneTitle: (user) => {
      return user != null
        ? `תודה ששיתפת אותנו ${user.name.split(' ')[0]},\nעזרת לנו מאוד לשמור על הטבע.`
        : "תודה ששיתפת אותנו,\nעזרת לנו מאוד לשמור על הטבע.";
    },
    additionalInfo: "מידע נוסף שחשוב שנדע",
    finishButton: "סיום דיווח",
    takePic1: "הפרטים הבאים אינם חובה",
    takePic2: "צילום המקום",
    goBack: "חזרה",
    newReport: "דיווח חדש",
    cleanTitle: "מה מצב הניקיון\nוהטבע במקום?",
    cleanTitles: [
      "לא טוב",
      "טעון שיפור",
       "בסדר",
       "טוב"
       , "נפלא"
      ],
    crowdTitle: "מה מצב עומס\nהמבקרים במקום?",
    crowdTitles: [
      "עמוס מאוד", 
      "עמוס",
      "סביר",
      "בודדים"
      , "ריק מאדם"
    ],
    otherPeople: (num) => {
      return `${num} מדווחים דומים\nתיארו מצב דומה`;
    },
  },
};
