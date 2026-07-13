import Hero from "./sections/Hero";

// Fallback local Navbar component to avoid missing module error
const Navbar = () => (
  <header className="w-full py-4 px-6 bg-transparent">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <h1 className="text-lg font-semibold">MF Chikankari</h1>
      <nav>
        <ul className="flex gap-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </div>
  </header>
);

function App() {
  return (
    <main className="bg-[#F8F5F0] min-h-screen">
      <Navbar />
      <Hero />
    </main>
  );
}

export default App;