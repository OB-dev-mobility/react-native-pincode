"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("./delay");
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const d3_ease_1 = require("d3-ease");
const _ = require("lodash");
const React = require("react");
const Animate_1 = require("react-move/Animate");
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
var PinStatus;
(function (PinStatus) {
    PinStatus["choose"] = "choose";
    PinStatus["confirm"] = "confirm";
    PinStatus["enter"] = "enter";
})(PinStatus = exports.PinStatus || (exports.PinStatus = {}));
const textDeleteButtonDefault = "delete";
class PinCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.failedAttempt = async () => {
            //await delay_1.default(100);
            this.setState({
                showError: true,
                attemptFailed: true,
                changeScreen: false
            });
            this.doShake();
            await delay_1.default(1000);
            this.newAttempt();
        };
        this.newAttempt = async () => {
            this.setState({ changeScreen: true });
            //await delay_1.default(100);
            this.setState({
                changeScreen: false,
                showError: false,
                attemptFailed: false,
                password: ""
            });
        };
        this.onPressButtonNumber = async (text) => {
            const currentPassword = this.state.password + text;
            this.setState({ password: currentPassword });
            if (this.props.getCurrentLength)
                this.props.getCurrentLength(currentPassword.length);
            if (currentPassword.length === this.props.passwordLength) {
                switch (this.props.status) {
                    case PinStatus.choose:
                        if (this.props.validationRegex &&
                            this.props.validationRegex.test(currentPassword)) {
                            this.showError(true);
                        }
                        else {
                            this.endProcess(currentPassword);
                        }
                        break;
                    case PinStatus.confirm:
                        if (currentPassword !== this.props.previousPin) {
                            this.showError();
                        }
                        else {
                            this.endProcess(currentPassword);
                        }
                        break;
                    case PinStatus.enter:
                        this.props.endProcess(currentPassword);
                        await delay_1.default(100);
                        break;
                    default:
                        break;
                }
            }
        };
        this.renderButtonNumber = (text) => {
            const disabled = (this.state.password.length === this.props.passwordLength ||
                this.state.showError) &&
                !this.state.attemptFailed;
            return (React.createElement(Animate_1.default, {
                show: true, start: {
                    opacity: 1
                }, update: {
                    opacity: [
                        this.state.showError && !this.state.attemptFailed ? 0.5 : 1
                    ],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear }
                }
            }, ({ opacity }) => (React.createElement(react_native_1.TouchableHighlight, {
                style: [
                    this.props.styleButtonCircle
                        ? this.props.styleButtonCircle
                        : styles.buttonCircle,
                    {
                        backgroundColor: this.props.colorCircleButtons
                            ? this.props.colorCircleButtons
                            : "rgb(242, 245, 251)"
                    }
                ], underlayColor: this.props.numbersButtonOverlayColor
                    ? this.props.numbersButtonOverlayColor
                    : colors_1.colors.turquoise, disabled: disabled, onShowUnderlay: () => this.setState({ textButtonSelected: text }), onHideUnderlay: () => this.setState({ textButtonSelected: "" }), onPress: () => {
                        this.onPressButtonNumber(text);
                    }, accessible: true, accessibilityLabel: text
            },
                React.createElement(react_native_1.Text, {
                    style: [
                        this.props.styleTextButton
                            ? this.props.styleTextButton
                            : styles.text,
                        {
                            opacity: opacity,
                            color: this.state.textButtonSelected === text
                                ? this.props.styleColorButtonTitleSelected
                                    ? this.props.styleColorButtonTitleSelected
                                    : colors_1.colors.white
                                : this.props.styleColorButtonTitle
                                    ? this.props.styleColorButtonTitle
                                    : colors_1.colors.grey
                        }
                    ]
                }, text)))));
        };
        this.endProcess = (pwd) => {
            setTimeout(() => {
                this.setState({ changeScreen: true });
                setTimeout(() => {
                    this.props.endProcess(pwd);
                }, 500);
            }, 400);
        };
        this.renderCirclePassword = () => {
            const { password, moveData, showError, changeScreen, attemptFailed } = this.state;
            const colorPwdErr = this.props.colorPasswordError || colors_1.colors.alert;
            const colorPwd = this.props.colorPassword || colors_1.colors.turquoise;
            const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd;
            return (React.createElement(react_native_1.View, {
                style: this.props.styleCircleHiddenPassword
                    ? this.props.styleCircleHiddenPassword
                    : styles.topViewCirclePassword
            }, _.range(this.props.passwordLength).map((val) => {
                const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) &&
                    !attemptFailed;
                return (React.createElement(Animate_1.default, {
                    key: val, show: true, start: {
                        opacity: 0.5,
                        height: this._circleSizeEmpty,
                        width: this._circleSizeEmpty,
                        borderRadius: this._circleSizeEmpty / 2,
                        color: colorPwdEmp,
                        marginRight: 10,
                        marginLeft: 10,
                        x: 0,
                        y: 0
                    }, update: {
                        x: [moveData.x],
                        opacity: [lengthSup ? 1 : 0.5],
                        height: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                        ],
                        width: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                        ],
                        color: [
                            showError
                                ? colorPwdErr
                                : (lengthSup && password.length > 0)
                                    ? colorPwd
                                    : colorPwdEmp
                        ],
                        borderRadius: [
                            lengthSup
                                ? this._circleSizeFull / 2
                                : this._circleSizeEmpty / 2
                        ],
                        marginRight: [
                            lengthSup
                                ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 10
                        ],
                        marginLeft: [
                            lengthSup
                                ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 10
                        ],
                        y: [moveData.y],
                        timing: { duration: 200, ease: d3_ease_1.easeLinear }
                    }
                }, ({ opacity, x, height, width, color, borderRadius, marginRight, marginLeft }) => (React.createElement(react_native_1.View, { style: styles.viewCircles }, ((!this.props.pinCodeVisible ||
                    (this.props.pinCodeVisible && !lengthSup)) && (React.createElement(react_native_1.View, {
                        style: [{
                            left: x,
                            height: height,
                            width: width,
                            opacity: opacity,
                            borderRadius: borderRadius,
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            backgroundColor: color
                        }, this.props.stylePinCodeCircle]
                    }))) || (React.createElement(react_native_1.View, {
                        style: {
                            left: x,
                            opacity: opacity,
                            marginLeft: marginLeft,
                            marginRight: marginRight
                        }
                    },
                        React.createElement(react_native_1.Text, {
                            style: {
                                color: color,
                                fontFamily: this.props.textPasswordVisibleFamily ||
                                    "system font",
                                fontSize: this.props.textPasswordVisibleSize || 22
                            }
                        }, this.state.password[val])))))));
            })));
        };
        this.renderButtonDelete = (opacity) => {
            return (React.createElement(react_native_1.TouchableHighlight, {
                activeOpacity: this.props.customBackSpaceIcon ? .5 : 1, disabled: this.state.password.length === 0, underlayColor: "transparent", onHideUnderlay: () => this.setState({
                    colorDelete: this.props.styleDeleteButtonColorHideUnderlay
                        ? this.props.styleDeleteButtonColorHideUnderlay
                        : "rgb(211, 213, 218)"
                }), onShowUnderlay: () => this.setState({
                    colorDelete: this.props.styleDeleteButtonColorShowUnderlay
                        ? this.props.styleDeleteButtonColorShowUnderlay
                        : colors_1.colors.turquoise
                }), onPress: () => {
                    if (this.state.password.length > 0) {
                        const newPass = this.state.password.slice(0, -1);
                        this.setState({ password: newPass });
                        if (this.props.getCurrentLength)
                            this.props.getCurrentLength(newPass.length);
                    }
                }, accessible: true, accessibilityLabel: this.props.buttonDeleteText
                    ? this.props.buttonDeleteText
                    : textDeleteButtonDefault
            },
                React.createElement(react_native_1.View, {
                    style: this.props.styleColumnDeleteButton
                        ? this.props.styleColumnDeleteButton
                        : styles.colIcon
                }, this.props.customBackSpaceIcon ?
                    this.props.customBackSpaceIcon :
                    React.createElement(react_native_1.View, null,
                        !this.props.iconButtonDeleteDisabled && (React.createElement(MaterialIcons_1.default, {
                            name: this.props.styleDeleteButtonIcon
                                ? this.props.styleDeleteButtonIcon
                                : "backspace", size: this.props.styleDeleteButtonSize
                                    ? this.props.styleDeleteButtonSize
                                    : 30, color: this.state.colorDelete, style: { opacity: opacity }
                        })),
                        React.createElement(react_native_1.Text, {
                            style: [
                                this.props.styleDeleteButtonText
                                    ? this.props.styleDeleteButtonText
                                    : styles.textDeleteButton,
                                { color: this.state.colorDelete, opacity: opacity }
                            ]
                        }, this.props.buttonDeleteText
                            ? this.props.buttonDeleteText
                            : textDeleteButtonDefault)))));
        };
        this.renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
            return (React.createElement(react_native_1.Text, {
                style: [
                    this.props.styleTextTitle
                        ? this.props.styleTextTitle
                        : styles.textTitle,
                    { color: colorTitle, opacity: opacityTitle }
                ]
            }, (attemptFailed && this.props.titleAttemptFailed) ||
            (showError && this.props.titleConfirmFailed) ||
            (showError && this.props.titleValidationFailed) ||
            this.props.sentenceTitle));
        };
        this.renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
            return (React.createElement(react_native_1.Text, {
                style: [
                    this.props.styleTextSubtitle
                        ? this.props.styleTextSubtitle
                        : styles.textSubtitle,
                    { color: colorTitle, opacity: opacityTitle }
                ]
            }, attemptFailed || showError
                ? this.props.subtitleError
                : this.props.subtitle));
        };
        this.state = {
            password: "",
            moveData: { x: 0, y: 0 },
            showError: false,
            textButtonSelected: "",
            colorDelete: this.props.styleDeleteButtonColorHideUnderlay
                ? this.props.styleDeleteButtonColorHideUnderlay
                : "rgb(211, 213, 218)",
            attemptFailed: false,
            changeScreen: false
        };
        this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 4;
        this._circleSizeFull =
            this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 6 : 8);
    }
    componentDidMount() {
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pinCodeStatus !== "failure" &&
            this.props.pinCodeStatus === "failure") {
            this.failedAttempt();
        }
        if (prevProps.pinCodeStatus !== "locked" &&
            this.props.pinCodeStatus === "locked") {
            this.setState({ password: "" });
        }
    }
    async doShake() {
        const duration = 10;
        react_native_1.Vibration.vibrate(100, false);
        const length = react_native_1.Dimensions.get("window").width / 3;
        await delay_1.default(duration);
        this.setState({ moveData: { x: length, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: length / 2, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length / 2, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: length / 4, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length / 4, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: 0, y: 0 } });
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    async showError(isErrorValidation = false) {
        this.setState({ changeScreen: true });
        //await delay_1.default(100);
        this.setState({ showError: true, changeScreen: false });
        this.doShake();
        await delay_1.default(1000);
        this.setState({ changeScreen: true });
        //await delay_1.default(100);
        this.setState({ showError: false, password: "" });
        //await delay_1.default(100);
        this.props.endProcess(this.state.password, isErrorValidation);
        if (isErrorValidation)
            this.setState({ changeScreen: false });
    }
    render() {
        const { password, showError, attemptFailed, changeScreen } = this.state;
        return (React.createElement(react_native_1.View, {
            style: this.props.styleContainer
                ? this.props.styleContainer
                : styles.container
        },
            React.createElement(Animate_1.default, {
                show: true, start: {
                    opacity: 0,
                    colorTitle: this.props.styleColorTitle
                        ? this.props.styleColorTitle
                        : colors_1.colors.grey,
                    colorSubtitle: this.props.styleColorSubtitle
                        ? this.props.styleColorSubtitle
                        : colors_1.colors.grey,
                    opacityTitle: 1
                }, enter: {
                    opacity: [1],
                    colorTitle: [
                        this.props.styleColorTitle
                            ? this.props.styleColorTitle
                            : colors_1.colors.grey
                    ],
                    colorSubtitle: [
                        this.props.styleColorSubtitle
                            ? this.props.styleColorSubtitle
                            : colors_1.colors.grey
                    ],
                    opacityTitle: [1],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear }
                }, update: {
                    opacity: [changeScreen ? 0 : 1],
                    colorTitle: [
                        showError || attemptFailed
                            ? this.props.styleColorTitleError
                                ? this.props.styleColorTitleError
                                : colors_1.colors.alert
                            : this.props.styleColorTitle
                                ? this.props.styleColorTitle
                                : colors_1.colors.grey
                    ],
                    colorSubtitle: [
                        showError || attemptFailed
                            ? this.props.styleColorSubtitleError
                                ? this.props.styleColorSubtitleError
                                : colors_1.colors.alert
                            : this.props.styleColorSubtitle
                                ? this.props.styleColorSubtitle
                                : colors_1.colors.grey
                    ],
                    opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear }
                }
            }, ({ opacity, colorTitle, colorSubtitle, opacityTitle }) => (React.createElement(react_native_1.View, {
                style: [
                    this.props.styleViewTitle
                        ? this.props.styleViewTitle
                        : styles.viewTitle,
                    { opacity: opacity }
                ]
            },
                this.props.titleComponent
                    ? this.props.titleComponent()
                    : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError),
                this.props.subtitleComponent
                    ? this.props.subtitleComponent()
                    : this.renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)))),
            React.createElement(react_native_1.View, { style: styles.flexCirclePassword }, this.props.passwordComponent
                ? this.props.passwordComponent()
                : this.renderCirclePassword()),
            React.createElement(react_native_easy_grid_1.Grid, { style: styles.grid },
                React.createElement(react_native_easy_grid_1.Row, {
                    style: this.props.styleRowButtons
                        ? this.props.styleRowButtons
                        : styles.row
                }, _.range(1, 4).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, {
                        key: i, style: this.props.styleColumnButtons
                            ? this.props.styleColumnButtons
                            : styles.colButtonCircle
                    }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, {
                    style: this.props.styleRowButtons
                        ? this.props.styleRowButtons
                        : styles.row
                }, _.range(4, 7).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, {
                        key: i, style: this.props.styleColumnButtons
                            ? this.props.styleColumnButtons
                            : styles.colButtonCircle
                    }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, {
                    style: this.props.styleRowButtons
                        ? this.props.styleRowButtons
                        : styles.row
                }, _.range(7, 10).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, {
                        key: i, style: this.props.styleColumnButtons
                            ? this.props.styleColumnButtons
                            : styles.colButtonCircle
                    }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, {
                    style: this.props.styleRowButtons
                        ? this.props.styleRowButtons
                        : styles.row
                },
                    React.createElement(react_native_easy_grid_1.Col, {
                        style: this.props.styleEmptyColumn
                            ? this.props.styleEmptyColumn
                            : styles.colEmpty
                    }, this.props.emptyColumnComponent || null),
                    React.createElement(react_native_easy_grid_1.Col, {
                        style: this.props.styleColumnButtons
                            ? this.props.styleColumnButtons
                            : styles.colButtonCircle
                    }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent("0", this.onPressButtonNumber)
                        : this.renderButtonNumber("0")),
                    React.createElement(react_native_easy_grid_1.Col, {
                        style: this.props.styleColumnButtons
                            ? this.props.styleColumnButtons
                            : styles.colButtonCircle
                    },
                        React.createElement(Animate_1.default, {
                            show: true, start: {
                                opacity: 0.5
                            }, update: {
                                opacity: [
                                    password.length === 0 ||
                                        password.length === this.props.passwordLength
                                        ? 0.5
                                        : 1
                                ],
                                timing: { duration: 400, ease: d3_ease_1.easeLinear }
                            }
                        }, ({ opacity }) => this.props.buttonDeleteComponent
                            ? this.props.buttonDeleteComponent(() => {
                                if (this.state.password.length > 0) {
                                    const newPass = this.state.password.slice(0, -1);
                                    this.setState({ password: newPass });
                                    if (this.props.getCurrentLength)
                                        this.props.getCurrentLength(newPass.length);
                                }
                            })
                            : this.renderButtonDelete(opacity)))))));
    }
}
exports.default = PinCode;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    viewTitle: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 2
    },
    row: {
        alignItems: "center",
        height: grid_1.grid.unit * 5.5
    },
    colButtonCircle: {
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        alignItems: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colEmpty: {
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4
    },
    colIcon: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    text: {
        fontSize: grid_1.grid.unit * 2,
        fontWeight: "200"
    },
    buttonCircle: {
        alignItems: "center",
        justifyContent: "center",
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4,
        backgroundColor: "rgb(242, 245, 251)",
        borderRadius: grid_1.grid.unit * 2
    },
    textTitle: {
        fontSize: 20,
        fontWeight: "200",
        lineHeight: grid_1.grid.unit * 2.5
    },
    textSubtitle: {
        fontSize: grid_1.grid.unit,
        fontWeight: "200",
        textAlign: "center"
    },
    flexCirclePassword: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    topViewCirclePassword: {
        flexDirection: "row",
        height: "auto",
        justifyContent: "center",
        alignItems: "center"
    },
    viewCircles: {
        justifyContent: "center",
        alignItems: "center"
    },
    textDeleteButton: {
        fontWeight: "200",
        marginTop: 5
    },
    grid: {
        width: "100%",
        flex: 7
    }
});
