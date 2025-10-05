export default function ImageDisplay() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Content Preview</h3>
            <img
                src="/public/sample.jpg"
                alt="Document Illustration"
                className="w-full rounded shadow mb-2"
            />
            <p className="text-gray-600 text-sm">
                Visual representation of the current document section.
            </p>
        </div>
    );
}
