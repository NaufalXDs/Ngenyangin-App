export default function Navbar() {
  return (
    <header
      id="navbar"
      className="bg-white shadow-sm shadow-gray-400/30 w-full max-w-full mt-1 mx-auto flex items-center p-2 backdrop-blur-md justify-between overflow-hidden"
    >
      <a href="/">
        <img
          src="/icons.png"
          alt=""
          width={151.45}
          height={52}
          className="max-w-full"
        />
      </a>
      <nav className="font-sans text-[15px] text-black flex space-x-5 list-none justify-between">
        <li>{new Date().toLocaleDateString("id-ID")}</li>
      </nav>
    </header>
  );
}
