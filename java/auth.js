let auth0Client = null;

const initAuth = async () => {
    // Inicialización de SDK
    auth0Client = await auth0.createAuth0Client({
        domain: "dev-rwx8qf84vup5szbf.us.auth0.com",
        clientId: "qBzMrizRfWu9my9FGgjpSEinEoeqlHvJ",
        authorizationParams: { redirect_uri: window.location.origin }
    });

    // Captura del retorno del login
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    // Verificación de estado y actualización de la interfaz
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        // Extracción segura del nombre
        document.getElementById("user-welcome").textContent = `¡Hola, ${user?.name || user?.email || 'Deportista'}!`;
        document.getElementById("login-btn").classList.add("hidden");
        document.getElementById("logout-btn").classList.remove("hidden");
    }
};

// Asignación de eventos a los botones
document.getElementById("login-btn").onclick = async () => { 
    // ESCUDO: Verificamos si Auth0 ya cargó
    if (auth0Client === null) {
        alert("El sistema de seguridad aún se está conectando o tu navegador lo bloqueó. Espera un segundo o recarga la página.");
        console.error("Fallo de tiempo: auth0Client sigue siendo null.");
        return; // Detiene la ejecución para que no estalle el error rojo
    }
    
    // Si todo está bien, ejecuta el login
    await auth0Client.loginWithRedirect(); 
};

document.getElementById("logout-btn").onclick = () => {
    sessionStorage.clear(); // Higiene de datos temporales
    auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
};

// Escuchador de carga seguro
window.addEventListener("load", async () => { await initAuth(); });




