"use client";

// bg-gradient-to-r from-indigo-500 from-10% via-sky-400 via-47% to-red-600 to-100%

export default function DownloadFinalVideo() {

  return (
    <div className="h-screen grid place-items-center">
      <main className="flex flex-col gap-6 text-center">
        <h2 className="text-7xl bg-gradient-to-r from-red-200 from-10% via-blue-500 via-50% to-cyan-400 to-100% bg-clip-text text-transparent">Tudo certo! <span className="animate-shake">👍</span></h2>
        <a href={""} download={`${""}__vh-editor.mp4`} className="bg-gradient-to-r from-red-200 from-10% via-blue-500 via-50% to-cyan-400 to-100% uppercase font-medium p-4 rounded-lg text-white hover:scale-105 duration-200">Clique aqui para baixar o vídeo</a>
      </main>
    </div>
  );
}