export var UIEventType;
(function (UIEventType) {
    UIEventType["tryDraw"] = "draw";
    UIEventType["tryPlaceCard"] = "card";
})(UIEventType || (UIEventType = {}));
export var GameMessageTypes;
(function (GameMessageTypes) {
    GameMessageTypes["init"] = "init-game";
    GameMessageTypes["update"] = "update";
})(GameMessageTypes || (GameMessageTypes = {}));
export var GameEventType;
(function (GameEventType) {
    GameEventType["placeCard"] = "place-card";
})(GameEventType || (GameEventType = {}));
