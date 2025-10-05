export default function TocPanel() {
    const items = ['Introduction', 'Methods', 'Results', 'Discussion'];
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
            <ul className="space-y-2 text-gray-700">
                {items.map((item, i) => (
                    <li key={i} className="hover:text-blue-600 cursor-pointer">{item}</li>
                ))}
            </ul>
        </div>
    );
}
