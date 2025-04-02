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
} from "lucide-react"

export default function LevelSystem({
  auth,
  levels,
  currentLevel,
  nextLevel,
  pointsToNextLevel,
  userPoints,
  progress,
  userStats,
}) {
  // Función para obtener el icono correspondiente
  const getIcon = (iconName, className = "h-6 w-6") => {
    switch (iconName) {
      case "Seedling":
        return <Seedling className={className} />
      case "Leaf":
        return <Leaf className={className} />
      case "Tree":
        return <Tree className={className} />
      case "Forest":
        return <Forest className={className} />
      default:
        return <Award className={className} />
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sistema de Niveles</h2>}
    >
      <Head title="Sistema de Niveles" />

      <div className="max-w-7xl mx-auto">
        {/* Sección de progreso del usuario */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Progreso</h3>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-4 flex-1">
                <div className={`bg-${getLevelColor(currentLevel)} p-3 rounded-full text-white`}>
                  {getIcon(getLevelIcon(currentLevel))}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nivel Actual</p>
                  <p className="text-xl font-bold">{currentLevel}</p>
                </div>
              </div>

              {nextLevel && (
                <>
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4 flex-1">
                    <div className={`bg-${getLevelColor(nextLevel)} p-3 rounded-full text-white opacity-60`}>
                      {getIcon(getLevelIcon(nextLevel))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Siguiente Nivel</p>
                      <p className="text-xl font-bold">{nextLevel}</p>
                      <p className="text-sm text-gray-500">
                        Faltan <span className="font-medium text-green-600">{pointsToNextLevel} puntos</span>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {!nextLevel && (
                <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-4 flex-1">
                  <div className="bg-yellow-500 p-3 rounded-full text-white">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">¡Felicidades!</p>
                    <p className="text-xl font-bold">Nivel Máximo Alcanzado</p>
                  </div>
                </div>
              )}
            </div>

            {nextLevel && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso hacia {nextLevel}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`bg-${getLevelColor(currentLevel)} h-2.5 rounded-full`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Puntos Totales</h4>
              </div>
              <p className="text-3xl font-bold text-blue-600">{userPoints}</p>
            </div>
          </div>
        </div>

        {/* Sección de niveles */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Niveles del Sistema</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {levels.map((level) => (
                <div
                  key={level.name}
                  className={`border rounded-lg overflow-hidden ${
                    currentLevel === level.name ? "border-green-500 shadow-md" : "border-gray-200"
                  }`}
                >
                  <div className={`bg-${level.color} p-4 text-white flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      {getIcon(level.icon)}
                      <h4 className="font-bold">{level.name}</h4>
                    </div>
                    <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">{level.range} pts</span>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Requisitos</h5>
                      <p className="text-sm">{level.requirements}</p>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Beneficios</h5>
                      <p className="text-sm">{level.benefits}</p>
                    </div>
                    <p className="text-sm text-gray-600 italic">{level.description}</p>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Usuarios en este nivel</span>
                        <span className="text-sm font-medium">{userStats[level.name]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección de consejos */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Consejos para Subir de Nivel</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Recicla Regularmente</h4>
                <p className="text-sm text-gray-700">
                  Establece una rutina de reciclaje. Incluso pequeñas cantidades suman puntos con el tiempo.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Diversifica tus Materiales</h4>
                <p className="text-sm text-gray-700">
                  Algunos materiales otorgan más puntos. Intenta reciclar diferentes tipos de materiales.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Participa en Eventos</h4>
                <p className="text-sm text-gray-700">
                  Los eventos especiales de reciclaje pueden otorgar puntos adicionales. ¡Mantente atento!
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Invita a tus Amigos</h4>
                <p className="text-sm text-gray-700">
                  Comparte la aplicación con tus compañeros. Un campus más limpio beneficia a todos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
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



