import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
import { Trophy, Award, Medal, ChevronUp, Leaf, Star } from "lucide-react"

export default function Ranking({ 
  auth, 
  userRank = { position: 0, points: 0, level: "Principiante", pointsToNextLevel: 0 }, 
  topUsers = [
    { position: 1, name: "Usuario 1", points: 0 }, 
    { position: 2, name: "Usuario 2", points: 0 }, 
    { position: 3, name: "Usuario 3", points: 0 }
  ], 
  allUsers = [] 
}) {
  // Añadir una verificación antes de mapear
  const usersToRender = allUsers || [];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ranking de Reciclaje</h2>}
    >
      <Head title="Ranking de Reciclaje" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Tu posición en el ranking */}
          <div className="mb-8 overflow-hidden shadow-lg rounded-lg border border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-green-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Trophy className="mr-2 h-6 w-6" /> Tu Posición en el Ranking
              </h2>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-green-100 transform hover:scale-105 transition-transform">
                  <div className="text-green-600 text-sm font-medium mb-1">Posición</div>
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      #{userRank.position}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-blue-100 transform hover:scale-105 transition-transform">
                  <div className="text-blue-600 text-sm font-medium mb-1">Puntos Totales</div>
                  <div className="text-2xl font-bold text-blue-700">{userRank.points} pts</div>
                </div>
                
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-purple-100 transform hover:scale-105 transition-transform">
                  <div className="text-purple-600 text-sm font-medium mb-1">Nivel</div>
                  <div className="flex items-center gap-1">
                    {userRank.level === "Experto" && <Star className="text-purple-500 h-5 w-5" />}
                    <div className="text-xl font-bold text-purple-700">{userRank.level}</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-orange-100 transform hover:scale-105 transition-transform">
                  <div className="text-orange-600 text-sm font-medium mb-1">Puntos para subir</div>
                  <div className="flex items-center gap-1">
                    <ChevronUp className="text-orange-500 h-5 w-5" />
                    <div className="text-xl font-bold text-orange-600">{userRank.pointsToNextLevel} pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Recicladores */}
          <div className="mb-8 overflow-hidden shadow-lg rounded-lg border border-yellow-200">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Award className="mr-2 h-6 w-6" /> Top Recicladores
              </h2>
            </div>
            
            <div className="bg-gradient-to-b from-yellow-50 to-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Segundo lugar */}
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform border-2 border-gray-300">
                    <div className="inline-block bg-gray-200 p-3 rounded-full mb-4">
                      <Medal className="h-10 w-10 text-gray-500" />
                    </div>
                    <div className="text-xl font-bold mb-1 text-gray-700">#2</div>
                    <div className="font-medium text-gray-600">{topUsers[1].name}</div>
                    <div className="text-gray-500 font-bold mt-2">{topUsers[1].points} pts</div>
                  </div>
                </div>
                
                {/* Primer lugar */}
                <div className="order-1 md:order-2">
                  <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg shadow-md p-8 text-center transform hover:scale-110 transition-transform border-2 border-yellow-400">
                    <div className="inline-block bg-yellow-200 p-4 rounded-full mb-4">
                      <Trophy className="h-12 w-12 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold mb-1 text-yellow-800">#1</div>
                    <div className="font-medium text-yellow-700">{topUsers[0].name}</div>
                    <div className="text-yellow-600 font-bold mt-2 text-xl">{topUsers[0].points} pts</div>
                  </div>
                </div>
                
                {/* Tercer lugar */}
                <div className="order-3">
                  <div className="bg-gradient-to-b from-orange-100 to-orange-50 rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform border-2 border-orange-300">
                    <div className="inline-block bg-orange-200 p-3 rounded-full mb-4">
                      <Medal className="h-10 w-10 text-orange-600" />
                    </div>
                    <div className="text-xl font-bold mb-1 text-orange-700">#3</div>
                    <div className="font-medium text-orange-600">{topUsers[2].name}</div>
                    <div className="text-orange-500 font-bold mt-2">{topUsers[2].points} pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabla de clasificación */}
          <div className="overflow-hidden shadow-lg rounded-lg border border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Leaf className="mr-2 h-6 w-6" /> Tabla de Clasificación
              </h2>
            </div>
            
            <div className="overflow-x-auto bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                      Posición
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                      Nivel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                      Material más reciclado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersToRender.length > 0 ? (
                    usersToRender.map((user, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                              user.position <= 3 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.position}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.level === 'Principiante' ? 'bg-blue-100 text-blue-800' : ''}
                            ${user.level === 'Intermedio' ? 'bg-purple-100 text-purple-800' : ''}
                            ${user.level === 'Experto' ? 'bg-green-100 text-green-800' : ''}
                            ${user.level === 'Maestro' ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {user.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {user.points === 0 ? (
                            <span className="text-gray-400">0 pts</span>
                          ) : (
                            <span className="text-green-600">{user.points} pts</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.topMaterial === 'Desconocido' ? (
                            <span className="text-gray-400">Desconocido</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.topMaterial}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        No hay datos de usuarios disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

