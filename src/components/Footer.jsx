export default function Footer({ fixed }) {
    return (
        <footer className={`${fixed ? 'fixed bottom-0 left-0 right-0' : ''} bg-blue-700 text-white text-center p-3 text-sm`}>
            © {new Date().getFullYear()} SmartDocs | All Rights Reserved
        </footer>
    );
}
