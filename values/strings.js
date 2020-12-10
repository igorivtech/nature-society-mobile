export const strings = {
    continue: 'המשך',
    guest: 'אורח',
    or: 'או',
    email: 'אימייל',
    fullName: 'שם מלא',
    password: 'סיסמה',
    login: 'התחברות',
    logout: 'התנתקות',
    distanceFromYou: (distance) => {
        return `${distance} ק״מ ממך`
    },
    distanceFromYouAlt: (distance) => {
        let str = ""
        str += `km`
        str += ` ${distance} `
        str += 'ממך'
        return str
    },
    onboardingScreen: {
        item1: "גלו אתרי טבע שלא הכרתם",
        item2: "דווחו מהשטח והשפיעו על מצב הטבע",
        item3: "צברו נקודות ועלו שלבים",
        done: "במקום שתרצו לבקר\nכדי לגלות מה עומס המבקרים\nהשתמשו בנקודות שצברתם",
        coolButton: "מגניב"
    },
    placeScreen: {
        recentVisitors: (locked) => {
            return locked ? "מבקרים פעילים" : "מבקר אחרון"
        },
        cleannessTitle: (locked) => {
            return locked ? "מצב וניקיון הטבע" : "מצב הטבע"
        },
        crowdnessTitle: "עומס מבקרים",
        waze: "הגיעו למקום\nעם Waze",
        share: "שתפו את המקום\nעם חברים",
        report: "כתבו דיווח\nמשלכם למקום"
    },
    homeScreen: {
        recentVisitor: (male) => {
            return male !== 0 ? "ביקר לאחרונה" : "ביקרה לאחרונה"
        }
    },
    exploreScreen: {
        searchPlaceholder: 'חפש'
    },
    progressScreen: {
        thankYou: 'תודה לך!',
        signup: 'הרשמה',
        logout: 'התנתקות',
        reportsTitle: 'דיווחים מהשטח',
        pointsTitle: 'נק‘ טבע'  
    },
    loginScreen: {
        title: 'התחברות למדד הטבע',
        signupTitle: 'הרשמה למדד הטבע',
        updateDetailsTitle: 'שינוי פרטים אישיים',
        login: 'התחברות',
        signup: 'הרשמה',
        forgotPassword: 'שכחתי סיסמה',
        finishSignup: 'סיום הרשמה',
        updateDetails: 'עדכון שינויים',
        profilePic: 'תמונת פרופיל',
        restorePassword: 'שחזור סיסמה',
        restorePasswordButton: 'שחזר סיסמה',
        emailSentButton: 'אוקיי, אבדוק',
        emailSentDesc: 'לינק ליצירת סיסמה חדשה נשלח\nאליך לאימייל.',
        chooseNewPasswordTitle: 'בחר סיסמה חדשה',
        chooseNewPasswordTitle: 'החלף סיסמה',
    },
    reportScreen: {
        doneTitle: (user) => {
            return user != null ? 
            `תודה ששיתפת אותנו ${user.name},\nעזרת לנו מאוד לשמור על הטבע.` : 
            "תודה ששיתפת אותנו,\nעזרת לנו מאוד לשמור על הטבע."
        },
        additionalInfo: 'מידע נוסף שחשוב שנדע',
        finishButton: 'סיום דיווח',
        takePic1: 'הפרטים הבאים אינם חובה',
        takePic2: 'צילום המקום',
        goBack: 'חזרה',
        newReport: 'דיווח חדש',
        cleanTitle: "מה מצב הניקיון\nוהטבע במקום?",
        cleanTitles: [
            "לא טוב",
            "סביר",
            "נפלא"
        ],
        crowdTitle: "מה מצב עומס\nהמבקרים במקום?",
        crowdTitles: [
            "הומה",
            "סביר",
            "ריק מאדם"
        ],
        otherPeople: (num) => {
            return `${num} מדווחים דומים\nתיארו מצב דומה`
        }
    }
}