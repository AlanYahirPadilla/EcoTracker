// Este script maneja el error de respuesta JSON en Inertia
document.addEventListener('DOMContentLoaded', function() {
    function checkForInertiaError() {
      // Buscar mensaje de error de Inertia
      const errorElements = document.querySelectorAll('body > div');
      for (const errorElement of errorElements) {
        if (errorElement.textContent && errorElement.textContent.includes('All Inertia requests must receive a valid Inertia response')) {
          try {
            // Extraer el JSON de la respuesta
            const jsonText = errorElement.textContent.split('received.')[1].trim();
            const jsonData = JSON.parse(jsonText);
            
            if (jsonData.success && jsonData.redemption_code) {
              // Obtener los puntos actuales del usuario
              let currentPoints = 560; // Por defecto
              try {
                // Intentar obtener los puntos actuales del DOM
                const userDataElement = document.querySelector('#app');
                if (userDataElement) {
                  const userData = JSON.parse(userDataElement.getAttribute('data-page'));
                  currentPoints = userData.props.auth.user.points;
                }
              } catch (e) {
                console.error("Error obteniendo puntos del usuario", e);
              }
              
              // Ocultar el mensaje de error
              errorElement.style.display = 'none';
              
              // Crear un modal bonito
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
              modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4">
                  <div class="p-6">
                    <div class="text-center mb-4">
                      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 class="text-xl font-semibold text-green-600">¡Canje Exitoso!</h2>
                      <p class="mt-1 text-gray-600">Has canjeado tu recompensa correctamente.</p>
                    </div>
                    
                    <div class="bg-green-50 border border-green-100 rounded-md p-4 text-center mb-4">
                      <div class="text-sm text-gray-600 mb-2">Tu código de canje:</div>
                      <div class="font-mono bg-white border border-gray-200 rounded-md p-3 text-lg text-center relative">
                        ${jsonData.redemption_code}
                        <button 
                          onclick="navigator.clipboard.writeText('${jsonData.redemption_code}')"
                          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          title="Copiar al portapapeles"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div class="text-center mb-4">
                      <div class="text-sm font-medium text-gray-700">Puntos restantes:</div>
                      <div class="text-2xl font-bold text-emerald-600">${currentPoints}</div>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                      <p class="text-sm text-gray-700 mb-2">Presenta este código en el lugar correspondiente para reclamar tu recompensa:</p>
                      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Para cafetería: Muestra el código en la caja</li>
                        <li>Para puntos extra: Comunícate con tu profesor</li>
                        <li>Para productos: Acude al centro de reciclaje</li>
                      </ul>
                    </div>
                    
                    <div class="mt-6 flex justify-center">
                      <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700"
                        onclick="window.location.href = '/rewards'"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
              return true;
            }
          } catch (e) {
            console.error("Error procesando JSON", e);
          }
        }
      }
      return false;
    }
  
    // Intentar 10 veces con un intervalo de 200ms
    let attempts = 0;
    const maxAttempts = 10;
    
    function attemptCheck() {
      if (attempts >= maxAttempts) return;
      
      if (!checkForInertiaError()) {
        attempts++;
        setTimeout(attemptCheck, 200);
      }
    }
    
    // Iniciar verificación
    attemptCheck();
  });