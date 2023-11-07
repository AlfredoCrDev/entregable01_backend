document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Solicitud de inicio de sesión
    const response = await fetch("/jwt/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      if (data.token) {
        // Almacena el token en el LocalStorage
        localStorage.setItem('token', data.token);

        if (data.user.rol === "admin") {
          // Redirige al perfil de administrador
          window.location.assign("/profile");
        } else if (data.user.rol === "usuario") {
          // Redirige a la página de productos para usuarios
          window.location.assign("/products");
        }
      } else {
        console.log("Error en el inicio de sesión");
      }
    } else {
      console.log("Error en el inicio de sesión");
    }
  });
});
