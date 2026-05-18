// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBU2HcRd3B_edvFkdQxMFncSGI6GzHRrps",
  authDomain: "eco-barri0.firebaseapp.com",
  projectId: "eco-barri0",
  storageBucket: "eco-barri0.firebasestorage.app",
  messagingSenderId: "749028695342",
  appId: "1:749028695342:web:2c5a04012a1187b8ddaebf",
  measurementId: "G-PV1HXDJ7PR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);



// 4. Lógica para capturar el formulario y hacer el Login
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("EnviarForm"); // El ID de tu <form>
    
    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Capturas los valores de tus inputs
            const correo = document.getElementById("correo").value;
            const contrasenia = document.getElementById("contrasenia").value;
            
            try {
                // Intentar iniciar sesión en Firebase
                const userCredential = await signInWithEmailAndPassword(auth, correo, contrasenia);
                const user = userCredential.user;
                
                console.log("¡Logueado con éxito!", user.uid);
                
                // Si todo sale bien, lo mandas a tu panel de administración
                window.location.href = "admin/index.html";

                formulario.reset(); // Opcional: Limpia el formulario después de un login exitoso
                
            } catch (error) {
                console.error("Error al autenticar:", error.message);
                alert("Credenciales incorrectas. Inténtalo de nuevo.");
            }
        });
    }else {
        console.error("Ojo: No se encontró el formulario con ID 'EnviarForm' en este HTML.");
    }
});

