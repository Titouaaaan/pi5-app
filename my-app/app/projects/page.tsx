export default function Projects() {
 return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-300 font-bebas text-white text-3xl"
        style={{
            backgroundImage: "url(/bg_gif.gif)", // Replace with your GIF path
            backgroundSize: "cover", // Ensures the GIF covers the entire background
            backgroundPosition: "center", // Centers the background
            backgroundRepeat: "no-repeat", // Prevents the GIF from repeating
          }}>
            <div className='bg-black bg-opacity-70 rounded-xl p-10'> 
            <h1>Projects page!</h1>
            </div>
        </main>
 );
}