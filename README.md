# Automerge CRDT Collaboration Workflow

## The Problem You Were Having

When using `Automerge.applyChanges()`, it tries to apply incremental changes to a document. If the base state differs between clients, the changes fail silently or return the same document. This breaks the CRDT merge.

## The Solution: Use `Automerge.merge()` + `save()`/`load()`

### Data Flow

```
User A (Client 1)                          User B (Client 2)
    |                                            |
    v                                            v
[Edit Text]                              [Edit Text]
    |                                            |
    v                                            v
Automerge.change(doc, d => {...})  Automerge.change(doc, d => {...})
    |                                            |
    v                                            v
Automerge.save(doc) → Uint8Array          Automerge.save(doc) → Uint8Array
    |                                            |
    v--- WebSocket (Binary) ---->               |
    |                            <---- WebSocket (Binary) ---v
    v                                            v
Automerge.load(data)                    Automerge.load(data)
    |                                            |
    v                                            v
Automerge.merge(localDoc, remoteDoc)    Automerge.merge(localDoc, remoteDoc)
    |                                            |
    v                                            v
Both docs NOW CONTAIN MERGED CHANGES (CRDT Magic)
```

### Key Methods

| Method | Purpose |
|--------|---------|
| `Automerge.init()` | Create new empty doc |
| `Automerge.change(doc, fn)` | Make mutable changes to doc |
| `Automerge.clone(doc)` | Make immutable doc writable again |
| `Automerge.save(doc)` | Serialize to Uint8Array (binary) |
| `Automerge.load(data)` | Deserialize from Uint8Array |
| `Automerge.merge(doc1, doc2)` | Merge two docs (CRDT operation) |
| `Automerge.toJS(doc)` | Convert to plain JS object |
| `Automerge.getHeads(doc)` | Get document version info |

### Proper Flow

1. **Local Edit**
   ```javascript
   let doc = Automerge.clone(currentDoc); // Make writable
   doc = Automerge.change(doc, d => {
     d.html = newHtml;
     d.lastUser = userId;
   });
   const binary = Automerge.save(doc); // Serialize
   sendMessage(binary); // Send raw binary
   currentDoc = doc; // Store updated doc
   ```

2. **Remote Receive**
   ```javascript
   const remoteDoc = Automerge.load(msg.data); // Deserialize
   currentDoc = Automerge.merge(currentDoc, remoteDoc); // CRDT merge
   const html = Automerge.toJS(currentDoc).html;
   updateEditor(html);
   ```

### Why This Works

- **`merge()` handles conflicts**: If both users edited the same text, Automerge automatically combines changes
- **`save()`/`load()` preserves history**: The binary format contains the full operation history, not just current state
- **No data loss**: Concurrent edits from both users are preserved through CRDT properties
- **Deterministic**: All clients eventually reach the same state regardless of network order

### Common Mistakes

❌ **Don't:** Try to `change()` after `merge()` - you'll get the RangeError
✅ **Do:** Always `clone()` before `change()` after a merge

❌ **Don't:** Send just the last change with `getLastLocalChange()`
✅ **Do:** Send the full document state with `save()`

❌ **Don't:** Use direct property access like `doc.html`
✅ **Do:** Convert with `Automerge.toJS(doc)` first

### Testing Concurrent Edits

```javascript
// User A makes change
let docA = Automerge.init();
docA = Automerge.change(docA, d => { d.text = "Hello"; });

// User B makes change
let docB = Automerge.init();
docB = Automerge.change(docB, d => { d.text = "World"; });

// Both merge each other's changes
docA = Automerge.merge(docA, docB);
docB = Automerge.merge(docB, docA);

// Both now have the same state!
console.log(Automerge.toJS(docA));
console.log(Automerge.toJS(docB)); // Same!
```

### Server-Side Sync Strategy

Store the full document binary in your database:

```javascript
// When receiving a change from a client
const incomingDoc = Automerge.load(clientData);
serverDoc = Automerge.merge(serverDoc, incomingDoc);

// Broadcast merged state to all clients
const binary = Automerge.save(serverDoc);
broadcast(binary);

// Periodic checkpoint (store in DB)
db.save('collaboration-doc', Automerge.save(serverDoc));
```

This ensures all clients stay in sync and can recover from disconnections.
