CKEDITOR.dialog.add("crossreference-anchor-dialog", function (b) {
    var c = b.config.crossreference,
        e = function () {
            var a = (new Date).getTime();
            window.performance && "function" === typeof window.performance.now && (a += performance.now());
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (b) {
                var d = (a + 16 * Math.random()) % 16 | 0;
                a = Math.floor(a / 16);
                return ("x" == b ? d : d & 3 | 8).toString(16)
            })
        };
    return {
        title: b.lang.crossreference.anchor,
        minWidth: 400,
        minHeight: 150,
        contents: [{
            id: "tab-main",
            label: b.lang.crossreference.anchor,
            elements: [{
                type: "vbox",
                widths: ["100%"],
                children: [{
                    type: "html",
                    id: "description",
                    html: '\x3cdiv style\x3d"white-space: normal; text-align: justify;"\x3e' + b.lang.crossreference.anchorDescription + "\x3c/div\x3e"
                }, {
                    type: "select",
                    id: "type",
                    width: "100%",
                    label: b.lang.crossreference.anchorType,
                    items: [],
                    required: !0,
                    items: [
                        [""]
                    ],
                    onLoad: function () {
                        this.getInputElement().setStyle("width", "100%");
                        for (var a in c.types) {
                            var b = c.types[a],
                                d = b.name;
                            0 != b.allowCreateAnchors && this.add(d, b.type)
                        }
                    },
                    setup: function (a) {
                        this.setValue(a.getAttribute("cross-reference"))
                    },
                    commit: function (a) {
                        a.setAttribute("cross-reference", this.getValue());
                        a.setAttribute("cross-anchor", "")
                    }
                }, {
                    type: "text",
                    id: "name",
                    width: "100%",
                    label: b.lang.crossreference.anchorName,
                    required: !0,
                    setup: function (a) {
                        this.setValue(a.getAttribute("cross-name"))
                    },
                    commit: function (a) {
                        a.setAttribute("cross-name", this.getValue())
                    }
                }]
            }]
        }],
        onLoad: function () {},
        onShow: function () {
            var a = b.getSelection();
            if (this.element = a.getStartElement()) this.element = this.element.getAscendant("a", !0);
            if (this.element && "a" == this.element.getName() &&
                this.element.hasAttribute("cross-anchor")) this.insertMode = !1;
            else {
                this.element = b.document.createElement("a");
                var c = e();
                this.element.setAttribute("cross-guid", c);
                this.insertMode = !0
            }
            this.insertMode ? this.setValueOf("tab-main", "name", a.getSelectedText().trim()) : this.setupContent(this.element)
        },
        onOk: function () {
            this.getValueOf("tab-main", "type") && (this.commitContent(this.element), this.insertMode && b.insertElement(this.element), b.execCommand("update-crossreferences"))
        }
    }
});