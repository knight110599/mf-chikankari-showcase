function Navbar() {
  return (
    <nav className="w-full px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-3xl text-[#0F4C3A]"
          style={{ fontFamily: "Cormorant Garamond" }}
        >
          MF Chikankari
        </h1>

        <ul
          className="hidden md:flex gap-8 text-[#2E2A27]"
          style={{ fontFamily: "Poppins" }}
        >
          <li>Home</li>
          <li>About</li>
          <li>Collections</li>
          <li>Gallery</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;