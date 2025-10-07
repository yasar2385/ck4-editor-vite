export default function ThumbnailPanel() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">Thumbnails</h3>
            <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(n => (
                    <img key={n} src={`/public/thumbnails/thumb${n}.jpg`} className="rounded shadow cursor-pointer" />
                ))}
            </div>
        </div>
    );
}
