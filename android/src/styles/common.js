import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Dimensions } from 'react-native';
var { height, width } = Dimensions.get('window');

export var primaryBlue = '#4286f4';
export var blueTextShadow = '#3399ff';
export var titleTextShadow = 'grey';
export var xxlargeFontSize = responsiveFontSize(4.5);
export var extraLargeFontSize = responsiveFontSize(3.4);
export var largeFontSize = responsiveFontSize(2.8);
export var mediumFontSize = responsiveFontSize(2.2);
export var smallFontSize = responsiveFontSize(1.8);

/* Overview */
// MainButtons
export var mainButtonsHeight = responsiveHeight(10);
// Row
export var timerRowHeight = responsiveHeight(14);
export var timerRowWidth = responsiveWidth(115);
export var timerRowDescWidth = responsiveWidth(75);
export var timerRowDistanceWidth = responsiveWidth(25);
// TicketCounter
export var ticketCountFontSize = responsiveFontSize(5);
export var ticketDescFontSize = responsiveFontSize(2);

/* Camera */
// Time Limit
export var timeLimitContainerHeight = responsiveHeight(9);
// Capture
export var captureContainerHeight = responsiveHeight(10);
// LocationInput
export var textInputContainerHeight = responsiveHeight(18);

/* Search/Navigation */
export var titleFontSize = responsiveFontSize(3.5);
export var pinSize = responsiveHeight(5);
export var closeButtonSize = responsiveHeight(3);
export var navBarContainerHeight = height * .09;
export var searchContainerHeight = height * .18;
export var resultContainerHeight = height * .34;
export var resultHeight = height * .14;
export var noResultContainerHeight = height * .27;
export var noResultHeight = height * .11;
export var windowCenterPoint = Math.floor(width / 2) - 3.8;
export var underlineWidth = responsiveWidth(40);
export var separatorHeight = responsiveHeight(5);

/* Timer List */
//Title
export var timeLimitTitleContainerHeight = height * .05;
// Row
export var timerRowDescContainerHeight = height * .12;
export var timerRowButtonsContainerHeight = height * .09;
export var timerRowImageHeight = height * .565;
export var timerFlatListHeight = timerRowDescContainerHeight + timerRowButtonsContainerHeight + timerRowImageHeight;
// Warning
export var warningContainerMarginTop = height * .22;

/* Profile */
export var textInputWidth = width - 100;

/* History */
// Row
export var imageSize = responsiveWidth(20);
