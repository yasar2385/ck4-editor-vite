// templates/editorConfig.js

// Utility: generate a random ID
const randomId = () => Math.floor(1000 + Math.random() * 9000);

// Utility: generate a session ID if not present
const generateSessionId = () => {
    const G = new Date();
    const randomPrefix = String.fromCharCode(65 + Math.round(Math.random() * 25));
    return (
        randomPrefix +
        G.getDate() +
        G.getDay() +
        G.getHours() +
        G.getMinutes() +
        G.getMilliseconds()
    );
};

// --- Get or set sessionId in sessionStorage ---
let sessionId = sessionStorage.getItem("sessionid") || generateSessionId();
sessionStorage.setItem("sessionid", sessionId);

// --- Default user info ---
const userName = window?.USER_NAME || "User1";
const lite_user_id = window?.USER_ID;
const liteUserId =
    [null, undefined, "undefined", "null"].includes(lite_user_id)
        ? randomId()
        : lite_user_id;

// --- Base editor configuration ---
const editorConfig = {
    height: 300,
    extraPlugins: "lite",
    autoGrow_minHeight: 200,
    autoGrow_maxHeight: 600,
    toolbar: [
        { name: "clipboard", items: ["Undo", "Redo"] },
        { name: "editing", items: ["Find", "Replace", "-", "SelectAll"] },
        {
            name: "insert",
            items: ["Image", "Table", "HorizontalRule", "SpecialChar"],
        },
        "/",
        {
            name: "basicstyles",
            items: ["Bold", "Italic", "Underline", "Strike"],
        },
        {
            name: "paragraph",
            items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
        },
        { name: "tools", items: ["Maximize"] },
    ],
    lite: {
        sessionId: sessionId,
        userName: userName,
        userId: liteUserId,
        ignoreSelectors: [],
        userStyles: {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 10,
        },
        tooltips: {
            show: true,
            delay: 200,
            cssPath: "css/opentip.css",
            classPath: "OpentipAdapter",
        },
    }
};
// --- Default Lite user data (for editor.setUserData or lite:init) ---
export const defaultUserData = {
    id: editorConfig.lite.userId,
    name: editorConfig.lite.userName,
    color: "#4CAF50",
};

export { editorConfig };

