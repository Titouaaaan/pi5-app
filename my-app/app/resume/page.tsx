export default function resume () {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-300 font-bebas text-black">
            <h1>This is my resume ig?</h1>

            {/* Call to Action */}
            <section className="mt-8 flex justify-center">
            <a
                href="/Titouan_Guerin_Resume_3.0.pdf" 
                download
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition transform hover:scale-105 animate-bubble"
            >
                Download my CV ! 
            </a>
            </section>
        </main>  
    );
}