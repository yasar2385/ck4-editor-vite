

/**
 * ck4-react\src\plugins\collab-ot.jsx
 * Operational Transform (OT) Components
 */
class TextComponent {
    constructor(retain = null, insert = null, del = null) {
        this.retain = retain;
        this.insert = insert;
        this.delete = del;
    }
}

class TextOp {
    constructor() {
        this.ops = [];
    }

    retain(n) {
        if (n > 0) {
            this.ops.push(new TextComponent(n, null, null));
        }
        return this;
    }

    insert(str) {
        if (str && str.length > 0) {
            this.ops.push(new TextComponent(null, str, null));
        }
        return this;
    }

    delete(n) {
        if (n > 0) {
            this.ops.push(new TextComponent(null, null, n));
        }
        return this;
    }

    toJSON() {
        return { ops: this.ops };
    }

    static fromJSON(json) {
        const op = new TextOp();
        json.ops.forEach(c => {
            if (c.retain != null) op.retain(c.retain);
            else if (c.insert != null) op.insert(c.insert);
            else if (c.delete != null) op.delete(c.delete);
        });
        return op;
    }
}

/**
 * Operational Transform Utilities
 */
class OTUtils {
    static applyTextOp(str, op) {
        let result = "";
        let index = 0;

        for (const component of op.ops) {
            if (component.retain != null) {
                result += str.slice(index, index + component.retain);
                index += component.retain;
            } else if (component.insert != null) {
                result += component.insert;
            } else if (component.delete != null) {
                index += component.delete;
            }
        }

        // Append remaining characters
        if (index < str.length) {
            result += str.slice(index);
        }

        return result;
    }

    static transform(opA, opB) {
        const result = new TextOp();
        let indexA = 0, indexB = 0;
        let componentA = opA.ops[indexA];
        let componentB = opB.ops[indexB];

        while (componentA || componentB) {
            // Handle inserts from opB first (higher priority)
            if (componentB && componentB.insert != null) {
                result.retain(componentB.insert.length);
                componentB = opB.ops[++indexB];
                continue;
            }

            // Handle inserts from opA
            if (componentA && componentA.insert != null) {
                result.insert(componentA.insert);
                componentA = opA.ops[++indexA];
                continue;
            }

            const lengthA = this._getSpanLength(componentA);
            const lengthB = this._getSpanLength(componentB);
            const minLength = Math.min(lengthA, lengthB);

            if (this._isRetain(componentA) && this._isRetain(componentB)) {
                result.retain(minLength);
            } else if (this._isDelete(componentB) && this._isRetain(componentA)) {
                // opB deletes characters → skip them
            } else if (this._isDelete(componentA) && this._isRetain(componentB)) {
                result.delete(minLength);
            }

            this._consumeComponent(componentA, minLength);
            this._consumeComponent(componentB, minLength);

            if (this._getSpanLength(componentA) === 0) {
                componentA = opA.ops[++indexA];
            }
            if (this._getSpanLength(componentB) === 0) {
                componentB = opB.ops[++indexB];
            }
        }

        return this._compress(result);
    }

    static _isRetain(component) {
        return component && component.retain != null;
    }

    static _isDelete(component) {
        return component && component.delete != null;
    }

    static _getSpanLength(component) {
        if (!component) return Infinity;
        if (component.retain != null) return component.retain;
        if (component.delete != null) return component.delete;
        if (component.insert != null) return component.insert.length;
        return 0;
    }

    static _consumeComponent(component, amount) {
        if (!component) return;
        if (component.retain != null) {
            component.retain -= amount;
        } else if (component.delete != null) {
            component.delete -= amount;
        } else if (component.insert != null) {
            component.insert = component.insert.slice(amount);
        }
    }

    static _compress(op) {
        const result = new TextOp();

        for (const component of op.ops) {
            if (!component) continue;

            const lastComponent = result.ops[result.ops.length - 1];
            if (lastComponent) {
                // Merge consecutive operations of the same type
                if (lastComponent.retain != null && component.retain != null) {
                    lastComponent.retain += component.retain;
                    continue;
                }
                if (lastComponent.delete != null && component.delete != null) {
                    lastComponent.delete += component.delete;
                    continue;
                }
                if (lastComponent.insert != null && component.insert != null) {
                    lastComponent.insert += component.insert;
                    continue;
                }
            }

            result.ops.push(new TextComponent(
                component.retain,
                component.insert,
                component.delete
            ));
        }

        return result;
    }

    static diffToOp(before, after) {
        if (before === after) return null;

        // Simple implementation - replace with diff-match-patch for production
        const op = new TextOp();
        if (before.length > 0) op.delete(before.length);
        if (after.length > 0) op.insert(after);
        return op;
    }
}

/**
 * Collaborative Editor Manager
 */
class CollaborativeEditor {
    constructor() {
        this.editor = null;        // CKEditor instance
        this.shadow = "";
        this.version = 0;
        this.ws = null;
        this.changeLock = false;
        this.isConnected = false;
    }

    init(editorInstance) {
        this.editor = editorInstance;
        this._setupEditorHandlers();
    }
    _handleInit(message) {
        this.shadow = message.content;
        this.version = message.version;
        if (this.editor) {
            this.editor.setData(this.shadow);
        }
    }

    connect(docId, userId) {
        if (!this._checkDependencies()) {
            console.warn('Dependencies not ready for collaborative editing');
            return false;
        }

        try {
            try {
                this.ws = new WebSocket(`ws://localhost:8025/collaboration`);
            } catch (error) {

            }
            this._setupWebSocketHandlers();
            this._setupEditorHandlers();
            return true;
        } catch (error) {
            console.error('Failed to connect to collaborative editing:', error);
            return false;
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    _setupWebSocketHandlers() {
        this.ws.onopen = () => {
            this.isConnected = true;
            console.log('Connected to collaborative editing server');
        };

        this.ws.onclose = () => {
            this.isConnected = false;
            console.log('Disconnected from collaborative editing server');
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this._handleMessage(message);
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        };
    }

    _handleMessage(message) {
        switch (message.type) {
            case 'init':
                this._handleInit(message);
                break;
            case 'ack':
            case 'submit':
                this._handleAck(message);
                break;
            case 'op':
                this._handleRemoteOp(message);
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }


    _handleAck(message) {
        // Server accepted our operation - update shadow
        const op = TextOp.fromJSON(message.op);
        this.shadow = OTUtils.applyTextOp(this.shadow, op);
        this.version = message.version;
    }

    _handleRemoteOp(message) {
        const op = TextOp.fromJSON(message.op);
        this.shadow = OTUtils.applyTextOp(this.shadow, op);
        if (this.editor) {
            this.changeLock = true;
            this.editor.setData(this.shadow);
            this.changeLock = false;
        }
        this.version = message.version;
    }

    _setupEditorHandlers() {
        if (!this.editor) return;

        this.editor.on("change", () => {
            if (this.changeLock || !this.isConnected) return;
            this._handleContentChange();
        });
    }

    _handleContentChange() {
        if (!this.isConnected || !this.editor) return console.warn("someting missing");
        const currentContent = this.editor.getData();
        const op = OTUtils.diffToOp(this.shadow, currentContent);
        if (!op) return;
        this.ws.send(JSON.stringify({
            type: "submit",
            baseVersion: this.version,
            op: op.toJSON()
        }));
    }

    _checkDependencies() {
        return true;
    }
}

// const collaborativeEditor = new CollaborativeEditor();

export { CollaborativeEditor, TextOp, OTUtils };
