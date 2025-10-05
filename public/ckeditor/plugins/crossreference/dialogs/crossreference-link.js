CKEDITOR.dialog.add("crossreference-link-dialog", function (b) {
    var d = b.config.crossreference,
        p = function (a) {
            a.setState(CKEDITOR.DIALOG_STATE_BUSY);
            a.anchors = [];
            a.anchorsByGuid = {};
            a.anchorsGroupNameByGuid = {};
            var g = null,
                c = a.getValueOf("tab-main", "type");
            c && (g = d.types[c]);
            var e = a.getContentElement("tab-main", "anchor");
            e.clear();
            e.add("", "");
            var f = a.getContentElement("tab-main", "anchorGroup");
            f.clear();
            f.add("", "");
            g && 1 == g.groupAnchors ? f.getElement().show() : f.getElement().hide();
            d.findAnchors(d, b, g, function (b) {
                a.anchors =
                    b;
                a.anchorsByGuid = {};
                a.anchorsGroupNameByGuid = {};
                for (var c = 0; c < b.length; c++) {
                    var h = b[c],
                        d = h.guid;
                    e.add(h.text, d);
                    1 == g.groupAnchors && h.groupGuid && (a.anchorsGroupNameByGuid[h.groupGuid] = h.groupName);
                    a.anchorsByGuid[d] = h
                }
                if (g && 1 == g.groupAnchors)
                    for (var n in a.anchorsGroupNameByGuid) f.add(a.anchorsGroupNameByGuid[n], n);
                $("option", e.getInputElement().$).each(function () {
                    var a = $(this),
                        b = a.text();
                    a.html(b)
                });
                a.insertMode ? l(a) : e.setup(a.element);
                a.setState(CKEDITOR.DIALOG_STATE_IDLE)
            })
        },
        l = function (a) {
            var b =
                a.getValueOf("tab-main", "filter"),
                b = b ? b.trim().toLowerCase() : "",
                c = null,
                e = a.getValueOf("tab-main", "type");
            e && (c = d.types[e]);
            var f = null;
            c && 1 == c.groupAnchors && (f = a.getValueOf("tab-main", "anchorGroup"));
            var c = a.getContentElement("tab-main", "anchor"),
                l = c.getValue(),
                m = null;
            $("option", c.getInputElement().$).each(function () {
                var c = $(this),
                    d = c.val(),
                    e = a.anchorsByGuid[d],
                    k = c.text(),
                    k = 0 == b.length || -1 != k.toLowerCase().indexOf(b);
                f && (k = k && e && e.groupGuid == f);
                k ? (c.removeAttr("disabled", "disabled"), null == m ? m = c.val() :
                    d == l && (m = c.val())) : c.attr("disabled", "disabled")
            });
            c.setValue(m)
        };
    return {
        title: b.lang.crossreference.link,
        minWidth: 400,
        minHeight: 150,
        contents: [{
            id: "tab-main",
            label: b.lang.crossreference.link,
            elements: [{
                type: "vbox",
                widths: ["100%"],
                children: [{
                        type: "html",
                        id: "description",
                        html: '\x3cdiv style\x3d"white-space: normal; text-align: justify;"\x3e' + b.lang.crossreference.linkDescription + "\x3c/div\x3e"
                    }, {
                        type: "select",
                        id: "type",
                        width: "100%",
                        label: b.lang.crossreference.anchorType,
                        required: !0,
                        items: [
                            [""]
                        ],
                        onLoad: function () {
                            this.getInputElement().setStyle("width",
                                "100%");
                            for (var a in d.types) {
                                var b = d.types[a];
                                this.add(b.name, b.type)
                            }
                        },
                        onChange: function () {
                            p(this.getDialog())
                        },
                        setup: function (a) {
                            this.setValue(a.getAttribute("cross-reference"))
                        },
                        commit: function (a) {
                            a.setAttribute("cross-reference", this.getValue());
                            a.setAttribute("cross-link", "")
                        }
                    }, {
                        type: "select",
                        id: "anchorGroup",
                        width: "100%",
                        label: b.lang.crossreference.anchorGroup,
                        required: !1,
                        items: [
                            [""]
                        ],
                        onLoad: function () {
                            this.getInputElement().setStyle("width", "100%")
                        },
                        onChange: function () {
                            l(this.getDialog())
                        }
                    },
                    {
                        type: "text",
                        id: "filter",
                        width: "100%",
                        label: b.lang.crossreference.linkFilter,
                        onKeyUp: function () {
                            l(this.getDialog())
                        }
                    }, {
                        type: "select",
                        id: "anchor",
                        width: "100%",
                        label: b.lang.crossreference.anchor,
                        required: !0,
                        items: [
                            [""]
                        ],
                        onLoad: function () {
                            this.getInputElement().setStyle("width", "100%")
                        },
                        setup: function (a) {
                            this.setValue(a.getAttribute("cross-guid"))
                        },
                        commit: function (a) {
                            a.setAttribute("cross-guid", this.getValue())
                        }
                    }
                ]
            }]
        }],
        onLoad: function () {},
        onShow: function () {
            var a = b.getSelection();
            if (this.element = a.getStartElement()) this.element =
                this.element.getAscendant("a", !0);
            this.element && "a" == this.element.getName() && this.element.hasAttribute("cross-link") ? this.insertMode = !1 : (this.element = b.document.createElement("a"), this.element.setAttribute("cross-link", ""), this.insertMode = !0);
            this.insertMode ? (this.setValueOf("tab-main", "filter", a.getSelectedText().trim()), p(this)) : this.setupContent(this.element)
        },
        onOk: function () {
            this.getValueOf("tab-main", "type") && this.getValueOf("tab-main", "anchor") && (this.commitContent(this.element), this.insertMode &&
                b.insertElement(this.element), b.execCommand("update-crossreferences"))
        }
    }
});