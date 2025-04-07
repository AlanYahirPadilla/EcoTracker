import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
import {
  SproutIcon as Seedling,
  Leaf,
  TreesIcon as Tree,
  TreesIcon as Forest,
  Award,
  ArrowRight,
  Trophy,
  Star,
  Lightbulb,
  Target,
  Zap,
  Users,
  Gift,
  Recycle,
} from "lucide-react"

export default function LevelSystem({ auth, userLevel = {}, allLevels = [] }) {
  // Para prevenir errores si falta data
  const currentLevel = userLevel?.currentLevel || 'Principiante';
  const userPoints = userLevel?.points || 0;
  const pointsToNext = userLevel?.pointsToNextLevel || 0;
  const achievement = userLevel?.achievement || 'Nivel Máximo Alcanzado';
  const totalPoints = userLevel?.totalPoints || 0;
  const progressPercentage = userLevel?.progressPercentage || 0;

  // Niveles estáticos para evitar problemas con la data actual
  const levelData = [
    {
      name: 'Principiante',
      pointsRange: '0-99 pts',
      requirementsList: ['Comienza tu viaje de reciclaje'],
      benefitsList: ['Acceso a recompensas básicas'],
      color: 'gray',
      userCount: 4
    },
    {
      name: 'Intermedio',
      pointsRange: '100-299 pts',
      requirementsList: ['Acumula 100 puntos reciclando'],
      benefitsList: ['Descuentos especiales en la cafetería'],
      color: 'blue',
      userCount: 1
    },
    {
      name: 'Avanzado',
      pointsRange: '300-599 pts',
      requirementsList: ['Acumula 300 puntos reciclando'],
      benefitsList: ['Puntos extra en el material participante'],
      color: 'purple',
      userCount: 0
    },
    {
      name: 'Experto',
      pointsRange: '600+ pts',
      requirementsList: ['Acumula 600 puntos reciclando'],
      benefitsList: ['Reconocimiento especial y recompensas exclusivas'],
      color: 'green',
      userCount: 2
    }
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sistema de Niveles</h2>}
    >
      <Head title="Sistema de Niveles" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Tu Progreso */}
          <div className="mb-8 overflow-hidden shadow-lg rounded-lg border border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Tu Progreso
              </h2>
            </div>
            
            <div className="bg-gradient-to-b from-green-50 to-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-green-600 font-medium">Nivel Actual</div>
                      <div className="text-2xl font-bold text-green-800">{currentLevel}</div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-4 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{userPoints} pts</span>
                      <span>{pointsToNext} pts para subir</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-600 font-medium">Felicidades</div>
                      <div className="text-lg font-bold text-yellow-800">{achievement}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-lg font-bold text-blue-800">Puntos Totales: <span className="text-blue-600">{totalPoints}</span></p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Niveles del Sistema */}
          <div className="mb-8 overflow-hidden shadow-lg rounded-lg border border-purple-200">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Niveles del Sistema
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-b from-purple-50 to-white">
              {levelData.map((level) => (
                <div 
                  key={level.name} 
                  className={`rounded-lg shadow-sm p-4 border transform hover:scale-105 transition-transform ${
                    level.name === currentLevel 
                      ? 'bg-gradient-to-b from-green-100 to-green-50 border-green-300' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-full mr-2 bg-${level.color}-100`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${level.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">{level.name}</h3>
                  </div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-${level.color}-100 text-${level.color}-800`}>
                    {level.pointsRange}
                  </div>
                  
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Requisitos</h4>
                  <ul className="space-y-1 text-sm text-gray-600 mb-3">
                    {level.requirementsList.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-block bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                          <svg className="h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                        </span>
                        {req}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Beneficios</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {level.benefitsList.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-block bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                          <svg className="h-2 w-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-3 text-center">
                    <span className="text-sm text-gray-500">
                      Usuarios en este nivel: <span className="font-medium text-gray-700">{level.userCount}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Consejos para Subir de Nivel */}
          <div className="overflow-hidden shadow-lg rounded-lg border border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Consejos para Subir de Nivel
              </h2>
            </div>
            
            <div className="bg-gradient-to-b from-orange-50 to-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-green-100 transform hover:scale-105 transition-transform hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Recicla Regularmente</h3>
                  </div>
                  <p className="text-gray-600">Establece una rutina de reciclaje. Incluso pequeñas cantidades suman puntos con el tiempo.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-5 border border-blue-100 transform hover:scale-105 transition-transform hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Diversifica tus Materiales</h3>
                  </div>
                  <p className="text-gray-600">Algunos materiales otorgan más puntos. Intenta reciclar diferentes tipos de materiales.</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-5 border border-purple-100 transform hover:scale-105 transition-transform hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Participa en Eventos</h3>
                  </div>
                  <p className="text-gray-600">Los eventos especiales de reciclaje pueden otorgar puntos adicionales. ¡Mantente atento!</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-100 transform hover:scale-105 transition-transform hover:shadow-md">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Invita a tus Amigos</h3>
                  </div>
                  <p className="text-gray-600">Comparte la aplicación con tus compañeros. Un campus más limpio beneficia a todos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Funciones auxiliares para obtener color e icono según el nivel
function getLevelColor(levelName) {
  switch (levelName) {
    case "Principiante":
      return "green-400"
    case "Intermedio":
      return "green-500"
    case "Avanzado":
      return "green-600"
    case "Experto":
      return "green-700"
    default:
      return "green-500"
  }
}

function getLevelIcon(levelName) {
  switch (levelName) {
    case "Principiante":
      return "Seedling"
    case "Intermedio":
      return "Leaf"
    case "Avanzado":
      return "Tree"
    case "Experto":
      return "Forest"
    default:
      return "Award"
  }
}



