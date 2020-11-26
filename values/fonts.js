import { useFonts } from "@use-expo/font";

export const fontsLoader = () => {
    const [fontsLoaded] = useFonts({
        "Sunday-Normal": require("../assets/fonts/Sunday-Normal.otf"),
        "Sunday-Regular": require("../assets/fonts/Sunday-Regular.otf"),
        "Sunday-Black": require("../assets/fonts/Sunday-Black.otf"),
        "Sunday-Bold": require("../assets/fonts/Sunday-Bold.otf"),
        "Sunday-Medium": require("../assets/fonts/Sunday-Medium.otf"),
      });
    return {fontsLoaded}
}

export const fonts = {
    normal: "Sunday-Normal",
    regular: "Sunday-Regular",
    black: "Sunday-Black",
    bold: "Sunday-Bold",
    medium: "Sunday-Medium"
}