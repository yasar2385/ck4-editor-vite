import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import CKEditor4Wrapper from '../components/CKEditor4Wrapper';

function EditorReadOnlyPage() {
    const [content, setContent] = useState('');

    setContent(`
        <h2>Welcome to the Read-Only CKEditor 4 Instance!</h2>
        <p>This editor is in read-only mode. You can view the content but cannot make any changes.</p>`)

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">📝 CKEditor 4 Read-Only</h2>
            <CKEditor4Wrapper id="readonlyEditor" data={content} readOnly={true} />
        </div>
    );
}

export default EditorReadOnlyPage;
