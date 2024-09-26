import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const Wp = wp;
export const Hp = hp;
// theme.js
export const Fonts = {
    logo: 'ArialBlack',
    tagline: 'Calibri',
    stationery: 'Lato',
    graphicDesign: 'Quiet',
    documents: 'Calibri',
  };
  
const appTheme = { Wp, Hp , Fonts };

export default appTheme;