document.addEventListener("DOMContentLoaded", () => {
    const year = new Date().getFullYear();
    
    const contenedoryear = document.getElementById("Anio");

    if (contenedoryear) {
        contenedoryear.textContent = year;
    }
    else {
        console.warn("NO se puede actualizar el año.");
        alert(contenedoryear.textContent = "2026");
    }
});