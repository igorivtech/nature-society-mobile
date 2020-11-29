export const strings = {
    distanceFromYou: (distance) => {
        return `${distance} ק״מ ממך`
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
        crowdnessTitle: "עומס מבקרים"
    }
}