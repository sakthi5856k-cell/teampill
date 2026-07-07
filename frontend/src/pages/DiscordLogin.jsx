import { FaDiscord } from "react-icons/fa";

export default function Login() {

  const discordLogin = () => {

    window.location.href =
      "https://psgfamily.online/auth/discord/login";

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <div className="bg-slate-900 p-10 rounded-2xl w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-white">

          Team Pillbox

        </h1>

        <p className="text-slate-400 mt-3">

          EMS Staff Login

        </p>

        <button
          onClick={discordLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-xl transition"
        >

          <FaDiscord size={24} />

          Login with Discord

        </button>

      </div>

    </div>

  );

}
