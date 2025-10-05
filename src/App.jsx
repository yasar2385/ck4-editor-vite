import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gray-50 text-gray-800 notranslate" translate="no">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SYD Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold tracking-tight">SYD Publishing</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#services" className="hover:text-blue-600">Services</a>
            <a href="#clients" className="hover:text-blue-600">Clients</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted Publishing Partner for Over 25 Years
          </h2>
          <p className="text-lg md:text-xl mb-6">
            End-to-End Services in Books, Journals, and Scholarly Publishing.
          </p>
          <a
            href="#contact"
            className="btn btn-light bg-white text-blue-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto py-16 px-6 md:px-10">
        <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Core Services</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "User Dashboard",
              desc: "Access user-specific reports, manuscripts, and publishing workflows.",
              route: "/dashboard",
              color: "bg-blue-600 hover:bg-blue-700",
            },
            {
              title: "Admin Dashboard",
              desc: "Manage users, publishing pipelines, and system configurations.",
              route: "/admin",
              color: "bg-green-600 hover:bg-green-700",
            },
            {
              title: "Editor Read-Only",
              desc: "View assigned articles and manage comments in read-only mode.",
              route: "/editor",
              color: "bg-yellow-500 hover:bg-yellow-600",
            },
            {
              title: "Editor Workspace",
              desc: "Collaborate, edit manuscripts, and handle review workflows efficiently.",
              route: "/editor",
              color: "bg-red-600 hover:bg-red-700",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl font-semibold mb-3 text-blue-600">{s.title}</h4>
                <p className="mb-5">{s.desc}</p>
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => navigate(s.route)}
                  className={`${s.color} text-white w-full px-4 py-2 rounded-lg font-medium transition`}
                >
                  Go to {s.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-10">Our Global Clients</h3>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-80">
            {[
              "Elsevier",
              "Taylor & Francis",
              "PLOS",
              "Wolters Kluwer",
              "Springer Nature",
              "Medknow",
              "Bloomberg",
              "Peter Lang",
            ].map((name) => (
              <div
                key={name}
                className="text-lg font-medium text-gray-700 border border-gray-200 rounded-md px-4 py-2 bg-white"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-blue-900 text-white py-10 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {/* Address */}
          <div>
            <h5 className="text-lg font-semibold mb-2">Head Office</h5>
            <p>
              SYD Publishing Pvt. Ltd.<br />
              123 Knowledge Park,<br />
              Chennai, India 600042
            </p>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-2">Contact Us</h5>
            <p>📞 +91-44-2222-1111</p>
            <p>📧 info@SYDpublishing.com</p>
          </div>

          {/* Map */}
          <div>
            <h5 className="text-lg font-semibold mb-2">Find Us</h5>
            <iframe
              title="SYD Location"
              src="https://www.google.com/maps?q=Chennai,India&output=embed"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-300">
          © {new Date().getFullYear()} SYD Publishing. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
